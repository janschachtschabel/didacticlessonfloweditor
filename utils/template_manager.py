import json
from typing import Dict, Any, Optional

class TemplateManager:
    @staticmethod
    def save_template(template: Dict[str, Any], filename: str) -> tuple[bool, str]:
        try:
            with open(filename, 'w', encoding='utf-8') as f:
                json.dump(template, f, indent=2, ensure_ascii=False)
            return True, "Template saved successfully!"
        except Exception as e:
            return False, f"Error saving template: {str(e)}"

    @staticmethod
    def load_template(file_content) -> tuple[Optional[Dict[str, Any]], str]:
        try:
            template = json.loads(file_content)
            return template, "Template loaded successfully!"
        except Exception as e:
            return None, f"Error loading template: {str(e)}"

    @staticmethod
    def validate_json(json_str: str) -> tuple[Optional[Dict[str, Any]], str]:
        try:
            template = json.loads(json_str)
            return template, "JSON is valid"
        except json.JSONDecodeError as e:
            return None, f"Invalid JSON: {str(e)}"