from __future__ import annotations

import re
from dataclasses import dataclass


@dataclass
class ViralPatternReport:
    title_patterns: list[str]
    opening_patterns: list[str]
    emotion_rhythm: list[str]
    transition_patterns: list[str]
    closing_patterns: list[str]
    likely_to_work: list[str]

    def to_markdown(self) -> str:
        lines = ["## 爆款结构识别", ""]
        groups = [
            ("标题模式", self.title_patterns),
            ("开头模式", self.opening_patterns),
            ("情绪节奏", self.emotion_rhythm),
            ("转折结构", self.transition_patterns),
            ("收口方式", self.closing_patterns),
            ("更容易爆的结构判断", self.likely_to_work),
        ]
        for title, items in groups:
            lines.extend([f"### {title}"])
            lines.extend(f"- {item}" for item in items)
            lines.append("")
        return "\n".join(lines)


class ViralPatternDetector:
    def detect(self, content: str) -> ViralPatternReport:
        return ViralPatternReport(
            title_patterns=self._title_patterns(content),
            opening_patterns=self._opening_patterns(content),
            emotion_rhythm=self._emotion_rhythm(content),
            transition_patterns=self._transition_patterns(content),
            closing_patterns=self._closing_patterns(content),
            likely_to_work=self._likely_to_work(content),
        )

    def _title_patterns(self, content: str) -> list[str]:
        patterns = []
        if re.search(r"不是.+而是", content):
            patterns.append("反差判断型：不是 A，而是 B。")
        if "真正" in content:
            patterns.append("真相揭示型：用“真正……”制造认知落差。")
        if any(token in content for token in ["普通人", "职场人", "中产", "知识博主"]):
            patterns.append("具体人群型：标题里锁定明确用户。")
        return patterns or ["标题模式不明显，需要加强人群、冲突和结果承诺。"]

    def _opening_patterns(self, content: str) -> list[str]:
        opening = "\n".join(content.splitlines()[:20])
        patterns = []
        if "很多人" in opening:
            patterns.append("群体戳穿型：用“很多人”制造代入感。")
        if any(word in opening for word in ["可怕", "残酷", "危险"]):
            patterns.append("高压提醒型：开头先制造问题临近感。")
        if "你以为" in opening:
            patterns.append("误区反转型：先说用户以为，再揭示真正问题。")
        return patterns or ["开头钩子偏弱，需要第一句直接进入冲突。"]

    def _emotion_rhythm(self, content: str) -> list[str]:
        items = []
        if content.count("但") + content.count("真正") > 8:
            items.append("有连续转折，具备情绪推进基础。")
        if content.count("你") > 20:
            items.append("第二人称较多，用户代入感较强。")
        if content.count("。") > 80:
            items.append("长文节奏较完整，但要检查是否重复。")
        return items or ["情绪节奏不明显，需要压出“刺痛-转折-方法-收口”的曲线。"]

    def _transition_patterns(self, content: str) -> list[str]:
        found = []
        for phrase in ["但问题是", "真正残酷的是", "更危险的是", "大部分人不知道的是", "换句话说"]:
            if phrase in content:
                found.append(f"已使用转折：{phrase}")
        return found or ["缺少强转折句，容易读起来平。"]

    def _closing_patterns(self, content: str) -> list[str]:
        patterns = []
        if any(word in content for word in ["课程", "训练", "陪跑"]):
            patterns.append("课程 / 陪跑转化。")
        if "咨询" in content or "服务" in content:
            patterns.append("咨询 / 服务转化。")
        if "收藏" in content or "关注" in content:
            patterns.append("轻转化：关注、收藏、评论。")
        return patterns or ["收口方式不明确，需要给自然下一步。"]

    def _likely_to_work(self, content: str) -> list[str]:
        items = []
        if re.search(r"你以为.+其实|不是.+而是", content):
            items.append("误区戳穿结构更容易带来停留和转发。")
        if "行动清单" in content or "方法" in content:
            items.append("方法清单结构有收藏潜力。")
        if any(word in content for word in ["评论", "私信", "领取"]):
            items.append("互动入口明确，有后续转化潜力。")
        return items or ["当前爆款结构不够鲜明，建议改成“误区戳穿 + 方法清单 + 自然转化”。"]
