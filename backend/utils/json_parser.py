import json
import re


def parse_json_response(response):
    """
    Safely extract JSON from an AI response.
    Handles:
    - Markdown ```json
    - Nested JSON strings
    - Plain JSON
    """

    if response is None:
        raise ValueError("AI returned None.")

    # Remove markdown
    cleaned = response.replace("```json", "")
    cleaned = cleaned.replace("```", "")
    cleaned = cleaned.strip()

    # Extract first JSON object
    match = re.search(r"\{[\s\S]*\}", cleaned)

    if not match:
        raise ValueError("No JSON object found.")

    data = json.loads(match.group())

    # If the AI nested another JSON inside recommended_response,
    # unpack it.
    if (
        isinstance(data, dict)
        and "recommended_response" in data
        and isinstance(data["recommended_response"], str)
    ):

        nested = data["recommended_response"].strip()

        if nested.startswith("{") and nested.endswith("}"):

            try:

                nested_json = json.loads(nested)

                if isinstance(nested_json, dict):
                    return nested_json

            except Exception:
                pass

    return data