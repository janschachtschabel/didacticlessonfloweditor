import { OpenAI } from 'openai';
import { 
  BILDUNGSSTUFE_MAPPING, 
  FACH_MAPPING, 
  INHALTSTYP_MAPPING,
  FILTER_PROPERTIES 
} from './mappings';

interface FilterContext {
  itemName: string;
  itemType: 'material' | 'tool' | 'service';
  educationalLevel: string;
  subject: string;
  activityName: string;
  roleName: string;
  taskDescription: string;
  template: any; // Full template context
}

interface FilterSelectionResult {
  germanLabel: string;
  uri: string;
}

export async function generateFilterCriteria(
  context: FilterContext,
  apiKey: string,
  selectedFilters: string[],
  addStatus: (message: string) => void
): Promise<Record<string, string>> {
  const client = new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const filterCriteria: Record<string, string> = {};

  // Process each selected filter type
  for (const filterType of selectedFilters) {
    addStatus(`Processing filter type: ${filterType}`);

    let result: FilterSelectionResult | null = null;

    switch (filterType) {
      case FILTER_PROPERTIES.TITLE:
        // For title, we'll use the context to generate a search term
        const searchTerm = await generateSearchTerm(client, context);
        filterCriteria[filterType] = searchTerm;
        addStatus(`Generated search term: ${searchTerm}`);
        break;

      case FILTER_PROPERTIES.CONTENT_TYPE:
        result = await selectFromMapping(
          client, 
          context,
          Object.keys(INHALTSTYP_MAPPING),
          "content type",
          addStatus
        );
        if (result) {
          filterCriteria[filterType] = result.uri;
          addStatus(`Selected content type: ${result.germanLabel} -> ${result.uri}`);
        }
        break;

      case FILTER_PROPERTIES.EDUCATIONAL_CONTEXT:
        result = await selectFromMapping(
          client,
          context,
          Object.keys(BILDUNGSSTUFE_MAPPING),
          "educational level",
          addStatus
        );
        if (result) {
          filterCriteria[filterType] = result.uri;
          addStatus(`Selected educational level: ${result.germanLabel} -> ${result.uri}`);
        }
        break;

      case FILTER_PROPERTIES.DISCIPLINE:
        result = await selectFromMapping(
          client,
          context,
          Object.keys(FACH_MAPPING),
          "discipline",
          addStatus
        );
        if (result) {
          filterCriteria[filterType] = result.uri;
          addStatus(`Selected discipline: ${result.germanLabel} -> ${result.uri}`);
        }
        break;
    }
  }

  return filterCriteria;
}

async function generateSearchTerm(client: OpenAI, context: FilterContext): Promise<string> {
  const prompt = `
Generate a SINGLE, CONCISE search term (1-2 words maximum) that best represents the core concept or topic for finding this educational resource.

Context:
Item: ${context.itemName} (${context.itemType})
Activity: ${context.activityName}
Task: ${context.taskDescription}

IMPORTANT:
- Return ONLY the search term
- Use ONLY 1-2 words maximum
- Focus on the main concept/topic
- Do NOT include articles, conjunctions, or prepositions
- Prefer nouns or noun phrases

Example good responses:
- "Addition"
- "Photosynthese"
- "Pythagoras"
- "Bruchrechnung"

Example bad responses:
- "Material für Addition" (too long)
- "Die Photosynthese lernen" (too verbose)
- "Mathematische Übungen" (too generic)
`;

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a precise search term generator that returns only single concepts." },
      { role: "user", content: prompt }
    ],
    temperature: 0.3,
    max_tokens: 10
  });

  return response.choices[0].message.content?.trim() || context.itemName;
}

async function selectFromMapping(
  client: OpenAI,
  context: FilterContext,
  options: string[],
  filterName: string,
  addStatus: (message: string) => void
): Promise<FilterSelectionResult | null> {
  const prompt = `
Based on the following context, select the most appropriate ${filterName} from the given options.

Context:
- Item: ${context.itemName} (${context.itemType})
- Activity: ${context.activityName}
- Role: ${context.roleName}
- Task: ${context.taskDescription}
- Educational Level: ${context.educationalLevel}
- Subject: ${context.subject}

Available options:
${options.join('\n')}

Return only the exact name of the most appropriate option from the list.
`;

  addStatus(`Analyzing context to select ${filterName}...`);

  const response = await client.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a helpful assistant that selects appropriate educational metadata values." },
      { role: "user", content: prompt }
    ],
    temperature: 0.7,
    max_tokens: 100
  });

  const selectedLabel = response.choices[0].message.content?.trim();
  
  if (!selectedLabel || !options.includes(selectedLabel)) {
    addStatus(`Could not determine appropriate ${filterName}`);
    return null;
  }

  // Map the selected German label to URI
  let uri = '';
  switch (filterName) {
    case "content type":
      uri = INHALTSTYP_MAPPING[selectedLabel as keyof typeof INHALTSTYP_MAPPING];
      break;
    case "educational level":
      uri = BILDUNGSSTUFE_MAPPING[selectedLabel as keyof typeof BILDUNGSSTUFE_MAPPING];
      break;
    case "discipline":
      uri = FACH_MAPPING[selectedLabel as keyof typeof FACH_MAPPING];
      break;
  }

  return {
    germanLabel: selectedLabel,
    uri
  };
}