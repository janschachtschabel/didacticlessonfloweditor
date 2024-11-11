import { useState } from 'react';
import { Editor } from './Editor';
import { ProcessingStatus } from './ProcessingStatus';

interface WLOAgentProps {
  status: string[];
  addStatus: (message: string) => void;
  processing: boolean;
  setProcessing: (processing: boolean) => void;
}

const DEFAULT_ENDPOINT = 'https://redaktion.openeduhub.net/edu-sharing/rest';
const DEFAULT_MAX_ITEMS = 5;

export function WLOAgent({ status, addStatus, processing, setProcessing }: WLOAgentProps) {
  const [endpoint, setEndpoint] = useState(DEFAULT_ENDPOINT);
  const [maxItems, setMaxItems] = useState(DEFAULT_MAX_ITEMS);
  const [combineMode, setCombineMode] = useState<'OR' | 'AND'>('OR');

  const handleProcess = async () => {
    setProcessing(true);
    addStatus('Starting WLO resource processing...');
    
    try {
      // Processing logic will be implemented here
      addStatus('Processing completed successfully');
    } catch (error) {
      addStatus(`Error during processing: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">API Configuration</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">API Endpoint</label>
            <input
              type="text"
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Max Results</label>
            <input
              type="number"
              value={maxItems}
              onChange={(e) => setMaxItems(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Combine Mode</label>
            <select
              value={combineMode}
              onChange={(e) => setCombineMode(e.target.value as 'OR' | 'AND')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="OR">OR</option>
              <option value="AND">AND</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleProcess}
          disabled={processing}
          className={`px-4 py-2 rounded text-white ${
            processing
              ? 'bg-blue-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {processing ? 'Processing...' : 'Process Resources'}
        </button>
      </div>

      <ProcessingStatus status={status} />
    </div>
  );
}