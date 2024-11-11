import { useState } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { Editor } from '../components/Editor';
import { generateFilterCriteria } from '../lib/filterUtils';
import { FILTER_PROPERTIES } from '../lib/mappings';

const AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4O Mini' },
  { id: 'gpt-4o', name: 'GPT-4O' },
  { id: 'gpt-4-1106-preview', name: 'GPT-4 Turbo' },
  { id: 'gpt-4', name: 'GPT-4' },
];

const FILTER_OPTIONS = [
  { id: FILTER_PROPERTIES.TITLE, label: 'Title search' },
  { id: FILTER_PROPERTIES.CONTENT_TYPE, label: 'Content type' },
  { id: FILTER_PROPERTIES.EDUCATIONAL_CONTEXT, label: 'Educational context' },
  { id: FILTER_PROPERTIES.DISCIPLINE, label: 'Discipline/subject' },
];

export function AIFilterAgent() {
  const state = useTemplateStore();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const [selectedFilters, setSelectedFilters] = useState([
    FILTER_PROPERTIES.TITLE,
    FILTER_PROPERTIES.CONTENT_TYPE,
    FILTER_PROPERTIES.DISCIPLINE
  ]);

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

  const addStatus = (message: string) => {
    setStatus(prev => [...prev, message]);
  };

  const handleFilterToggle = (filterId: string) => {
    setSelectedFilters(prev => {
      if (prev.includes(filterId)) {
        return prev.filter(id => id !== filterId);
      }
      return [...prev, filterId];
    });
  };

  const handleProcess = async () => {
    if (!apiKey) {
      setError('Please enter your OpenAI API key');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setStatus([]);

    try {
      const sequences = currentTemplate.solution?.didactic_template?.learning_sequences || [];
      let updatedTemplate = { ...currentTemplate };

      for (const sequence of sequences) {
        addStatus(`Processing sequence: ${sequence.sequence_name || sequence.sequence_id}`);
        
        for (const phase of sequence.phases || []) {
          addStatus(`Processing phase: ${phase.phase_name || phase.phase_id}`);
          
          for (const activity of phase.activities || []) {
            addStatus(`Processing activity: ${activity.name || activity.activity_id}`);
            
            for (const role of activity.roles || []) {
              addStatus(`Processing role: ${role.role_name}`);
              
              const environment = currentTemplate.environments.find(
                env => env.id === role.learning_environment?.environment_id
              );

              if (environment) {
                // Process materials
                for (const material of environment.materials) {
                  if (role.learning_environment?.selected_materials?.includes(material.id)) {
                    addStatus(`\nProcessing material: ${material.name}`);
                    
                    // First set source to filter
                    material.source = 'filter';
                    addStatus('Set material source to "filter"');

                    const filterContext = {
                      itemName: material.name,
                      itemType: 'material' as const,
                      educationalLevel: currentTemplate.context.educational_level,
                      subject: currentTemplate.context.subject,
                      activityName: activity.name,
                      roleName: role.role_name,
                      taskDescription: role.task_description,
                      template: currentTemplate
                    };

                    // Generate filters one by one
                    material.filter_criteria = await generateFilterCriteria(
                      filterContext,
                      apiKey,
                      selectedFilters,
                      addStatus
                    );
                  }
                }

                // Process tools
                for (const tool of environment.tools) {
                  if (role.learning_environment?.selected_tools?.includes(tool.id)) {
                    addStatus(`\nProcessing tool: ${tool.name}`);
                    
                    tool.source = 'filter';
                    addStatus('Set tool source to "filter"');

                    const filterContext = {
                      itemName: tool.name,
                      itemType: 'tool' as const,
                      educationalLevel: currentTemplate.context.educational_level,
                      subject: currentTemplate.context.subject,
                      activityName: activity.name,
                      roleName: role.role_name,
                      taskDescription: role.task_description,
                      template: currentTemplate
                    };

                    tool.filter_criteria = await generateFilterCriteria(
                      filterContext,
                      apiKey,
                      selectedFilters,
                      addStatus
                    );
                  }
                }

                // Process services
                for (const service of environment.services) {
                  if (role.learning_environment?.selected_services?.includes(service.id)) {
                    addStatus(`\nProcessing service: ${service.name}`);
                    
                    service.source = 'filter';
                    addStatus('Set service source to "filter"');

                    const filterContext = {
                      itemName: service.name,
                      itemType: 'service' as const,
                      educationalLevel: currentTemplate.context.educational_level,
                      subject: currentTemplate.context.subject,
                      activityName: activity.name,
                      roleName: role.role_name,
                      taskDescription: role.task_description,
                      template: currentTemplate
                    };

                    service.filter_criteria = await generateFilterCriteria(
                      filterContext,
                      apiKey,
                      selectedFilters,
                      addStatus
                    );
                  }
                }
              }
            }
          }
        }
      }

      state.setEnvironments(updatedTemplate.environments);
      setSuccess(true);
      addStatus('\nAll filters have been successfully generated and applied!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">AI Filter Agent</h1>

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
          Filter Types to Generate
        </label>
        <div className="space-y-2">
          {FILTER_OPTIONS.map((filter) => (
            <label key={filter.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedFilters.includes(filter.id)}
                onChange={() => handleFilterToggle(filter.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span>{filter.label}</span>
            </label>
          ))}
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
          Processing Status
        </label>
        <div className="h-[20vh] border rounded-lg overflow-y-auto bg-gray-50 p-4 font-mono text-sm whitespace-pre-wrap">
          {status.map((message, index) => (
            <div key={index}>{message}</div>
          ))}
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-400 text-green-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">Filters have been successfully generated and applied!</span>
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
          {loading ? 'Processing...' : 'Generate Filters'}
        </button>
      </div>
    </div>
  );
}