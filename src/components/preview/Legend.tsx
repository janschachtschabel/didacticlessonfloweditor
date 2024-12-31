import { FC } from 'react';
import { Panel } from 'reactflow';

export const Legend: FC = () => (
  <Panel position="top-left" className="bg-white p-2 rounded shadow">
    <div className="space-y-2 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-gray-100 border-2 border-gray-500"></div>
        <span>Lösung</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-blue-100 border-2 border-blue-500"></div>
        <span>Lernsequenzen</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-100 border-2 border-green-500"></div>
        <span>Phasen</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-500"></div>
        <span>Aktivitäten</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-orange-100 border-2 border-orange-500"></div>
        <span>Rollen</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-pink-100 border-2 border-pink-500"></div>
        <span>Akteure</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-purple-100 border-2 border-purple-500"></div>
        <span>Lernumgebungen</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-100 border-2 border-red-500"></div>
        <span>Lernressourcen</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-indigo-100 border-2 border-indigo-500"></div>
        <span>Werkzeuge</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-teal-100 border-2 border-teal-500"></div>
        <span>Dienste</span>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-solid"></div>
          <span>Enthält/Implementiert</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-dashed"></div>
          <span>Referenziert</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-orange-500"></div>
          <span>Sequenzieller Ablauf</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-0 border-t-2 border-purple-500"></div>
          <span>Parallele Ausführung</span>
        </div>
      </div>
    </div>
  </Panel>
);