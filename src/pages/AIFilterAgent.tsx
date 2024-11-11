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
  { id: FILTER_PROPERTIES.TITLE, label: 'Titelsuche' },
  { id: FILTER_PROPERTIES.CONTENT_TYPE, label: 'Inhaltstyp' },
  { id: FILTER_PROPERTIES.EDUCATIONAL_CONTEXT, label: 'Bildungskontext' },
  { id: FILTER_PROPERTIES.DISCIPLINE, label: 'Fach/Disziplin' },
];

export function AIFilterAgent() {
  const state = useTemplateStore();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
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
      setError('Bitte geben Sie Ihren OpenAI API-Schlüssel ein');
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
        addStatus(`Verarbeite Sequenz: ${sequence.sequence_name || sequence.sequence_id}`);
        
        for (const phase of sequence.phases || []) {
          addStatus(`Verarbeite Phase: ${phase.phase_name || phase.phase_id}`);
          
          for (const activity of phase.activities || []) {
            addStatus(`Verarbeite Aktivität: ${activity.name || activity.activity_id}`);
            
            for (const role of activity.roles || []) {
              addStatus(`Verarbeite Rolle: ${role.role_name}`);
              
              const environment = currentTemplate.environments.find(
                env => env.id === role.learning_environment?.environment_id
              );

              if (environment) {
                // Process materials
                for (const material of environment.materials) {
                  if (role.learning_environment?.selected_materials?.includes(material.id)) {
                    addStatus(`\nVerarbeite Material: ${material.name}`);
                    
                    material.source = 'filter';
                    addStatus('Material-Quelle auf "filter" gesetzt');

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
                    addStatus(`\nVerarbeite Werkzeug: ${tool.name}`);
                    
                    tool.source = 'filter';
                    addStatus('Werkzeug-Quelle auf "filter" gesetzt');

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
                    addStatus(`\nVerarbeite Dienst: ${service.name}`);
                    
                    service.source = 'filter';
                    addStatus('Dienst-Quelle auf "filter" gesetzt');

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
      addStatus('\nAlle Filter wurden erfolgreich generiert und angewendet!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ein Fehler ist aufgetreten');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">KI Filter</h1>

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
          Zu generierende Filtertypen
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
          Verarbeitungsstatus
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
          <span className="block sm:inline">Filter wurden erfolgreich generiert und angewendet!</span>
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
          {loading ? 'Verarbeite...' : 'Filter generieren'}
        </button>
      </div>
    </div>
  );
}