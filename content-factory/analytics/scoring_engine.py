from __future__ import annotations

import re
from dataclasses import dataclass, field


EMOTION_WORDS = [
    "可怕",
    "残酷",
    "焦虑",
    "不甘",
    "委屈",
    "扎心",
    "危险",
    "崩溃",
    "清醒",
    "希望",
    "压迫",
    "现实",
]

CONFLICT_WORDS = [
    "不是",
    "而是",
    "但问题是",
    "真正",
    "以为",
    "其实",
    "误区",
    "反常识",
    "旧方法",
    "新方法",
    "差距",
]

TRANSITION_WORDS = [
    "但问题是",
    "真正残酷的是",
    "更危险的是",
    "大部分人不知道的是",
    "换句话说",
    "这也是为什么",
]

CONVERSION_WORDS = [
    "关注",
    "收藏",
    "评论",
    "私信",
    "领取",
    "课程",
    "服务",
    "咨询",
    "陪跑",
    "社群",
    "书",
]

AI_CLICHES = [
    "随着时代发展",
    "在当今社会",
    "众所周知",
    "首先",
    "其次",
    "最后",
    "总而言之",
    "非常重要",
    "全面提升",
    "赋能",
    "闭环",
    "打造个人品牌",
]


@dataclass
class ScoreReport:
    total_score: int
    dimensions: dict[str, int]
    ai_flavor_degree: int
    strongest_part: str
    weakest_part: str
    ai_like_part: str
    emotion_weak_part: str
    rhythm_weak_part: str
    conversion_weak_part: str
    suggestions: list[str] = field(default_factory=list)

    def to_markdown(self) -> str:
        lines = [
            "## 内容评分",
            "",
            f"总分：{self.total_score}/100",
            f"AI味程度：{self.ai_flavor_degree}/100（越低越好）",
            "",
            "### 维度评分",
        ]
        for name, score in self.dimensions.items():
            lines.append(f"- {name}：{score}/100")

        lines.extend(
            [
                "",
                "### 内容复盘",
                f"- 最强段落：{self.strongest_part}",
                f"- 最弱段落：{self.weakest_part}",
                f"- 最像 AI 的段落：{self.ai_like_part}",
                f"- 情绪不足段落：{self.emotion_weak_part}",
                f"- 节奏较差段落：{self.rhythm_weak_part}",
                f"- 转化较弱段落：{self.conversion_weak_part}",
                "",
                "### 优化建议",
            ]
        )
        lines.extend(f"- {item}" for item in self.suggestions)
        return "\n".join(lines)


