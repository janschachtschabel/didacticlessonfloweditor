import React from 'react';
import { useState, useRef } from 'react';
import { useTemplateStore } from '../store/templateStore';
import { Editor } from '../components/Editor';
import { SaveLoad } from '../components/SaveLoad';
import { generateTemplate } from '../lib/templateGenerator';
import { generateFilterCriteria } from '../lib/filterUtils';
import { processResources as processWLOResources } from '../components/wlo/ResourceProcessor';

const AI_MODELS = [
  { id: 'gpt-4o-mini', name: 'GPT-4O Mini' },
  { id: 'gpt-4o', name: 'GPT-4O' }
];

const API_ENDPOINTS = {
  PRODUCTION: 'https://redaktion.openeduhub.net/edu-sharing/rest',
  STAGING: 'https://repository.staging.openeduhub.net/edu-sharing/rest'
};

const METADATA_OPTIONS = [
  { id: 'cclom:title', label: 'Titel' },
  { id: 'ccm:oeh_lrt_aggregated', label: 'Inhaltstyp' },
  { id: 'ccm:taxonid', label: 'Fach' },
  { id: 'ccm:educationalcontext', label: 'Bildungskontext' }
];

const AIFlowAgent: React.FC = () => {
  const state = useTemplateStore();
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('gpt-4o-mini');
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState<string[]>([]);
  const [learnFromCommunity, setLearnFromCommunity] = useState(false);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Process selection states
  const [useKIFlow, setUseKIFlow] = useState(true);
  const [useKIFilter, setUseKIFilter] = useState(false);
  const [useWLOInhalte, setUseWLOInhalte] = useState(false);
  const [selectedResourceTypes, setSelectedResourceTypes] = useState({
    materials: true,
    tools: false,
    services: false
  });
  const [selectedMetadata, setSelectedMetadata] = useState(['cclom:title', 'ccm:oeh_lrt_aggregated', 'ccm:taxonid']);

  // WLO options
  const [endpoint, setEndpoint] = useState<keyof typeof API_ENDPOINTS>('PRODUCTION');
  const [maxItems, setMaxItems] = useState(5);
  const [combineMode, setCombineMode] = useState<'OR' | 'AND'>('AND');

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

  const handleMetadataToggle = (metadataId: string) => {
    setSelectedMetadata(prev => 
      prev.includes(metadataId) 
        ? prev.filter(id => id !== metadataId)
        : [...prev, metadataId]
    );
  };

  const handleResourceTypeToggle = (type: keyof typeof selectedResourceTypes) => {
    setSelectedResourceTypes(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const handleCancel = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      setError('Verarbeitung wurde abgebrochen');
      addStatus('\n❌ Verarbeitung wurde abgebrochen');
      setLoading(false);
    }
  };

  const handleProcess = async () => {
    if (!apiKey) {
      setError('Bitte geben Sie Ihren OpenAI API-Schlüssel ein');
      return;
    }

    if (!userInput && useKIFlow) {
      setError('Bitte geben Sie Ihre Anweisungen ein');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(false);
    setStatus([]);
    abortControllerRef.current = new AbortController();

    try {
      let updatedTemplate = currentTemplate;

      // Step 1: Generate template with AI
      if (useKIFlow) {
        addStatus('🤖 Starte KI Ablauf Verarbeitung...');
        const generatedTemplate = await generateTemplate(
          currentTemplate,
          userInput,
          model,
          apiKey,
          learnFromCommunity,
          addStatus
        );

        // Update template
        updatedTemplate = generatedTemplate;
        
        // Update store
        state.setMetadata(generatedTemplate.metadata);
        state.setProblem(generatedTemplate.problem);
        state.setContext(generatedTemplate.context);
        state.setInfluenceFactors(generatedTemplate.influence_factors);
        state.setSolution(generatedTemplate.solution);
        state.setConsequences(generatedTemplate.consequences);
        state.setImplementationNotes(generatedTemplate.implementation_notes);
        state.setRelatedPatterns(generatedTemplate.related_patterns);
        state.setFeedback(generatedTemplate.feedback);
        state.setSources(generatedTemplate.sources);
        state.setActors(generatedTemplate.actors);
        state.setEnvironments(generatedTemplate.environments);

        addStatus('✅ KI Ablauf Verarbeitung erfolgreich abgeschlossen');
      }

      // Step 2: KI Filter Generation
      if (useKIFilter) {
        addStatus('\n🔍 Starte KI Filter Verarbeitung...');
        
        let updatedEnvironments = [...(updatedTemplate.environments || [])];

        for (let envIndex = 0; envIndex < updatedEnvironments.length; envIndex++) {
          const env = updatedEnvironments[envIndex];
          addStatus(`\n📂 Verarbeite Lernumgebung: ${env.name}`);

          // Process materials
          if (selectedResourceTypes.materials && env.materials?.length > 0) {
            addStatus('\n🔄 Verarbeite Materialien...');
            addStatus(`📊 Verarbeite ${env.materials.length} material...`);
            
            for (let i = 0; i < env.materials.length; i++) {
              const material = env.materials[i];
              const filterContext = {
                itemName: material.name,
                itemType: 'material' as const,
                educationalLevel: updatedTemplate.context.educational_level,
                subject: updatedTemplate.context.subject,
                activityName: '',
                roleName: '',
                taskDescription: '',
                template: updatedTemplate
              };

              const criteria = await generateFilterCriteria(
                filterContext,
                apiKey,
                selectedMetadata,
                addStatus
              );

              updatedEnvironments[envIndex].materials[i] = {
                ...material,
                filter_criteria: criteria,
                source: 'filter'
              };
            }
          }

          // Process tools
          if (selectedResourceTypes.tools && env.tools?.length > 0) {
            addStatus('\n🔄 Verarbeite Werkzeuge...');
            for (let i = 0; i < env.tools.length; i++) {
              const tool = env.tools[i];
              const filterContext = {
                itemName: tool.name,
                itemType: 'tool' as const,
                educationalLevel: updatedTemplate.context.educational_level,
                subject: updatedTemplate.context.subject,
                activityName: '',
                roleName: '',
                taskDescription: '',
                template: updatedTemplate
              };

              const criteria = await generateFilterCriteria(
                filterContext,
                apiKey,
                selectedMetadata,
                addStatus
              );

              updatedEnvironments[envIndex].tools[i] = {
                ...tool,
                filter_criteria: criteria,
                source: 'filter'
              };
            }
          }

          // Process services
          if (selectedResourceTypes.services && env.services?.length > 0) {
            addStatus('\n🔄 Verarbeite Dienste...');
            for (let i = 0; i < env.services.length; i++) {
              const service = env.services[i];
              const filterContext = {
                itemName: service.name,
                itemType: 'service' as const,
                educationalLevel: updatedTemplate.context.educational_level,
                subject: updatedTemplate.context.subject,
                activityName: '',
                roleName: '',
                taskDescription: '',
                template: updatedTemplate
              };

              const criteria = await generateFilterCriteria(
                filterContext,
                apiKey,
                selectedMetadata,
                addStatus
              );

              updatedEnvironments[envIndex].services[i] = {
                ...service,
                filter_criteria: criteria,
                source: 'filter'
              };
            }
          }
        }

        // Update environments in store
        updatedTemplate.environments = updatedEnvironments;
        state.setEnvironments(updatedEnvironments);
        addStatus('\n✅ KI Filter Verarbeitung abgeschlossen!');
      }

      // Step 3: WLO Content Processing
      if (useWLOInhalte) {
        addStatus('\n🌐 Starte WLO Inhalte Verarbeitung...');
        
        if (!updatedTemplate.environments || updatedTemplate.environments.length === 0) {
          addStatus('⚠️ Keine Lernumgebungen im Template gefunden');
          return;
        }

        addStatus(`📊 Gefundene Lernumgebungen: ${updatedTemplate.environments.length}`);
        
        let updatedEnvironments = [...updatedTemplate.environments];
        
        for (let envIndex = 0; envIndex < updatedEnvironments.length; envIndex++) {
          const env = updatedEnvironments[envIndex];
          addStatus(`\n📂 Verarbeite Lernumgebung: ${env.name}`);

          // Debug output for resources
          addStatus(`📊 Ressourcen in Umgebung:`);
          addStatus(`- Materialien: ${env.materials?.length || 0}`);
          addStatus(`- Werkzeuge: ${env.tools?.length || 0}`);
          addStatus(`- Dienste: ${env.services?.length || 0}`);

          // Process materials
          if (selectedResourceTypes.materials && env.materials?.length > 0) {
            addStatus('\n🔄 Verarbeite Materialien...');
            env.materials = await processWLOResources(
              env.materials,
              'material',
              env.materials.map(m => m.id),
              env.name,
              addStatus,
              {
                endpoint: API_ENDPOINTS[endpoint],
                maxItems,
                combineMode,
                signal: abortControllerRef.current.signal
              }
            );
          }

          // Process tools
          if (selectedResourceTypes.tools && env.tools?.length > 0) {
            addStatus('\n🔄 Verarbeite Werkzeuge...');
            env.tools = await processWLOResources(
              env.tools,
              'tool',
              env.tools.map(t => t.id),
              env.name,
              addStatus,
              {
                endpoint: API_ENDPOINTS[endpoint],
                maxItems,
                combineMode,
                signal: abortControllerRef.current.signal
              }
            );
          }

          // Process services
          if (selectedResourceTypes.services && env.services?.length > 0) {
            addStatus('\n🔄 Verarbeite Dienste...');
            env.services = await processWLOResources(
              env.services,
              'service',
              env.services.map(s => s.id),
              env.name,
              addStatus,
              {
                endpoint: API_ENDPOINTS[endpoint],
                maxItems,
                combineMode,
                signal: abortControllerRef.current.signal
              }
            );
          }
        }

        // Update environments in store
        state.setEnvironments(updatedEnvironments);
        addStatus('\n✅ WLO Inhalte Verarbeitung erfolgreich abgeschlossen');
      }

      setSuccess(true);
      setUserInput('');
      addStatus('\n🎉 Gesamtverarbeitung erfolgreich abgeschlossen!');
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        setError('Verarbeitung wurde abgebrochen');
        addStatus('\n❌ Verarbeitung wurde abgebrochen');
      } else {
        const errorMessage = err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten';
        setError(errorMessage);
        addStatus(`\n❌ Fehler bei der Verarbeitung: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
      abortControllerRef.current = null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">KI Ablauf</h1>
        <SaveLoad />
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg shadow-sm mb-8">
        <p className="text-indigo-900">
          Die KI unterstützt Sie bei der Erstellung und Optimierung Ihres didaktischen Templates. 
          Sie können den kompletten Unterrichtsablauf generieren lassen oder bestehende Strukturen optimieren. 
          Zusätzlich hilft die KI bei der Suche nach passenden Bildungsressourcen in der WLO-Datenbank.
        </p>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">API-Konfiguration</h2>
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
              {AI_MODELS.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Prozessauswahl</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">KI-Optionen</label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useKIFlow}
                  onChange={(e) => setUseKIFlow(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>KI Ablauf</span>
              </label>
              
              {useKIFlow && (
                <div className="pl-8">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={learnFromCommunity}
                      onChange={(e) => setLearnFromCommunity(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Aus Community-Templates lernen</span>
                  </label>
                </div>
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useKIFilter}
                  onChange={(e) => setUseKIFilter(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>KI Filter</span>
              </label>

              {useKIFilter && (
                <div className="pl-8 space-y-2">
                  <div className="text-sm font-medium text-gray-700 mb-2">Zu verarbeitende Ressourcen:</div>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedResourceTypes.materials}
                      onChange={() => handleResourceTypeToggle('materials')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Bildungsinhalte</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedResourceTypes.tools}
                      onChange={() => handleResourceTypeToggle('tools')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Werkzeuge</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={selectedResourceTypes.services}
                      onChange={() => handleResourceTypeToggle('services')}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">Dienste</span>
                  </label>

                  <div className="text-sm font-medium text-gray-700 mb-2">Metadaten für Filter:</div>
                  {METADATA_OPTIONS.map(option => (
                    <label key={option.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={selectedMetadata.includes(option.id)}
                        onChange={() => handleMetadataToggle(option.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm">{option.label}</span>
                    </label>
                  ))}
                </div>
              )}

              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={useWLOInhalte}
                  onChange={(e) => setUseWLOInhalte(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span>WLO Inhalte (erfordert KI Filter)</span>
              </label>

              {useWLOInhalte && (
                <div className="pl-8 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">API-Endpunkt</label>
                    <select
                      value={endpoint}
                      onChange={(e) => setEndpoint(e.target.value as keyof typeof API_ENDPOINTS)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="PRODUCTION">Produktion</option>
                      <option value="STAGING">Staging</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Maximale Ergebnisse</label>
                    <input
                      type="number"
                      value={maxItems}
                      onChange={(e) => setMaxItems(Math.max(1, parseInt(e.target.value) || 1))}
                      min="1"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Verknüpfungsmodus</label>
                    <select
                      value={combineMode}
                      onChange={(e) => setCombineMode(e.target.value as 'OR' | 'AND')}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="AND">UND</option>
                      <option value="OR">ODER</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Anweisungen für KI</label>
        <textarea
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          placeholder="Geben Sie Ihre Anweisungen für die Anpassung des Templates ein..."
        />
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Verarbeitungsstatus</h2>
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
          <span className="block sm:inline">Template wurde erfolgreich aktualisiert!</span>
        </div>
      )}

      <div className="flex justify-end space-x-2">
        {loading && (
          <button
            onClick={handleCancel}
            className="px-4 py-2 rounded text-white bg-red-500 hover:bg-red-600"
          >
            Abbrechen
          </button>
        )}
        <button
          onClick={handleProcess}
          disabled={loading}
          className={`px-4 py-2 rounded text-white ${
            loading
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Verarbeite...' : 'Verarbeitung starten'}
        </button>
      </div>
    </div>
  );
};

export default AIFlowAgent;