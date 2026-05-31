from __future__ import annotations

import re
from dataclasses import dataclass, field

from analytics.scoring_engine import ScoringEngine, ScoreReport


@dataclass
class OptimizationResult:
    optimized_content: str
    before_score: ScoreReport
    after_score: ScoreReport
    rounds: int
    optimization_log: list[str] = field(default_factory=list)
    before_after: list[str] = field(default_factory=list)

    def to_markdown(self) -> str:
        lines = [
            "## 自动优化过程",
            "",
            f"- 优化前总分：{self.before_score.total_score}/100",
            f"- 优化后总分：{self.after_score.total_score}/100",
            f"- 优化轮次：{self.rounds}",
            "",
            "### 优化动作",
        ]
        lines.extend(f"- {item}" for item in self.optimization_log)
        lines.extend(["", "### 优化前后对比"])
        lines.extend(f"- {item}" for item in self.before_after)
        return "\n".join(lines)


class RewriteOptimizer:
    def __init__(self, scoring_engine: ScoringEngine | None = None) -> None:
        self.scoring_engine = scoring_engine or ScoringEngine()

    def optimize_until_pass(self, content: str, threshold: int = 80, max_rounds: int = 3) -> OptimizationResult:
        before = self.scoring_engine.score(content)
        current = content
        log: list[str] = []
        before_after: list[str] = []

        if before.total_score >= threshold:
            return OptimizationResult(
                optimized_content=current,
                before_score=before,
                after_score=before,
                rounds=0,
                optimization_log=["评分已达标，未触发自动重写。"],
                before_after=["优化前后无变化。"],
            )

        for round_index in range(1, max_rounds + 1):
            score = self.scoring_engine.score(current)
            if score.total_score >= threshold:
                break
            current = self._enhance(current, score)
            log.append(f"第 {round_index} 轮：重写开头、增强冲突、补金句、补转化收口。")

        after = self.scoring_engine.score(current)
        before_after.append(f"开头：{before.weakest_part} -> {after.strongest_part}")
        before_after.append(f"AI味：{before.ai_flavor_degree}/100 -> {after.ai_flavor_degree}/100")
        before_after.append(f"总分：{before.total_score}/100 -> {after.total_score}/100")

        return OptimizationResult(
            optimized_content=current,
            before_score=before,
            after_score=after,
            rounds=len(log),
            optimization_log=log,
            before_after=before_after,
        )

    def _enhance(self, content: str, score: ScoreReport) -> str:
        enhanced = content
        if score.dimensions["开头吸引力"] < 80:
            enhanced = self._rewrite_opening(enhanced)
        if score.dimensions["冲突感"] < 80:
            enhanced = self._add_conflict(enhanced)
        if score.dimensions["情绪强度"] < 80:
            enhanced = self._add_emotion(enhanced)
        if score.dimensions["金句密度"] < 80:
            enhanced = self._add_quotes(enhanced)
        if score.dimensions["转化能力"] < 80:
            enhanced = self._add_conversion(enhanced)
        enhanced = self._reduce_ai_flavor(enhanced)
        return enhanced

    def _rewrite_opening(self, content: str) -> str:
        hook = (
            "## 优化后的强开头\n\n"
            "很多人还没意识到，真正拉开差距的不是谁更努力，而是谁先换掉了旧的内容生产方式。\n\n"
            "你以为自己只是写得慢，其实是每一次都在从零开始。这个问题不会立刻毁掉账号，但会一点点耗光更新的耐心。\n\n"
        )
        return self._insert_after_heading(content, "公众号长文", hook)

    def _add_conflict(self, content: str) -> str:
        block = (
            "\n\n## 冲突增强\n\n"
            "这件事的核心冲突是：一边是还在靠灵感硬撑的人，一边是已经用流程稳定产出的人。\n\n"
            "你以为差距来自表达能力，其实差距来自生产结构。旧方法解决的是“今天写什么”，新方法解决的是“我如何持续产出”。\n"
        )
        return self._insert_after_heading(content, "公众号长文", block)

    def _add_emotion(self, content: str) -> str:
        block = (
            "\n\n## 情绪增强\n\n"
            "最扎心的地方在于，很多人不是不努力，而是努力都消耗在重复纠结里。打开文档、改标题、删开头、怀疑自己，最后一整晚过去，只剩下一段没法发布的草稿。\n"
        )
        return self._insert_after_heading(content, "公众号长文", block)

    def _add_quotes(self, content: str) -> str:
        block = (
            "\n\n## 金句增强\n\n"
            "- 你不是缺灵感，你是缺一套能反复使用的生产系统。\n"
            "- 内容越想稳定，越不能靠临场发挥。\n"
            "- 真正的提效，不是写得更快，而是少在错误问题上浪费时间。\n"
        )
        return self._insert_after_heading(content, "短视频口播稿", block)

    def _add_conversion(self, content: str) -> str:
        block = (
            "\n\n## 转化增强\n\n"
            "如果你不想继续靠感觉硬撑，下一步不是收藏更多技巧，而是把选题、标题、正文、短视频和转化稿串成一条流程。可以先从一本系统书开始，也可以跟着课程跑一遍完整内容生产。如果你的账号已经有基础，更适合做一次内容诊断，直接找出卡住增长和转化的那几个环节。\n"
        )
        return self._insert_after_heading(content, "直播转化稿", block)

    def _reduce_ai_flavor(self, content: str) -> str:
        replacements = {
            "随着时代发展": "这两年最明显的变化是",
            "在当今社会": "放到今天看",
            "众所周知": "很多人都知道",
            "首先": "第一步",
            "其次": "第二步",
            "最后": "收尾时",
            "赋能": "帮你省掉重复消耗",
            "闭环": "完整流程",
        }
        for old, new in replacements.items():
            content = content.replace(old, new)
        return content

    def _insert_after_heading(self, content: str, heading: str, block: str) -> str:
        pattern = rf"(?m)^# {re.escape(heading)}\s*$"
        match = re.search(pattern, content)
        if not match:
            return block + "\n\n" + content
        insert_at = match.end()
        return content[:insert_at] + "\n\n" + block.strip() + "\n" + content[insert_at:]
