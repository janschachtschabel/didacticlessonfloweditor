import { useState } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { Editor } from '../components/Editor';
import { processTemplate } from '../lib/api';

const AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4O Mini' },
  { id: 'gpt-4o', name: 'GPT-4O' },
  { id: 'gpt-4-1106-preview', name: 'GPT-4 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
];

export function AIFlowAgent() {
  const state = useTemplateStore();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const currentTemplate = {
    metadata: state.metadata,
    problem: state.problem,
    context: state.context,
    influence_factors: state.influence_factors,
    solution: state.solution,
    consequences: state.consequences,
    implementation_notes: state.implementation_notes,
    related_patterns: state.related_patterns,
    feedback: state.feedback,
    sources: state.sources,
    actors: state.actors,
    environments: state.environments
  };

  const handleProcess = async () => {
    if (!apiKey) {
      setError('Bitte geben Sie Ihren OpenAI API-Schlüssel ein');
      return;
    }

    if (!userInput) {
      setError('Bitte geben Sie Ihre Anweisungen ein');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await processTemplate(currentTemplate, userInput, model, apiKey);
      
      state.setMetadata(result.metadata);
      state.setProblem(result.problem);
      state.setContext(result.context);
      state.setInfluenceFactors(result.influence_factors);
      state.setSolution(result.solution);
      state.setConsequences(result.consequences);
      state.setImplementationNotes(result.implementation_notes);
      state.setRelatedPatterns(result.related_patterns);
      state.setFeedback(result.feedback);
      state.setSources(result.sources);
      state.setActors(result.actors);
      state.setEnvironments(result.environments);

      setSuccess(true);
      setUserInput('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">KI Ablauf</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">OpenAI API-Schlüssel</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="sk-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">KI-Modell</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {AI_MODELS.map((model) => (
              <option key={model.id} value={model.id}>
                {model.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Aktuelles Template
        </label>
        <div className="h-[40vh] border rounded-lg overflow-hidden bg-gray-50">
          <Editor
            value={JSON.stringify(currentTemplate, null, 2)}
            onChange={() => {}}
            readOnly
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Anweisungen für KI
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Geben Sie Ihre Anweisungen für die Anpassung des Templates ein..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Template wurde erfolgreich aktualisiert!</span>
        </div>
      )}

      <div className="flex justify-end">
        <button
          onClick={handleProcess}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Verarbeite...' : 'Mit KI verarbeiten'}
        </button>
      </div>
    </div>
  );
}