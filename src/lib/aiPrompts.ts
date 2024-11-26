export const FLOW_GENERATION_PROMPT = `
As an expert instructional designer, CAREFULLY MODIFY the existing learning sequence based on the user's specific requests.

CRITICAL REQUIREMENTS:

1. PRESERVE EXISTING CONTENT:
   - Keep the current theme and core objectives unchanged unless explicitly requested
   - Maintain existing actors and learning environments
   - Preserve the current didactic approach if not specifically asked to change
   - DO NOT modify any source types of existing resources (keep as is)
   - For new resources ALWAYS set source type to "manual"
   - Only modify elements specifically mentioned in user request

2. Learning Environment Integration:
   - Create at least one detailed learning environment for the sequence
   - Each environment MUST have a clear purpose and setup
   - MUST include both physical and digital components where appropriate
   - MUST specify room layouts, technical equipment, or platform features

3. Learning Resources:
   - Each activity MUST link to specific learning materials
   - Materials MUST be diverse (text, video, interactive, etc.)
   - MUST include both teacher and student materials
   - MUST specify exact usage in activities

4. Learning Tools:
   - Each activity MUST specify required tools
   - MUST include both digital and physical tools where appropriate
   - MUST explain how each tool supports the learning process
   - MUST consider accessibility and technical requirements

5. Support Services:
   - MUST specify required support services for each phase
   - Include technical, pedagogical, and content support
   - MUST detail when and how services are accessed
   - Consider both teacher and student support needs

6. Role-Resource Mapping:
   - MUST explicitly link each role to specific:
     * Required materials
     * Necessary tools
     * Support services
   - MUST specify how each resource is used
   - MUST include backup/alternative options

7. Activity Design:
   - Each activity MUST specify:
     * Exact materials being used
     * Required tools and their purpose
     * Support services available
     * Learning environment setup
   - MUST include preparation requirements
   - MUST specify transitions between activities

8. Resource Access:
   - MUST specify how each resource is accessed
   - Include clear URLs or physical locations
   - MUST consider offline alternatives
   - MUST address accessibility needs

9. Quality Assurance:
   - MUST verify all resources are appropriate for:
     * Educational level
     * Subject matter
     * Learning goals
     * Target group
   - MUST include alternatives for technical issues

Remember:
- ONLY modify what the user explicitly requests
- PRESERVE all existing content not mentioned in the request
- MAINTAIN the current theme and objectives
- For any new resources, ALWAYS set source to "manual"
- NEVER change existing resource source types
- Every activity MUST have complete resource specifications
- All resources MUST be clearly linked to roles
- Each environment MUST be fully detailed
- Include specific access information for all resources
- Consider inclusive design throughout

Return your response as a complete JSON object with the following structure:
{
  "metadata": { ... },
  "problem": { ... },
  "context": { ... },
  "influence_factors": [ ... ],
  "solution": {
    "solution_description": "...",
    "didactic_approach": "...",
    "didactic_template": {
      "learning_sequences": [ ... ]
    }
  },
  "consequences": { ... },
  "implementation_notes": [ ... ],
  "related_patterns": [ ... ],
  "feedback": { ... },
  "sources": [ ... ],
  "actors": [ ... ],
  "environments": [ ... ]
}`;

export const ENVIRONMENT_ENHANCEMENT_PROMPTS = {
  physical: `
CRITICAL: You MUST enhance the physical learning environment and return a JSON object with:
- Room layout and furniture
- Display and presentation equipment
- Storage solutions
- Lighting and acoustics
- Movement and activity zones
- Quiet and focus areas
- Collaboration spaces
- Safety considerations
- Accessibility features
- Required materials and tools
- Support services
- Integration with activities
- Role-specific areas
- Resource organization
- Emergency procedures

Return your response as a JSON object with this structure:
{
  "name": "...",
  "description": "...",
  "materials": [ ... ],
  "tools": [ ... ],
  "services": [ ... ]
}`,

  virtual: `
CRITICAL: You MUST enhance the virtual learning environment and return a JSON object with:
- Platform features and requirements
- Communication tools
- File sharing and storage
- Collaboration spaces
- Progress tracking
- Technical support options
- Backup and redundancy
- Security measures
- Accessibility features
- Digital materials and tools
- Online support services
- Activity integration
- Role permissions
- Resource management
- Contingency plans

Return your response as a JSON object with this structure:
{
  "name": "...",
  "description": "...",
  "materials": [ ... ],
  "tools": [ ... ],
  "services": [ ... ]
}`,

  hybrid: `
CRITICAL: You MUST enhance the hybrid learning environment and return a JSON object with:
- Synchronous and asynchronous elements
- Physical-digital integration
- Transition strategies
- Equipment requirements
- Participation options
- Communication channels
- Resource accessibility
- Backup plans
- Support services for both modes
- Materials for both settings
- Tools for seamless integration
- Activity coordination
- Role flexibility
- Resource synchronization
- Emergency procedures

Return your response as a JSON object with this structure:
{
  "name": "...",
  "description": "...",
  "materials": [
    {
      "name": "...",
      "type": "...",
      "access_link": "..."
    }
  ],
  "tools": [
    {
      "name": "...",
      "type": "...",
      "access_link": "..."
    }
  ],
  "services": [
    {
      "name": "...",
      "type": "...",
      "access_link": "..."
    }
  ]
}`
};

export const SEQUENCE_VALIDATION_PROMPT = `
CRITICAL: Validate and ensure the learning sequence includes:

1. Environment Completeness:
   - Every activity has a specified environment
   - Environments have all necessary resources
   - Clear setup instructions exist

2. Resource Coverage:
   - All required materials are listed
   - Necessary tools are specified
   - Support services are defined
   - Access information is complete

3. Role-Resource Mapping:
   - Each role has assigned resources
   - Resource usage is clearly defined
   - Alternatives are specified

4. Activity Integration:
   - Resources match activity needs
   - Transitions are well-defined
   - Support is readily available

5. Accessibility:
   - Resources are accessible
   - Alternatives exist
   - Support is available

Return validation results as a JSON object with:
{
  "isValid": boolean,
  "issues": string[],
  "fixes": string[]
}`;