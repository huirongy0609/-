from __future__ import annotations

import json
from dataclasses import asdict, dataclass
from datetime import datetime
from pathlib import Path
from typing import Any


@dataclass
class PerformanceRecord:
    topic: str
    output_file: str
    total_score: int
    ai_flavor_degree: int
    quality_passed: bool
    optimization_rounds: int
    created_at: str
    dimensions: dict[str, int]
    patterns: dict[str, Any]


class PerformanceLogger:
    def __init__(self, log_file: Path) -> None:
        self.log_file = log_file

    def log(
        self,
        *,
        topic: str,
        output_file: Path,
        total_score: int,
        ai_flavor_degree: int,
        quality_passed: bool,
        optimization_rounds: int,
        dimensions: dict[str, int],
        patterns: dict[str, Any],
    ) -> None:
        record = PerformanceRecord(
            topic=topic,
            output_file=str(output_file),
            total_score=total_score,
            ai_flavor_degree=ai_flavor_degree,
            quality_passed=quality_passed,
            optimization_rounds=optimization_rounds,
            created_at=datetime.now().isoformat(timespec="seconds"),
            dimensions=dimensions,
            patterns=patterns,
        )
        self.log_file.parent.mkdir(parents=True, exist_ok=True)
        with self.log_file.open("a", encoding="utf-8") as file:
            file.write(json.dumps(asdict(record), ensure_ascii=False) + "\n")

    def load_records(self) -> list[dict[str, Any]]:
        if not self.log_file.exists():
            return []
        records = []
        for line in self.log_file.read_text(encoding="utf-8").splitlines():
            if line.strip():
                records.append(json.loads(line))
        return records

    def summarize(self) -> str:
        records = self.load_records()
        if not records:
            return "暂无历史表现数据。"
        avg = sum(item["total_score"] for item in records) / len(records)
        best = max(records, key=lambda item: item["total_score"])
        worst = min(records, key=lambda item: item["total_score"])
        return (
            f"历史内容数：{len(records)}\n"
            f"平均分：{avg:.1f}/100\n"
            f"最高分主题：{best['topic']}（{best['total_score']}/100）\n"
            f"最低分主题：{worst['topic']}（{worst['total_score']}/100）"
        )
