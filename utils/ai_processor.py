from openai import OpenAI
import json
from typing import Dict, Any, Optional, Tuple

class AIProcessor:
    def __init__(self, api_key: str):
        self.client = OpenAI(api_key=api_key)

    def process_template(
        self, 
        template: Dict[str, Any], 
        user_input: str, 
        model: str
    ) -> Tuple[Optional[Dict[str, Any]], str]:
        try:
            response = self.client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content": "You are a helpful assistant."
                    },
                    {
                        "role": "user",
                        "content": f"""
Please help complete or modify this template based on the user's instructions.

Current template:
{json.dumps(template, indent=2)}

User instructions:
{user_input}

Please return the modified template as a JSON object.
"""
                    }
                ],
                temperature=0.7
            )
            
            if response.choices[0].message.content:
                try:
                    result = json.loads(response.choices[0].message.content)
                    return result, "Template updated successfully!"
                except json.JSONDecodeError as e:
                    return None, f"Error parsing response: {str(e)}"
            else:
                return None, "No response from the model."
                
        except Exception as e:
            return None, f"Error processing template: {str(e)}"