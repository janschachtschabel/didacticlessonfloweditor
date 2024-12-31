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

export function AIAgent() {
  const state = useTemplateStore();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o');
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
      setError('Please enter your OpenAI API key');
      return;
    }

    if (!userInput) {
      setError('Please enter your instructions');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const result = await processTemplate(currentTemplate, userInput, model, apiKey);
      
      // Update all store sections with the new template
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
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Agent</h1>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">OpenAI API Key</label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="sk-..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">AI Model</label>
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
          Current Template
        </label>
        <div className="h-[40vh] border rounded-lg overflow-hidden bg-gray-50">
          <Editor
            value={JSON.stringify(currentTemplate, null, 2)}
            onChange={() => {}}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Instructions for AI
        </label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Enter your instructions for modifying the template..."
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Template successfully updated!</span>
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
          {loading ? 'Processing...' : 'Process with AI'}
        </button>
      </div>
    </div>
  );
}