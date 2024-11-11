import { useState } from 'react';
import type { Tool } from '../../store/templateStore';
import { FilterEditor } from './FilterEditor';

interface ToolEditorProps {
  tool: Tool & { isNew?: boolean };
  onUpdate: (updates: Partial<Tool>) => void;
  onDelete: () => void;
  isEditing?: boolean;
}

export function ToolEditor({ tool, onUpdate, onDelete, isEditing: initialEditing = false }: ToolEditorProps) {
  const [isEditing, setIsEditing] = useState(initialEditing);

  const handleUpdate = (updates: Partial<Tool>) => {
    onUpdate({ ...tool, ...updates });
  };

  if (!isEditing) {
    return (
      <div className="border rounded-lg p-4 mb-4 bg-white">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="font-semibold">{tool.name || 'Unnamed Tool'}</h4>
            <p className="text-sm text-gray-600">{tool.tool_type}</p>
            <p className="text-sm text-gray-500">Source: {tool.source}</p>
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
          value={tool.name}
          onChange={(e) => handleUpdate({ name: e.target.value })}
          className="w-full p-2 border rounded"
          autoFocus
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Type</label>
        <input
          type="text"
          value={tool.tool_type}
          onChange={(e) => handleUpdate({ tool_type: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Access Link</label>
        <input
          type="text"
          value={tool.access_link}
          onChange={(e) => handleUpdate({ access_link: e.target.value })}
          className="w-full p-2 border rounded"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Source</label>
        <select
          value={tool.source}
          onChange={(e) => handleUpdate({ source: e.target.value as Tool['source'] })}
          className="w-full p-2 border rounded"
        >
          <option value="manual">Manual</option>
          <option value="database">Database</option>
          <option value="filter">Filter</option>
        </select>
      </div>

      {tool.source === 'database' && (
        <div>
          <label className="block text-sm font-medium mb-1">Database ID</label>
          <input
            type="text"
            value={tool.database_id || ''}
            onChange={(e) => handleUpdate({ database_id: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      )}

      {tool.source === 'filter' && (
        <div>
          <label className="block text-sm font-medium mb-1">Filter Criteria</label>
          <FilterEditor
            filter={tool.filter_criteria || {}}
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