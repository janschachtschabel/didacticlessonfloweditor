import streamlit as st
import json
import os
from utils.template_manager import TemplateManager
from utils.ai_processor import AIProcessor
from config import DEFAULT_TEMPLATE, AVAILABLE_MODELS

# Set page config
st.set_page_config(page_title="Template Processor", layout="wide")

# Initialize session state
if 'template' not in st.session_state:
    st.session_state.template = DEFAULT_TEMPLATE

# Sidebar
with st.sidebar:
    st.title("Settings")
    
    # API Key input
    api_key = st.text_input(
        "OpenAI API Key",
        value=os.getenv('OPENAI_API_KEY', ''),
        type="password"
    )

    # Model selection
    model = st.selectbox(
        "Model",
        options=AVAILABLE_MODELS,
        index=0
    )

    # Template operations
    st.subheader("Template Operations")
    
    # Save template
    if st.button("Save Template"):
        success, message = TemplateManager.save_template(
            st.session_state.template, 
            'template.json'
        )
        if success:
            st.success(message)
        else:
            st.error(message)

    # Load template
    uploaded_file = st.file_uploader("Load Template", type="json")
    if uploaded_file:
        template, message = TemplateManager.load_template(uploaded_file.read())
        if template:
            st.session_state.template = template
            st.success(message)
        else:
            st.error(message)

# Main content
st.title("Template Processor")

# Template editor
with st.expander("Current Template", expanded=True):
    template_str = json.dumps(st.session_state.template, indent=2)
    edited_template = st.text_area(
        "Edit Template (JSON)",
        value=template_str,
        height=400
    )
    
    # Update template if changed
    template, message = TemplateManager.validate_json(edited_template)
    if template and template != st.session_state.template:
        st.session_state.template = template
        st.success("Template updated!")
    elif not template and edited_template != template_str:
        st.error(message)

# AI Assistant
st.header("AI Assistant")
user_input = st.text_area(
    "Enter your instructions for completing the template",
    height=100
)

if st.button("Process Template"):
    if not api_key:
        st.error("Please enter your OpenAI API key in the sidebar.")
    elif not user_input:
        st.warning("Please enter instructions for the AI assistant.")
    else:
        with st.spinner("Processing template..."):
            processor = AIProcessor(api_key)
            result, message = processor.process_template(
                st.session_state.template,
                user_input,
                model
            )
            
            if result:
                st.session_state.template = result
                st.success(message)
            else:
                st.error(message)

# Template visualization
st.header("Template Visualization")
st.json(st.session_state.template)