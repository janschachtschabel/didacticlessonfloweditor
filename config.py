import os

DEFAULT_TEMPLATE = {
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

AVAILABLE_MODELS = ['gpt-4', 'gpt-3.5-turbo']