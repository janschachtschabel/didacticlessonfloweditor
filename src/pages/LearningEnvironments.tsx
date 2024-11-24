import { useTemplateStore } from '../store/templateStore';
import type { Material, Tool, Service } from '../store/templateStore';
import { MaterialEditor } from '../components/environments/MaterialEditor';
import { ToolEditor } from '../components/environments/ToolEditor';
import { ServiceEditor } from '../components/environments/ServiceEditor';
import { SaveLoad } from '../components/SaveLoad';
import { INHALTSTYP_MAPPING } from '../lib/mappings';

const defaultEnvironment = {
  id: '',
  name: '',
  description: '',
  materials: [],
  tools: [],
  services: []
};

export function LearningEnvironments() {
  const { environments = [], addEnvironment, updateEnvironment, removeEnvironment } = useTemplateStore();

  // Get the list of content types from the mapping
  const contentTypes = Object.keys(INHALTSTYP_MAPPING);

  const handleAddEnvironment = () => {
    const envNumber = environments.length + 1;
    const envId = `ENV${envNumber}`;
    
    addEnvironment({
      ...defaultEnvironment,
      id: envId
    });
  };

  const handleAddMaterial = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const materialNumber = (env.materials || []).length + 1;
      const materialId = `${envId}-M${materialNumber}`;
      
      const newMaterial: Material = {
        id: materialId,
        name: '',
        material_type: '',
        source: 'manual',
        access_link: ''
      };
      updateEnvironment(envId, {
        materials: [...(env.materials || []), newMaterial]
      });
    }
  };

  const handleAddTool = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const toolNumber = (env.tools || []).length + 1;
      const toolId = `${envId}-T${toolNumber}`;
      
      const newTool: Tool = {
        id: toolId,
        name: '',
        tool_type: '',
        source: 'manual',
        access_link: ''
      };
      updateEnvironment(envId, {
        tools: [...(env.tools || []), newTool]
      });
    }
  };

  const handleAddService = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const serviceNumber = (env.services || []).length + 1;
      const serviceId = `${envId}-S${serviceNumber}`;
      
      const newService: Service = {
        id: serviceId,
        name: '',
        service_type: '',
        source: 'manual',
        access_link: ''
      };
      updateEnvironment(envId, {
        services: [...(env.services || []), newService]
      });
    }
  };

  const handleUpdateMaterial = (envId: string, materialId: string, updates: Partial<Material>) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const updatedMaterials = (env.materials || []).map(material =>
        material.id === materialId ? { ...material, ...updates } : material
      );
      updateEnvironment(envId, { materials: updatedMaterials });
    }
  };

  const handleUpdateTool = (envId: string, toolId: string, updates: Partial<Tool>) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const updatedTools = (env.tools || []).map(tool =>
        tool.id === toolId ? { ...tool, ...updates } : tool
      );
      updateEnvironment(envId, { tools: updatedTools });
    }
  };

  const handleUpdateService = (envId: string, serviceId: string, updates: Partial<Service>) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const updatedServices = (env.services || []).map(service =>
        service.id === serviceId ? { ...service, ...updates } : service
      );
      updateEnvironment(envId, { services: updatedServices });
    }
  };

  const handleRemoveMaterial = (envId: string, materialId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      updateEnvironment(envId, {
        materials: (env.materials || []).filter(m => m.id !== materialId)
      });
    }
  };

  const handleRemoveTool = (envId: string, toolId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      updateEnvironment(envId, {
        tools: (env.tools || []).filter(t => t.id !== toolId)
      });
    }
  };

  const handleRemoveService = (envId: string, serviceId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      updateEnvironment(envId, {
        services: (env.services || []).filter(s => s.id !== serviceId)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Lernumgebungen</h1>
        <SaveLoad />
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-lg shadow-sm mb-8">
        <p className="text-teal-900">
          Lernumgebungen sind die Räume und Kontexte, in denen das Lernen stattfindet. Sie können eine oder mehrere 
          Lernumgebungen definieren und diese mit den benötigten Ressourcen ausstatten. Jede Lernumgebung kann folgende 
          Elemente enthalten:
        </p>
        <ul className="mt-4 space-y-2 text-teal-800 list-disc list-inside">
          <li>Lernressourcen (z.B. Arbeitsblätter, Videos, Übungen)</li>
          <li>Werkzeuge (z.B. Hardware, Software, Geräte)</li>
          <li>Dienste (z.B. Unterstützungsangebote, Online-Plattformen)</li>
        </ul>
        <p className="mt-4 text-teal-900">
          Wichtig: Alle Lernressourcen, Werkzeuge und Dienste, die Sie später im Unterrichtsablauf verwenden möchten, 
          müssen hier einer passenden Lernumgebung zugeordnet werden.
        </p>
      </div>

      {environments.map((env) => (
        <div key={env.id} className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={env.name}
                  onChange={(e) => updateEnvironment(env.id, { name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Beschreibung</label>
                <textarea
                  value={env.description}
                  onChange={(e) => updateEnvironment(env.id, { description: e.target.value })}
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            <button
              onClick={() => removeEnvironment(env.id)}
              className="ml-4 text-red-600 hover:text-red-800"
            >
              Entfernen
            </button>
          </div>

          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Lernressourcen</h3>
              <button
                onClick={() => handleAddMaterial(env.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Lernressource hinzufügen
              </button>
            </div>
            {(env.materials || []).map((material) => (
              <MaterialEditor
                key={material.id}
                material={material}
                onUpdate={(updates) => handleUpdateMaterial(env.id, material.id, updates)}
                onDelete={() => handleRemoveMaterial(env.id, material.id)}
                isNew={material.name === ''}
                contentTypes={contentTypes}
              />
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Werkzeuge</h3>
              <button
                onClick={() => handleAddTool(env.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Werkzeug hinzufügen
              </button>
            </div>
            {(env.tools || []).map((tool) => (
              <ToolEditor
                key={tool.id}
                tool={tool}
                onUpdate={(updates) => handleUpdateTool(env.id, tool.id, updates)}
                onDelete={() => handleRemoveTool(env.id, tool.id)}
                isNew={tool.name === ''}
              />
            ))}
          </div>

          <div className="mt-6">
            <div className="mb-4">
              <h3 className="text-lg font-medium mb-2">Dienste</h3>
              <button
                onClick={() => handleAddService(env.id)}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Dienst hinzufügen
              </button>
            </div>
            {(env.services || []).map((service) => (
              <ServiceEditor
                key={service.id}
                service={service}
                onUpdate={(updates) => handleUpdateService(env.id, service.id, updates)}
                onDelete={() => handleRemoveService(env.id, service.id)}
                isNew={service.name === ''}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        onClick={handleAddEnvironment}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Lernumgebung hinzufügen
      </button>
    </div>
  );
}