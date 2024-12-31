import { OpenAI } from 'openai';
import { z } from 'zod';
import { exampleTemplate } from '../data/exampleTemplate';
import { validateTemplate } from './templateValidator';
import { findRelevantTemplates } from './communityTemplates';

// Schema for environment resources
const ResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  source: z.enum(['manual', 'database', 'filter']),
  access_link: z.string()
});

// Schema for learning environment
const EnvironmentSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  materials: z.array(ResourceSchema),
  tools: z.array(ResourceSchema),
  services: z.array(ResourceSchema)
});

export async function generateTemplate(
  currentTemplate: any,
  userInput: string,
  model: string,
  apiKey: string,
  learnFromCommunity: boolean,
  addStatus: (message: string) => void
) {
  const client = new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  });

  addStatus('🔧 Erstelle KI-Prompt mit aktuellem Template und Beispiel...');

  // Find relevant community templates if enabled
  let communityTemplatesContext = '';
  if (learnFromCommunity) {
    addStatus('\n🔍 Suche nach passenden Community-Templates...');
    const relevantTemplates = await findRelevantTemplates(currentTemplate);
    
    if (relevantTemplates.length > 0) {
      addStatus(`\n✅ ${relevantTemplates.length} passende Templates gefunden:`);
      relevantTemplates.forEach(template => {
        addStatus(`- ${template.name} (${template.subject})`);
      });
      
      communityTemplatesContext = `
Relevante Community-Templates als zusätzliche Referenz:
${JSON.stringify(relevantTemplates.map(t => t.template), null, 2)}

Berücksichtigen Sie die guten Aspekte dieser Templates, insbesondere:
- Didaktische Strukturen
- Aktivitätsabläufe
- Ressourcenverwendung
- Rollenverteilung
`;
    } else {
      addStatus('\nℹ️ Keine passenden Community-Templates gefunden');
    }
  }

  const prompt = `
Als didaktischer Assistent helfen Sie bei der Vervollständigung oder Anpassung dieses Templates.
Bitte erzeugen Sie ein vollständiges Template im exakt gleichen Format wie das Beispiel.

WICHTIG: Folgen Sie EXAKT dieser Struktur für Lernumgebungen:

{
  "id": "ENV1",
  "name": "Name der Umgebung",
  "description": "Beschreibung der Umgebung",
  "materials": [
    {
      "id": "ENV1-M1",
      "name": "Name des Materials",
      "material_type": "Typ des Materials",
      "source": "manual",
      "access_link": "Link zum Material"
    }
  ],
  "tools": [
    {
      "id": "ENV1-T1", 
      "name": "Name des Werkzeugs",
      "tool_type": "Typ des Werkzeugs",
      "source": "manual",
      "access_link": "Link zum Werkzeug"
    }
  ],
  "services": [
    {
      "id": "ENV1-S1",
      "name": "Name des Dienstes", 
      "service_type": "Typ des Dienstes",
      "source": "manual",
      "access_link": "Link zum Dienst"
    }
  ]
}

Aktuelles Template:
${JSON.stringify(currentTemplate, null, 2)}

Beispielvorlage als Referenz:
${JSON.stringify(exampleTemplate, null, 2)}

${communityTemplatesContext}

Anweisungen des Nutzers:
${userInput}

Bitte generieren Sie ein vollständiges Template mit allen erforderlichen Elementen, insbesondere:
1. Mindestens eine Lernumgebung mit der exakten Struktur wie oben gezeigt
2. Mindestens 3 Materialien pro Umgebung
3. Mindestens 2 Werkzeuge pro Umgebung
4. Mindestens 1 Dienst pro Umgebung
5. Korrekte IDs und Referenzen zwischen Elementen

Geben Sie das Template als vollständiges JSON-Objekt zurück.`;

  addStatus('🚀 Sende Anfrage an KI-Modell...');

  try {
    const completion = await client.chat.completions.create({
      model,
      messages: [
        {
          role: "system",
          content: "Sie sind ein erfahrener didaktischer Assistent, der Templates mit allen erforderlichen Details erstellt."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 12000 // Erhöhung der maximalen Antwortlänge
    });

    addStatus('✅ KI-Antwort erhalten');
    addStatus('🔍 Extrahiere und parse JSON...');

    if (!completion.choices[0].message.content) {
      throw new Error('Keine Antwort vom KI-Modell erhalten');
    }

    // Extract JSON from response
    const jsonMatch = completion.choices[0].message.content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Kein gültiges JSON in der KI-Antwort gefunden');
    }

    addStatus('🔍 Parse JSON...');
    const generatedTemplate = JSON.parse(jsonMatch[0]);

    // Log the environments before validation
    addStatus('\nGenerierte Lernumgebungen vor Validierung:');
    if (generatedTemplate.environments) {
      generatedTemplate.environments.forEach((env: any, index: number) => {
        addStatus(`\nUmgebung ${index + 1}: ${env.name}`);
        addStatus(`- ${env.materials?.length || 0} Materialien`);
        addStatus(`- ${env.tools?.length || 0} Werkzeuge`);
        addStatus(`- ${env.services?.length || 0} Dienste`);
      });
    }

    // Validate the template
    addStatus('\n🔍 Validiere Template-Struktur...');
    const validatedTemplate = validateTemplate(generatedTemplate);

    // Log validation success
    addStatus('\nValidierte Elemente:');
    addStatus(`- ${validatedTemplate.actors.length} Akteure`);
    addStatus(`- ${validatedTemplate.environments.length} Lernumgebungen`);
    validatedTemplate.environments.forEach((env: any, index: number) => {
      addStatus(`  • Umgebung ${index + 1}: ${env.materials.length} Materialien, ${env.tools.length} Werkzeuge, ${env.services.length} Dienste`);
    });

    return validatedTemplate;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unbekannter Fehler';
    addStatus(`\n❌ Fehler bei der Template-Generierung: ${errorMessage}`);
    throw error;
  }
}