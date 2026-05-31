from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Optional

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()


@dataclass(frozen=True)
class AIConfig:
    model: str = os.getenv("OPENAI_MODEL", "gpt-5.2")
    temperature: float = float(os.getenv("OPENAI_TEMPERATURE", "0.8"))
    max_tokens: int = int(os.getenv("OPENAI_MAX_TOKENS", "6000"))
    timeout: float = float(os.getenv("OPENAI_TIMEOUT", "120"))


class AIClient:
    """Small wrapper around the modern OpenAI Python SDK."""

    def __init__(self, config: Optional[AIConfig] = None) -> None:
        self.config = config or AIConfig()
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key:
            raise RuntimeError(
                "缺少 OPENAI_API_KEY。请复制 .env.example 为 .env，并填入你的 OpenAI API Key。"
            )
        self.client = OpenAI(api_key=api_key, timeout=self.config.timeout)

    def generate(
        self,
        *,
        system_prompt: str,
        user_prompt: str,
        model: Optional[str] = None,
        temperature: Optional[float] = None,
        max_tokens: Optional[int] = None,
    ) -> str:
        response = self.client.responses.create(
            model=model or self.config.model,
            instructions=system_prompt,
            input=user_prompt,
            temperature=self.config.temperature if temperature is None else temperature,
            max_output_tokens=self.config.max_tokens if max_tokens is None else max_tokens,
        )
        output_text = getattr(response, "output_text", "") or ""
        if not output_text.strip():
            raise RuntimeError("OpenAI API 返回了空内容。")
        return output_text.strip()
