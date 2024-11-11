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
Als didaktischer Assistent helfen Sie bei der Vervollständigung oder Anpassung dieses Templates.

Aktuelles Template:
${JSON.stringify(template, null, 2)}

Beispielvorlage als Referenz:
${JSON.stringify(exampleTemplate, null, 2)}

Wichtige Hinweise zur Erstellung:

1. Didaktische Struktur:
   - Klare Problembeschreibung
   - Spezifische Lernziele
   - Relevante didaktische Schlüsselwörter

2. Kontext:
   - Zielgruppendefinition
   - Fachbereich
   - Bildungsstufe
   - Voraussetzungen
   - Zeitrahmen

3. Sequenzierungsoptionen:
   - Sequenziell: Feste Reihenfolge der Elemente
   - Parallel: Gleichzeitige Aktivitäten
   - Bedingt: Übergänge basieren auf Bedingungen
   - Verzweigung: Auswahl zwischen verschiedenen Pfaden
   - Wiederholung: Aktivitätswiederholung basierend auf Feedback
   - Optional: Freiwillige Aktivitätsauswahl

4. Lernumgebung:
   - Physischer/virtueller Raum
   - Lernressourcen (Lerninhalte wie Videos, Arbeitsblätter, Tests etc.)
   - Werkzeuge und Hilfsmittel
   - Unterstützende Dienste

5. Akteure und Rollen:
   - Klare Verantwortlichkeiten
   - Erforderliche Kompetenzen
   - Interaktionsmuster
   - Unterstützungsbedarf

6. Bewertungsintegration:
   - Formative/summative Methoden
   - Erfolgskriterien
   - Feedbackmechanismen
   - Fortschrittsverfolgung

7. Umsetzungsaspekte:
   - Ressourcenbedarf
   - Vorbereitungsbedarf
   - Potenzielle Herausforderungen
   - Anpassungsoptionen

8. Begrifflichkeiten:
   - "Lernressourcen" oder "Lerninhalte" statt "Materialien"
   - Beispiele für Lernressourcen: Lernvideos, Arbeitsblätter, Dokumente, Wissenstests, 
     Präsentationen, Übungen, Tutorials, Simulationen, Infografiken, Audiodateien

Anweisungen des Nutzers:
${input}

Bitte geben Sie das angepasste Template als JSON-Objekt zurück.
`;

  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: 'system',
        content: 'Sie sind ein hilfreicher didaktischer Assistent.'
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
    throw new Error('Keine Antwort vom KI-Modell');
  }

  return JSON.parse(content);
}