import os
import json
import re
import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
from io import BytesIO
from PIL import Image

from ..config import settings

logger = logging.getLogger("construction_intelligence")

def clean_json_response(raw_text: str) -> dict:
    """Safely extract and parse JSON even if surrounded by markdown fences or thoughts."""
    text = raw_text.strip()
    # Strip markdown ```json ... ``` fences
    if "```" in text:
        match = re.search(r"```(?:json)?\s*([\s\S]*?)\s*```", text)
        if match:
            text = match.group(1).strip()
    # Find outer curly braces
    start_idx = text.find("{")
    end_idx = text.rfind("}")
    if start_idx != -1 and end_idx != -1:
        text = text[start_idx:end_idx + 1]
    return json.loads(text)

class MultimodalLLMService:
    def __init__(self):
        self.api_key = settings.GEMINI_API_KEY
        self.model_name = settings.DEFAULT_MODEL
        self.client = None
        if self.api_key:
            try:
                from google import genai
                self.client = genai.Client(api_key=self.api_key)
                logger.info(f"Initialized Google GenAI client with model: {self.model_name}")
            except Exception as e:
                logger.warning(f"Could not initialize Google GenAI Client: {e}")

    def is_live_ai_available(self) -> bool:
        return bool(self.client and self.api_key)

    async def generate_multimodal_analysis(
        self,
        system_prompt: str,
        user_prompt: str,
        image_bytes: Optional[bytes] = None,
        mime_type: str = "image/jpeg"
    ) -> Optional[dict]:
        """Call Gemini Multimodal API if configured, returning parsed dict or None on failure."""
        if not self.is_live_ai_available():
            return None

        try:
            from google import genai
            from google.genai import types

            contents = []
            if image_bytes:
                # Open with PIL to validate
                image = Image.open(BytesIO(image_bytes))
                contents.append(image)

            contents.append(user_prompt)

            config = types.GenerateContentConfig(
                system_instruction=system_prompt,
                response_mime_type="application/json",
                temperature=0.2,
            )

            # Try requested model, fall back gracefully to gemini-2.5-flash or gemini-1.5-flash
            models_to_try = [self.model_name, "gemini-2.5-flash", "gemini-2.0-flash", "gemini-1.5-flash"]
            last_err = None

            for model in models_to_try:
                try:
                    response = self.client.models.generate_content(
                        model=model,
                        contents=contents,
                        config=config
                    )
                    if response and response.text:
                        parsed = clean_json_response(response.text)
                        return parsed
                except Exception as err:
                    last_err = err
                    continue

            logger.warning(f"Live Gemini API calls encountered error: {last_err}. Switching to high-fidelity offline analytical engine.")
            return None

        except Exception as e:
            logger.error(f"Multimodal LLM execution error: {e}")
            return None

llm_service = MultimodalLLMService()

