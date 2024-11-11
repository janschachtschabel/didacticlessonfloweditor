import { useTemplateStore } from '../store/templateStore';
import type { Material, Tool, Service } from '../store/templateStore';
import { MaterialEditor } from '../components/environments/MaterialEditor';
import { ToolEditor } from '../components/environments/ToolEditor';
import { ServiceEditor } from '../components/environments/ServiceEditor';

export function LearningEnvironments() {
  const { environments, addEnvironment, updateEnvironment, removeEnvironment } = useTemplateStore();

  const handleAddEnvironment = () => {
    addEnvironment({
      id: `env-${Date.now()}`,
      name: '',
      description: '',
      materials: [],
      tools: [],
      services: []
    });
  };

  const handleAddMaterial = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const newMaterial: Material = {
        id: `mat-${Date.now()}`,
        name: '',
        material_type: '',
        source: 'manual',
        access_link: '',
        filter_criteria: {},
      };
      updateEnvironment(envId, {
        materials: [...env.materials, { ...newMaterial, isNew: true }]
      });
    }
  };

  const handleAddTool = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const newTool: Tool = {
        id: `tool-${Date.now()}`,
        name: '',
        tool_type: '',
        source: 'manual',
        access_link: '',
        filter_criteria: {},
      };
      updateEnvironment(envId, {
        tools: [...env.tools, { ...newTool, isNew: true }]
      });
    }
  };

  const handleAddService = (envId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const newService: Service = {
        id: `service-${Date.now()}`,
        name: '',
        service_type: '',
        source: 'manual',
        access_link: '',
        filter_criteria: {},
      };
      updateEnvironment(envId, {
        services: [...env.services, { ...newService, isNew: true }]
      });
    }
  };

  const handleUpdateMaterial = (envId: string, materialId: string, updates: Partial<Material>) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const updatedMaterials = env.materials.map(material =>
        material.id === materialId ? { ...material, ...updates, isNew: false } : material
      );
      updateEnvironment(envId, { materials: updatedMaterials });
    }
  };

  const handleUpdateTool = (envId: string, toolId: string, updates: Partial<Tool>) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const updatedTools = env.tools.map(tool =>
        tool.id === toolId ? { ...tool, ...updates, isNew: false } : tool
      );
      updateEnvironment(envId, { tools: updatedTools });
    }
  };

  const handleUpdateService = (envId: string, serviceId: string, updates: Partial<Service>) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      const updatedServices = env.services.map(service =>
        service.id === serviceId ? { ...service, ...updates, isNew: false } : service
      );
      updateEnvironment(envId, { services: updatedServices });
    }
  };

  const handleRemoveMaterial = (envId: string, materialId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      updateEnvironment(envId, {
        materials: env.materials.filter(m => m.id !== materialId)
      });
    }
  };

  const handleRemoveTool = (envId: string, toolId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      updateEnvironment(envId, {
        tools: env.tools.filter(t => t.id !== toolId)
      });
    }
  };

  const handleRemoveService = (envId: string, serviceId: string) => {
    const env = environments.find(e => e.id === envId);
    if (env) {
      updateEnvironment(envId, {
        services: env.services.filter(s => s.id !== serviceId)
      });
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Learning Environments</h1>

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
                <label className="block text-sm font-medium text-gray-700">Description</label>
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
              Remove
            </button>
          </div>

          {/* Materials Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Materials</h3>
            {env.materials.map((material) => (
              <MaterialEditor
                key={material.id}
                material={material}
                onUpdate={(updates) => handleUpdateMaterial(env.id, material.id, updates)}
                onDelete={() => handleRemoveMaterial(env.id, material.id)}
                isEditing={material.isNew}
              />
            ))}
            <button
              onClick={() => handleAddMaterial(env.id)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Material
            </button>
          </div>

          {/* Tools Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Tools</h3>
            {env.tools.map((tool) => (
              <ToolEditor
                key={tool.id}
                tool={tool}
                onUpdate={(updates) => handleUpdateTool(env.id, tool.id, updates)}
                onDelete={() => handleRemoveTool(env.id, tool.id)}
                isEditing={tool.isNew}
              />
            ))}
            <button
              onClick={() => handleAddTool(env.id)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Tool
            </button>
          </div>

          {/* Services Section */}
          <div className="mt-6">
            <h3 className="text-lg font-medium mb-2">Services</h3>
            {env.services.map((service) => (
              <ServiceEditor
                key={service.id}
                service={service}
                onUpdate={(updates) => handleUpdateService(env.id, service.id, updates)}
                onDelete={() => handleRemoveService(env.id, service.id)}
                isEditing={service.isNew}
              />
            ))}
            <button
              onClick={() => handleAddService(env.id)}
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Add Service
            </button>
          </div>
        </div>
      ))}

      <button
        onClick={handleAddEnvironment}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Environment
      </button>
    </div>
  );
}