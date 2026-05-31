from __future__ import annotations

import sys
import argparse
from pathlib import Path

from analytics.performance_logger import PerformanceLogger
from core.ai_client import AIClient
from core.markdown_exporter import MarkdownExporter
from core.pipeline_engine import PipelineEngine
from core.prompt_loader import PromptLoader


PROJECT_ROOT = Path(__file__).resolve().parent
PROMPTS_DIR = PROJECT_ROOT / "prompts"
STYLE_DIR = PROJECT_ROOT / "style_training"
BRAND_OS_DIR = PROJECT_ROOT / "brand_os"
INPUT_FILE = PROJECT_ROOT / "inputs" / "topic.txt"
OUTPUT_FILE = PROJECT_ROOT / "outputs" / "content_package.md"
PERFORMANCE_LOG = PROJECT_ROOT / "outputs" / "performance_log.jsonl"


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description="AI 内容自动生产机器")
    parser.add_argument("--topic", help="直接传入主题；不传则读取 inputs/topic.txt")
    parser.add_argument("--output", help="自定义输出文件路径；不传则写入 outputs/content_package.md")
    parser.add_argument("--lite", action="store_true", help="低成本模式：只生成标题、公众号长文、短视频口播")
    parser.add_argument(
        "--full-style",
        action="store_true",
        help="关闭 LOW_TOKEN_MODE 的短风格注入，读取完整 style_training 上下文",
    )
    return parser.parse_args()


def read_topic(topic_arg: str | None = None) -> str:
    if topic_arg:
        topic = topic_arg.strip()
        if not topic:
            raise ValueError("--topic 不能为空。")
        return topic
    if not INPUT_FILE.exists():
        raise FileNotFoundError(f"缺少主题文件：{INPUT_FILE}")
    topic = INPUT_FILE.read_text(encoding="utf-8").strip()
    if not topic:
        raise ValueError("inputs/topic.txt 为空，请先写入一个主题。")
    return topic


def main() -> int:
    args = parse_args()
    topic = read_topic(args.topic)
    output_file = Path(args.output).resolve() if args.output else OUTPUT_FILE
    low_token_mode = not args.full_style
    print(f"Topic: {topic}")
    print(f"Mode: {'lite' if args.lite else 'standard'}, LOW_TOKEN_MODE={'on' if low_token_mode else 'off'}")

    engine = PipelineEngine(
        prompt_loader=PromptLoader(
            PROMPTS_DIR,
            STYLE_DIR,
            brand_os_dir=BRAND_OS_DIR,
            low_token_mode=low_token_mode,
        ),
        exporter=MarkdownExporter(output_file),
        ai_client=AIClient(),
        performance_logger=PerformanceLogger(PERFORMANCE_LOG),
        lite=args.lite,
        low_token_mode=low_token_mode,
    )
    result = engine.run(topic)

    print(f"Output: {result.output_file}")
    print(f"Agents: {result.agent_count}")
    print(f"Quality rounds: {result.quality_rounds}")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print(f"运行失败：{exc}", file=sys.stderr)
        raise SystemExit(1)
