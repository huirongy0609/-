from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Protocol

from analytics.performance_logger import PerformanceLogger
from analytics.scoring_engine import ScoreReport, ScoringEngine
from analytics.viral_pattern_detector import ViralPatternDetector
from core.markdown_exporter import MarkdownExporter
from core.prompt_loader import AGENTS, LITE_AGENTS, AgentDefinition, PromptLoader


class TextGenerator(Protocol):
    def generate(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        model: str | None = None,
        temperature: float | None = None,
        max_tokens: int | None = None,
    ) -> str:
        ...


@dataclass
class PipelineResult:
    output_file: Path
    quality_passed: bool
    quality_rounds: int
    agent_count: int


class PipelineEngine:
    """Stable production engine.

    Rules:
    - Every content agent runs at most once.
    - Quality check runs at most once.
    - No automatic AI rewrite loops.
    - Local analytics scores once and never rewrites content.
    - LOW_TOKEN_MODE keeps each agent input limited to declared dependencies.
    """

    def __init__(
        self,
        *,
        prompt_loader: PromptLoader,
        exporter: MarkdownExporter,
        ai_client: TextGenerator,
        performance_logger: PerformanceLogger | None = None,
        lite: bool = False,
        low_token_mode: bool = True,
    ) -> None:
        self.prompt_loader = prompt_loader
        self.exporter = exporter
        self.ai_client = ai_client
        self.scoring_engine = ScoringEngine()
        self.pattern_detector = ViralPatternDetector()
        self.performance_logger = performance_logger
        self.lite = lite
        self.low_token_mode = low_token_mode

    def run(self, topic: str) -> PipelineResult:
        raw_outputs: dict[str, str] = {}
        sections: dict[str, str] = {}
        agents = LITE_AGENTS if self.lite else AGENTS

        for agent in agents:
            if agent.key == "quality_check_agent":
                continue
            print(f"Agent: {agent.key}")
            output = self._run_agent(agent, topic, raw_outputs)
            raw_outputs[agent.key] = output
            if agent.final_heading == "今日主题":
                sections["今日主题"] = self._merge_today_topic(
                    topic=topic,
                    master_output=raw_outputs.get("master_controller", ""),
                    topic_output=raw_outputs.get("topic_agent", ""),
                )
            else:
                sections[agent.final_heading] = output

        quality_passed = True
        quality_rounds = 0
        if not self.lite:
            print("Agent: quality_check_agent")
            quality_rounds = 1
            draft = self._build_package_text(topic, sections)
            quality_output = self._run_quality_check(topic, draft)
            sections["最终质检结果"] = quality_output
            quality_passed = self._quality_passed(quality_output)

        sections["数据复盘"], final_score = self._run_analytics(
            topic=topic,
            sections=sections,
            quality_passed=quality_passed,
        )

        section_order = (
            ["爆款标题", "公众号长文", "短视频口播稿"]
            if self.lite
            else None
        )
        output_file = self.exporter.export(
            topic=topic,
            sections=sections,
            section_order=section_order,
            mode_label="Lite 低成本模式" if self.lite else "OpenAI API 稳定生产模式",
        )
        self._log_performance(
            topic=topic,
            output_file=output_file,
            final_score=final_score,
            quality_passed=quality_passed,
            sections=sections,
        )
        return PipelineResult(
            output_file=output_file,
            quality_passed=quality_passed,
            quality_rounds=quality_rounds,
            agent_count=len([agent for agent in agents if agent.key != "quality_check_agent"]) + quality_rounds,
        )

    def _run_analytics(
        self,
        *,
        topic: str,
        sections: dict[str, str],
        quality_passed: bool,
    ) -> tuple[str, ScoreReport]:
        draft = self._build_package_text(topic, sections)
        score = self.scoring_engine.score(draft)
        pattern_report = self.pattern_detector.detect(draft)
        analytics_markdown = "\n\n".join(
            [
                "# 数据反馈复盘",
                "## 本次评分",
                score.to_markdown(),
                "## 爆款结构检测",
                pattern_report.to_markdown(),
                (
                    "## 质量状态\n\n"
                    f"- AI 质检是否通过：{'是' if quality_passed else '否'}\n"
                    f"- 本地评分是否达标：{'是' if score.total_score >= 80 else '否'}\n"
                    "- 自动重写：已关闭\n"
                    "- 自动优化循环：已关闭"
                ),
            ]
        )
        return analytics_markdown, score

    def _log_performance(
        self,
        *,
        topic: str,
        output_file: Path,
        final_score: ScoreReport,
        quality_passed: bool,
        sections: dict[str, str],
    ) -> None:
        if not self.performance_logger:
            return
        pattern_report = self.pattern_detector.detect(self._build_package_text(topic, sections))
        self.performance_logger.log(
            topic=topic,
            output_file=output_file,
            total_score=final_score.total_score,
            ai_flavor_degree=final_score.ai_flavor_degree,
            quality_passed=quality_passed,
            optimization_rounds=0,
            dimensions=final_score.dimensions,
            patterns={
                "title_patterns": pattern_report.title_patterns,
                "opening_patterns": pattern_report.opening_patterns,
                "transition_patterns": pattern_report.transition_patterns,
                "closing_patterns": pattern_report.closing_patterns,
            },
        )

    def _run_agent(
        self,
        agent: AgentDefinition,
        topic: str,
        raw_outputs: dict[str, str],
    ) -> str:
        system_prompt = self.prompt_loader.load(agent.prompt_file)
        user_prompt = self._build_agent_input(topic, agent, raw_outputs)
        return self.ai_client.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=agent.temperature,
            max_tokens=agent.max_tokens,
        )

    def _run_quality_check(self, topic: str, draft: str) -> str:
        agent = next(item for item in AGENTS if item.key == "quality_check_agent")
        system_prompt = self.prompt_loader.load(agent.prompt_file)
        user_prompt = f"""用户主题：
{topic}

请只做一次质量检查。不要要求自动重写，只输出最关键的发布风险和人工修改建议。

内容包：

{self._compact_context(draft, 9000)}
"""
        return self.ai_client.generate(
            system_prompt=system_prompt,
            user_prompt=user_prompt,
            temperature=agent.temperature,
            max_tokens=agent.max_tokens,
        )

    def _build_agent_input(
        self,
        topic: str,
        agent: AgentDefinition,
        raw_outputs: dict[str, str],
    ) -> str:
        keys = agent.dependencies or tuple(raw_outputs.keys())
        context = "\n\n".join(
            f"## {key}\n{self._compact_context(value)}"
            for key, value in raw_outputs.items()
            if key in keys
        )
        return f"""用户主题：
{topic}

当前 Agent：
{agent.key}

必要上游内容：
{context or "无。请只根据用户主题完成当前 Agent 任务。"}

LOW_TOKEN_MODE：只使用以上必要信息，不要索要或假设完整项目上下文。
"""

    def _compact_context(self, value: str, limit: int = 3000) -> str:
        if not self.low_token_mode or len(value) <= limit:
            return value
        return value[:limit] + "\n\n（上游内容已按 LOW_TOKEN_MODE 截断。）"

    def _merge_today_topic(self, *, topic: str, master_output: str, topic_output: str) -> str:
        parts = [f"## 原始主题\n\n{topic}"]
        if master_output:
            parts.append(f"## 总控拆解\n\n{self._compact_context(master_output, 1600)}")
        if topic_output:
            parts.append(f"## 爆款选题分析\n\n{self._compact_context(topic_output, 2200)}")
        return "\n\n".join(parts)

    def _build_package_text(self, topic: str, sections: dict[str, str]) -> str:
        lines = [f"# 内容生产包：{topic}", ""]
        for heading, content in sections.items():
            lines.extend([f"# {heading}", "", content, ""])
        return "\n".join(lines)

    def _quality_passed(self, quality_output: str) -> bool:
        normalized = quality_output.upper()
        if "QUALITY_STATUS: PASS" in normalized:
            return True
        if "QUALITY_STATUS: FAIL" in normalized:
            return False
        score_match = re.search(r"(?:总体评分|爆款浓度评分|评分)[^\d]{0,10}(\d{1,3})", quality_output)
        return bool(score_match and int(score_match.group(1)) >= 80)
