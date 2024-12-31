import React from 'react';
import { FlowGraph } from '../components/preview/FlowGraph';
import { TableView } from '../components/preview/TableView';
import { RawData } from '../components/preview/RawData';
import { SaveLoad } from '../components/SaveLoad';

export function Preview() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Vorschau</h1>
        <SaveLoad />
      </div>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg shadow-sm mb-8">
        <p className="text-indigo-900">
          Hier sehen Sie Ihr didaktisches Template in verschiedenen Ansichten:
        </p>
        <ul className="mt-4 space-y-2 text-indigo-800 list-disc list-inside">
          <li>
            <span className="font-medium">Tabellenansicht:</span> Detaillierte Übersicht aller Aktivitäten und Rollen, 
            einschließlich der empfohlenen WLO-Bildungsressourcen nach erfolgtem Inhalte-Abruf
          </li>
          <li>
            <span className="font-medium">Graphansicht:</span> Visualisierung der Beziehungen und Abläufe zwischen allen 
            Komponenten des Templates
          </li>
          <li>
            <span className="font-medium">Rohdaten:</span> Technische JSON-Struktur für Export/Import und 
            Weiterverarbeitung
          </li>
        </ul>
      </div>
      
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Tabellenansicht</h2>
        <TableView />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Graphansicht</h2>
        <FlowGraph />
      </div>

      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Rohdaten</h2>
        <RawData />
      </div>
    </div>
  );
}