class ScoringEngine:
    def score(self, content: str) -> ScoreReport:
        paragraphs = self._paragraphs(content)
        text = content.strip()

        opening = self._score_opening(paragraphs)
        emotion = self._keyword_score(text, EMOTION_WORDS, 12)
        conflict = self._keyword_score(text, CONFLICT_WORDS, 14)
        quote_density = self._score_quotes(paragraphs)
        spread = self._score_spread(text)
        completion = self._score_completion(paragraphs)
        conversion = self._keyword_score(text, CONVERSION_WORDS, 14)
        humanity = self._score_humanity(text, paragraphs)
        ai_flavor = self._score_ai_flavor(text, paragraphs)
        viral = int((opening + emotion + conflict + quote_density + spread + conversion) / 6)

        dimensions = {
            "开头吸引力": opening,
            "情绪强度": emotion,
            "冲突感": conflict,
            "金句密度": quote_density,
            "传播感": spread,
            "完读率潜力": completion,
            "转化能力": conversion,
            "人味程度": humanity,
            "AI味控制": max(0, 100 - ai_flavor),
            "爆款潜力": viral,
        }
        total = int(
            opening * 0.12
            + emotion * 0.12
            + conflict * 0.12
            + quote_density * 0.10
            + spread * 0.10
            + completion * 0.10
            + conversion * 0.12
            + humanity * 0.10
            + max(0, 100 - ai_flavor) * 0.06
            + viral * 0.06
        )

        paragraph_scores = [(p, self._paragraph_power(p)) for p in paragraphs] or [("", 0)]
        strongest = max(paragraph_scores, key=lambda item: item[1])[0]
        weakest = min(paragraph_scores, key=lambda item: item[1])[0]

        return ScoreReport(
            total_score=self._clamp(total),
            dimensions={k: self._clamp(v) for k, v in dimensions.items()},
            ai_flavor_degree=self._clamp(ai_flavor),
            strongest_part=self._short(strongest),
            weakest_part=self._short(weakest),
            ai_like_part=self._short(max(paragraphs, key=self._ai_smell) if paragraphs else ""),
            emotion_weak_part=self._short(min(paragraphs, key=self._emotion_power) if paragraphs else ""),
            rhythm_weak_part=self._short(max(paragraphs, key=len) if paragraphs else ""),
            conversion_weak_part=self._short(self._find_conversion_weak(paragraphs)),
            suggestions=self._suggest(dimensions, ai_flavor),
        )

    def _paragraphs(self, content: str) -> list[str]:
        items = [p.strip() for p in re.split(r"\n{2,}", content) if p.strip()]
        return [p for p in items if not p.startswith("|---")]

    def _score_opening(self, paragraphs: list[str]) -> int:
        opening = "\n".join(paragraphs[:3])
        score = 45
        if any(word in opening for word in ["很多人", "真正", "可怕", "99%", "你以为"]):
            score += 25
        if any(word in opening for word in CONFLICT_WORDS):
            score += 20
        if len(opening) <= 260:
            score += 10
        return self._clamp(score)

    def _keyword_score(self, text: str, words: list[str], target: int) -> int:
        count = sum(text.count(word) for word in words)
        return self._clamp(35 + int(min(count, target) / target * 65))

    def _score_quotes(self, paragraphs: list[str]) -> int:
        short_power = 0
        for p in paragraphs:
            clean = re.sub(r"[#>\-\*\d\.\s]", "", p)
            if 12 <= len(clean) <= 48 and any(word in clean for word in ["不是", "而是", "真正", "以为", "差距"]):
                short_power += 1
        return self._clamp(35 + min(short_power, 8) * 8)

    def _score_spread(self, text: str) -> int:
        score = 35
        score += min(text.count("收藏") + text.count("转发") + text.count("评论"), 6) * 8
        score += min(text.count("金句") + text.count("标题") + text.count("字幕"), 6) * 5
        score += min(text.count("反常识") + text.count("误区"), 5) * 5
        return self._clamp(score)

    def _score_completion(self, paragraphs: list[str]) -> int:
        if not paragraphs:
            return 0
        avg_len = sum(len(p) for p in paragraphs) / len(paragraphs)
        transitions = sum(1 for p in paragraphs if any(word in p for word in TRANSITION_WORDS))
        score = 50 + min(transitions, 8) * 5
        if 60 <= avg_len <= 260:
            score += 15
        return self._clamp(score)

    def _score_humanity(self, text: str, paragraphs: list[str]) -> int:
        score = 45
        score += min(text.count("你") + text.count("我") + text.count("我们"), 20) * 2
        score += min(text.count("场景") + text.count("打开") + text.count("刷到") + text.count("卡住"), 10) * 4
        if any("有没有这种感觉" in p for p in paragraphs):
            score += 10
        return self._clamp(score)

    def _score_ai_flavor(self, text: str, paragraphs: list[str]) -> int:
        score = 0
        score += sum(text.count(word) for word in AI_CLICHES) * 8
        if paragraphs and len({len(p) // 20 for p in paragraphs[:12]}) <= 3:
            score += 18
        if text.count("：") > 25 and text.count("##") > 10:
            score += 12
        return self._clamp(score)

    def _paragraph_power(self, paragraph: str) -> int:
        return (
            self._emotion_power(paragraph)
            + sum(paragraph.count(word) for word in CONFLICT_WORDS) * 8
            + sum(paragraph.count(word) for word in CONVERSION_WORDS) * 4
            - self._ai_smell(paragraph)
        )

    def _emotion_power(self, paragraph: str) -> int:
        return sum(paragraph.count(word) for word in EMOTION_WORDS) * 10

    def _ai_smell(self, paragraph: str) -> int:
        return sum(paragraph.count(word) for word in AI_CLICHES) * 12 + int(len(paragraph) > 420) * 10

    def _find_conversion_weak(self, paragraphs: list[str]) -> str:
        tail = paragraphs[-6:] if len(paragraphs) >= 6 else paragraphs
        weak = [p for p in tail if not any(word in p for word in CONVERSION_WORDS)]
        return weak[-1] if weak else (tail[-1] if tail else "")

    def _suggest(self, dimensions: dict[str, int], ai_flavor: int) -> list[str]:
        suggestions: list[str] = []
        if dimensions["开头吸引力"] < 80:
            suggestions.append("重写开头：第一句直接给反常识判断，不要铺垫背景。")
        if dimensions["情绪强度"] < 80:
            suggestions.append("增强情绪：加入焦虑、残酷、清醒、希望的推进。")
        if dimensions["冲突感"] < 80:
            suggestions.append("增强冲突：补充“用户以为 vs 真正问题”的对立。")
        if dimensions["金句密度"] < 80:
            suggestions.append("增加金句：每个核心段落压出一句可做字幕的短判断。")
        if dimensions["转化能力"] < 80:
            suggestions.append("增强转化：先总结痛点，再自然引导书、课、咨询或服务。")
        if ai_flavor > 25:
            suggestions.append("降低 AI 味：删除套话、排比式说明和过度整齐的段落。")
        if not suggestions:
            suggestions.append("整体达到发布门槛，可继续做标题 A/B 测试。")
        return suggestions

    def _short(self, text: str, limit: int = 160) -> str:
        compact = re.sub(r"\s+", " ", text).strip()
        return compact[:limit] + ("..." if len(compact) > limit else "")

    def _clamp(self, value: int) -> int:
        return max(0, min(100, int(value)))
