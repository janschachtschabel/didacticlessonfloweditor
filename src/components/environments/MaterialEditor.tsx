import { useState } from 'react';
import type { Material } from '../../store/templateStore';
import { FilterEditor } from './FilterEditor';

interface MaterialEditorProps {
  material: Material & { isNew?: boolean };
  onUpdate: (updates: Partial<Material>) => void;
  onDelete: () => void;
  isEditing?: boolean;
}

export function MaterialEditor({ material, onUpdate, onDelete, isEditing: initialEditing = false }: MaterialEditorProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);

  const handleUpdate = (updates: Partial<Material>) => {
    onUpdate({ ...material, ...updates });
  };

  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{material.name || 'Unnamed Material'}</h4>
            <p className="text-sm text-gray-600">{material.material_type}</p>
            <p className="text-sm text-gray-500">Source: {material.source}</p>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1 text-sm bg-blue-100 rounded hover:bg-blue-200"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="px-3 py-1 text-sm bg-red-100 rounded hover:bg-red-200"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border rounded-lg p-4 mb-4 bg-white space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          value={material.name}
          onChange={(e) => handleUpdate({ name: e.target.value })}
          className="w-full p-2 border rounded"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <input
          type="text"
          value={material.material_type}
          onChange={(e) => handleUpdate({ material_type: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Access Link</label>
        <input
          type="text"
          value={material.access_link}
          onChange={(e) => handleUpdate({ access_link: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Source</label>
        <select
          value={material.source}
          onChange={(e) => handleUpdate({ source: e.target.value as Material['source'] })}
          className="w-full p-2 border rounded"
        >
          <option value="manual">Manual</option>
          <option value="database">Database</option>
          <option value="filter">Filter</option>
        </select>
      </div>

      {material.source === 'database' && (
        <div>
          <label className="block text-sm font-medium mb-1">Database ID</label>
          <input
            type="text"
            value={material.database_id || ''}
            onChange={(e) => handleUpdate({ database_id: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {material.source === 'filter' && (
        <div>
          <label className="block text-sm font-medium mb-1">Filter Criteria</label>
          <FilterEditor
            filter={material.filter_criteria || {}}
            onChange={(filter) => handleUpdate({ filter_criteria: filter })}
          />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          onClick={() => setIsEditing(false)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
      </div>
    </div>
  );
}