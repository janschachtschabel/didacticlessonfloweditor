import { z } from 'zod';

// Resource schemas
const MaterialSchema = z.object({
  id: z.string(),
  name: z.string(),
  material_type: z.string(),
  source: z.enum(['manual', 'database', 'filter']),
  access_link: z.string(),
  database_id: z.string().optional(),
  filter_criteria: z.record(z.string()).optional()
});

const ToolSchema = z.object({
  id: z.string(),
  name: z.string(),
  tool_type: z.string(),
  source: z.enum(['manual', 'database', 'filter']),
  access_link: z.string(),
  database_id: z.string().optional(),
  filter_criteria: z.record(z.string()).optional()
});

const ServiceSchema = z.object({
  id: z.string(),
  name: z.string(),
  service_type: z.string(),
  source: z.enum(['manual', 'database', 'filter']),
  access_link: z.string(),
  database_id: z.string().optional(),
  filter_criteria: z.record(z.string()).optional()
});

// Environment schema
const EnvironmentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Name ist erforderlich"),
  description: z.string(),
  materials: z.array(MaterialSchema).min(1, "Mindestens eine Lernressource ist erforderlich"),
  tools: z.array(ToolSchema).min(1, "Mindestens ein Werkzeug ist erforderlich"),
  services: z.array(ServiceSchema).min(1, "Mindestens ein Dienst ist erforderlich")
});

// Complete template schema
const TemplateSchema = z.object({
  metadata: z.object({
    title: z.string(),
    description: z.string(),
    keywords: z.array(z.string()),
    author: z.string(),
    version: z.string()
  }),
  problem: z.object({
    problem_description: z.string(),
    learning_goals: z.array(z.string()),
    didactic_keywords: z.array(z.string())
  }),
  context: z.object({
    target_group: z.string(),
    subject: z.string(),
    educational_level: z.string(),
    prerequisites: z.string(),
    time_frame: z.string()
  }),
  influence_factors: z.array(z.object({
    factor: z.string(),
    description: z.string()
  })),
  solution: z.object({
    solution_description: z.string(),
    didactic_approach: z.string(),
    didactic_template: z.object({
      learning_sequences: z.array(z.any())
    })
  }),
  consequences: z.object({
    advantages: z.array(z.string()),
    disadvantages: z.array(z.string())
  }),
  implementation_notes: z.array(z.object({
    note_id: z.string(),
    description: z.string()
  })),
  related_patterns: z.array(z.string()),
  feedback: z.object({
    comments: z.array(z.any())
  }),
  sources: z.array(z.object({
    source_id: z.string(),
    title: z.string(),
    author: z.string(),
    year: z.number(),
    publisher: z.string(),
    url: z.string()
  })),
  actors: z.array(z.any()),
  environments: z.array(EnvironmentSchema)
});

export function validateTemplate(template: unknown) {
  try {
    // First validate the environments separately to get detailed errors
    if (Array.isArray((template as any).environments)) {
      (template as any).environments.forEach((env: any, index: number) => {
        try {
          EnvironmentSchema.parse(env);
        } catch (error) {
          throw new Error(`Template Strukturfehler in Lernumgebung ${index + 1}: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
        }
      });
    }

    // Then validate the complete template
    return TemplateSchema.parse(template);
  } catch (error) {
    throw new Error(`Template Strukturfehler: ${error instanceof Error ? error.message : 'Unbekannter Fehler'}`);
  }
}