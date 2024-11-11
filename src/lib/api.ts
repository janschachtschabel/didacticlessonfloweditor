import { OpenAI } from 'openai';
import { exampleTemplate } from '../data/exampleTemplate';
import type { Template } from './types';

export async function processTemplate(
  template: Template,
  input: string,
  model: string,
  apiKey: string
): Promise<Template> {
  const client = new OpenAI({ 
    apiKey,
    dangerouslyAllowBrowser: true
  });

  const prompt = `
Please help complete or modify this template based on the user's instructions.

Current template:
${JSON.stringify(template, null, 2)}

Example template for reference:
${JSON.stringify(exampleTemplate, null, 2)}

Additional hints for sequencing:
- Sequential: fixed order of elements
- Parallel: simultaneous execution of activities
- Conditional: transitions based on conditions
- Branching: selection between different paths
- Looping: repetition of an activity based on feedback
- Optional activities: voluntary choice between activities

User instructions:
${input}

Please return the modified template as a JSON object.
`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'You are a helpful assistant.'
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.7,
    response_format: { type: 'json_object' }
  });

  const content = response.choices[0].message.content;
  if (!content) {
    throw new Error('No response from OpenAI');
  }

  return JSON.parse(content);
}