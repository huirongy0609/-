from __future__ import annotations

from datetime import datetime
from pathlib import Path


FINAL_SECTION_ORDER = [
    "今日主题",
    "爆款标题",
    "公众号长文",
    "短视频口播稿",
    "小红书版本",
    "直播转化稿",
    "封面提示词",
    "视频分镜",
    "数据复盘",
    "最终质检结果",
]


class MarkdownExporter:
    def __init__(self, output_file: Path) -> None:
        self.output_file = output_file

    def export(
        self,
        *,
        topic: str,
        sections: dict[str, str],
        section_order: list[str] | None = None,
        mode_label: str = "OpenAI API 自动流水线",
    ) -> Path:
        lines: list[str] = [
            f"# 内容生产包：{topic}",
            "",
            f"> 生成时间：{datetime.now().strftime('%Y-%m-%d %H:%M:%S')}",
            f"> 生成方式：{mode_label}",
            "",
        ]

        for heading in section_order or FINAL_SECTION_ORDER:
            content = sections.get(heading, "").strip()
            lines.extend([f"# {heading}", "", content or "（本节未生成内容）", ""])

        self.output_file.parent.mkdir(parents=True, exist_ok=True)
        self.output_file.write_text("\n".join(lines), encoding="utf-8")
        return self.output_file
