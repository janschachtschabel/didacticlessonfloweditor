import json
import os
from typing import Dict, Any, Tuple, Optional
from openai import OpenAI
import time

# Example template
EXAMPLE_TEMPLATE = {
    "metadata": {
        "title": "Example Template",
        "description": "A basic template example",
        "version": "1.0"
    },
    "problem": {
        "description": "Basic problem description",
        "goals": ["Goal 1", "Goal 2"]
    },
    "solution": {
        "description": "Basic solution description",
        "steps": ["Step 1", "Step 2"]
    }
}

def create_completion(
    client: OpenAI,
    model: str,
    prompt: str,
    retries: int = 5
) -> Any:
    """Create a chat completion with retry logic."""
    last_error = None
    for i in range(retries):
        try:
            return client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "You are a helpful assistant."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=5000,
                response_format={"type": "json_object"}
            )
        except Exception as e:
            last_error = e
            if i == retries - 1:
                break
            time.sleep(min(1 * (2 ** i), 10))
    raise last_error

def complete_template(
    template: Dict[str, Any],
    user_input: str,
    model: str = "gpt-4",
    api_key: Optional[str] = None
) -> Tuple[Optional[Dict[str, Any]], str]:
    """Complete a template using OpenAI's API."""
    if not api_key:
        return None, "OpenAI API key is required."

    try:
        client = OpenAI(api_key=api_key)
        current_template = json.dumps(template, ensure_ascii=False, indent=2)
        
        prompt = f"""
Please help complete or modify this template based on the user's instructions.

Current template:
{current_template}

User instructions:
{user_input}

Please return the modified template as a JSON object.
"""

        response = create_completion(client, model, prompt)
        
        if hasattr(response.choices[0].message, 'content'):
            try:
                new_template = json.loads(response.choices[0].message.content)
                return new_template, "Template updated successfully!"
            except json.JSONDecodeError as e:
                return None, f"Error parsing response: {str(e)}"
        return None, "Unexpected response format from the model."

    except Exception as e:
        return None, f"Error: {str(e)}"