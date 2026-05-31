from __future__ import annotations

from dataclasses import dataclass
from pathlib import Path


@dataclass(frozen=True)
class AgentDefinition:
    key: str
    prompt_file: str
    final_heading: str
    temperature: float = 0.8
    max_tokens: int = 6000
    dependencies: tuple[str, ...] = ()


AGENTS: list[AgentDefinition] = [
    AgentDefinition("master_controller", "00_master_controller.md", "今日主题", 0.6, 2200),
    AgentDefinition("topic_agent", "01_topic_agent.md", "今日主题", 0.75, 3000, ("master_controller",)),
    AgentDefinition("title_agent", "02_title_agent.md", "爆款标题", 0.9, 2200, ("topic_agent",)),
    AgentDefinition("wechat_writer_agent", "03_wechat_writer_agent.md", "公众号长文", 0.78, 5200, ("topic_agent", "title_agent")),
    AgentDefinition("short_video_agent", "04_short_video_agent.md", "短视频口播稿", 0.85, 3600, ("title_agent", "wechat_writer_agent")),
    AgentDefinition("live_selling_agent", "05_live_selling_agent.md", "直播转化稿", 0.78, 4200, ("topic_agent", "wechat_writer_agent")),
    AgentDefinition("xiaohongshu_agent", "06_xiaohongshu_agent.md", "小红书版本", 0.85, 3200, ("title_agent", "wechat_writer_agent")),
    AgentDefinition("cover_prompt_agent", "07_cover_prompt_agent.md", "封面提示词", 0.7, 2200, ("topic_agent", "title_agent")),
    AgentDefinition("video_storyboard_agent", "08_video_storyboard_agent.md", "视频分镜", 0.75, 3600, ("short_video_agent",)),
    AgentDefinition("quality_check_agent", "09_quality_check_agent.md", "最终质检结果", 0.25, 2600),
]


LITE_AGENTS: list[AgentDefinition] = [
    AgentDefinition("title_agent", "02_title_agent.md", "爆款标题", 0.85, 1600),
    AgentDefinition("wechat_writer_agent", "03_wechat_writer_agent.md", "公众号长文", 0.75, 4200, ("title_agent",)),
    AgentDefinition("short_video_agent", "04_short_video_agent.md", "短视频口播稿", 0.82, 2400, ("title_agent", "wechat_writer_agent")),
]


STYLE_FILES = [
    "style_rules.md",
    "tone_library.md",
    "emotional_hooks.md",
    "transition_patterns.md",
    "closing_templates.md",
    "viral_structures.md",
]

BRAND_OS_FILES = [
    "brand_worldview.md",
    "brand_voice.md",
    "emotion_rhythm.md",
    "visual_philosophy.md",
    "brand_personality.md",
    "forbidden_rules.md",
]


class PromptLoader:
    def __init__(
        self,
        prompts_dir: Path,
        style_dir: Path | None = None,
        brand_os_dir: Path | None = None,
        low_token_mode: bool = True,
    ) -> None:
        self.prompts_dir = prompts_dir
        self.style_dir = style_dir
        self.brand_os_dir = brand_os_dir
        self.low_token_mode = low_token_mode

    def load(self, prompt_file: str) -> str:
        path = self.prompts_dir / prompt_file
        if not path.exists():
            raise FileNotFoundError(f"缺少 prompt 文件：{path}")
        prompt = path.read_text(encoding="utf-8").strip()
        brand_os_context = self.load_brand_os_context()
        style_context = self.load_style_context()
        contexts: list[str] = []
        if brand_os_context:
            contexts.append(
                f"""# Brand OS 全局品牌操作系统

以下品牌规则优先级高于当前 Agent 的局部写作习惯。所有输出必须先服从 Brand OS，再执行当前 Agent 任务。

{brand_os_context}"""
            )
        if style_context:
            contexts.append(
                f"""# 全局风格训练库

以下风格规则对当前 Agent 强制生效。所有输出都必须遵守。

{style_context}"""
            )
        if not contexts:
            return prompt
        joined_context = "\n\n---\n\n".join(contexts)
        return f"""{prompt}

---

{joined_context}
"""

    def load_brand_os_context(self) -> str:
        if not self.brand_os_dir or not self.brand_os_dir.exists():
            return ""

        if self.low_token_mode:
            compact_path = self.brand_os_dir / "brand_os_compact.md"
            if compact_path.exists():
                return compact_path.read_text(encoding="utf-8").strip()
            return """低上下文 Brand OS：
- 信托制物业是一套关于“信任如何被重新建立”的新治理文明。
- 语言像纪录片旁白：短句、克制、冷静、有判断。
- 核心圣物是共同资产治理账本，它代表信任被记录下来的证据。
- 禁止 SaaS 感、课程销售感、培训机构感、国产营销页感。
- 用户看完应觉得：他们在重新定义物业行业的信任秩序。"""

        sections: list[str] = []
        for file_name in BRAND_OS_FILES:
            path = self.brand_os_dir / file_name
            if path.exists():
                sections.append(path.read_text(encoding="utf-8").strip())
        return "\n\n".join(sections)

    def load_style_context(self) -> str:
        if self.low_token_mode:
            return """低上下文风格规则：
- 像中文头部自媒体，不像 AI。
- 第一段必须有冲突、情绪和具体人群。
- 每段有观点、有信息密度、有节奏。
- 禁止空话、套话、正能量废话、过度标题党。
- 自然转化，不硬卖，不承诺保证结果。"""

        if not self.style_dir or not self.style_dir.exists():
            return ""

        sections: list[str] = []
        for file_name in STYLE_FILES:
            path = self.style_dir / file_name
            if path.exists():
                sections.append(path.read_text(encoding="utf-8").strip())
        return "\n\n".join(sections)
