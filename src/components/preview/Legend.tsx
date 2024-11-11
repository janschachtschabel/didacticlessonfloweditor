import { FC } from 'react';
import { Panel } from 'reactflow';

export const Legend: FC = () => (
  <Panel position="top-left" className="bg-white p-2 rounded shadow">
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-100 border-2 border-gray-500"></div>
        <span>Solution</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500"></div>
        <span>Learning Sequences</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-100 border-2 border-green-500"></div>
        <span>Phases</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500"></div>
        <span>Activities</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500"></div>
        <span>Roles</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-pink-100 border-2 border-pink-500"></div>
        <span>Actors</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500"></div>
        <span>Learning Environments</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-100 border-2 border-red-500"></div>
        <span>Materials</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-500"></div>
        <span>Tools</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-teal-100 border-2 border-teal-500"></div>
        <span>Services</span>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-solid"></div>
          <span>Contains/Implements</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-dashed"></div>
          <span>References</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-orange-500"></div>
          <span>Sequential Flow</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-purple-500"></div>
          <span>Parallel Execution</span>
        </div>
      </div>
    </div>
  </Panel>
);