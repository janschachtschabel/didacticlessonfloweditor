import json
import os
import re
from typing import Tuple, Dict, Any, Optional
from pydantic import BaseModel, Field
from openai import OpenAI

class BaseItem(BaseModel):
    """Base class for items with descriptions"""
    description: str = Field(..., min_length=1)

class Advantage(BaseItem):
    pass

class Disadvantage(BaseItem):
    pass

class LearningSequence(BaseModel):
    sequence_id: str = Field(..., min_length=1)
    sequence_name: str = Field(..., min_length=1)
    time_frame: str = Field(..., min_length=1)
    learning_goal: str = Field(..., min_length=1)

class Solution(BaseModel):
    solution_description: str = Field(..., min_length=1)
    didactic_approach: str = Field(..., min_length=1)
    didactic_template: Dict[str, Any]
    consequences: Dict[str, Any]
    implementation_notes: list
    related_patterns: list
    sources: list

class TemplateSchema(BaseModel):
    metadata: Dict[str, Any]
    problem: Dict[str, Any]
    context: Dict[str, Any]
    influence_factors: list
    solution: Solution
    consequences: Dict[str, Any]
    implementation_notes: list
    related_patterns: list
    feedback: Dict[str, Any]
    sources: list

def extract_json(text: str) -> Optional[str]:
    """Extract JSON content from text between ```json markers."""
    json_pattern = r'```json(.*?)```'
    match = re.search(json_pattern, text, re.DOTALL)
    return match.group(1).strip() if match else None

def create_completion(client: OpenAI, model: str, prompt: str, retries: int = 5) -> Any:
    """Create a chat completion with retry logic."""
    last_error = None
    for i in range(retries):
        try:
            return client.chat.completions.create(
                model=model,
                messages=[
                    {"role": "system", "content": "Du bist ein hilfreicher Assistent."},
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
            # Exponential backoff
            time.sleep(min(1 * (2 ** i), 10))
    raise last_error

def complete_template(
    template: Dict[str, Any],
    user_input: str,
    model: str = "gpt-4",
    api_key: Optional[str] = None,
    llm_model: Optional[str] = None
) -> Tuple[Optional[Dict[str, Any]], str]:
    """Complete a didactic template using OpenAI's API."""
    # Use llm_model if provided, otherwise use model
    model_to_use = llm_model or model
    final_api_key = api_key or os.getenv("OPENAI_API_KEY")
    
    if not final_api_key:
        return None, "OpenAI API key is missing. Bitte setzen Sie die Umgebungsvariable OPENAI_API_KEY."

    try:
        client = OpenAI(api_key=final_api_key)
        current_template = json.dumps(template, ensure_ascii=False, indent=2)
        
        prompt = f"""
Sie sind ein KI-Assistent, der Lehrkräften hilft, ein didaktisches Template zu vervollständigen.

Aktueller Stand des Templates:
{current_template}

Wünsche oder Anweisungen des Nutzers:
{user_input}

Zusätzliche Hinweise zur Erstellung des Templates:
{SEQUENCING_HINTS}

Bitte vervollständigen Sie das Template basierend auf den Wünschen und verwenden Sie das folgende Beispiel als Referenz:
{json.dumps(EXAMPLE_TEMPLATE, ensure_ascii=False, indent=2)}

Geben Sie das vervollständigte Template im JSON-Format zurück.
"""
        response = create_completion(client, model_to_use, prompt)
        
        if hasattr(response.choices[0].message, 'content'):
            try:
                new_template = json.loads(response.choices[0].message.content)
                TemplateSchema.parse_obj(new_template)
                return new_template, "Das Template wurde erfolgreich vervollständigt und aktualisiert."
            except json.JSONDecodeError:
                json_str = extract_json(response.choices[0].message.content)
                if json_str:
                    try:
                        new_template = json.loads(json_str)
                        TemplateSchema.parse_obj(new_template)
                        return new_template, "Das Template wurde erfolgreich vervollständigt und aktualisiert."
                    except (json.JSONDecodeError, ValueError) as e:
                        return None, f"Fehler beim Parsen des JSON: {str(e)}"
                return None, "Kein gültiges JSON in der Antwort gefunden."
        return None, "Unerwartetes Antwortformat vom KI-Modell."

    except Exception as e:
        return None, f"Fehler: {str(e)}"

# Example usage
if __name__ == "__main__":
    template = EXAMPLE_TEMPLATE
    user_input = "Bitte füge mehr Details zur Differenzierung hinzu."
    result, message = complete_template(
        template=template,
        user_input=user_input,
        model="gpt-4",
        llm_model=os.getenv("LLM_MODEL")  # Optional override
    )
    
    if result:
        print("Success:", message)
        print(json.dumps(result, ensure_ascii=False, indent=2))
    else:
        print("Error:", message)