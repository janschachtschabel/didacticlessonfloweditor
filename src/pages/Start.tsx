import { Link } from 'react-router-dom';
import { SaveLoad } from '../components/SaveLoad';

export function Start() {
  return (
    <div className="space-y-8">
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-lg">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-3xl font-bold text-blue-900">Unterrichtsabläufe</h1>
          <SaveLoad />
        </div>

        <p className="text-lg text-blue-800">
          Erstellen Sie professionelle didaktische Templates mit KI-Unterstützung und direkter Integration von Bildungsressourcen aus der WLO-Datenbank. Alle Inhalte werden automatisch mit der korrekten Basis-URL verknüpft.
        </p>
      </div>

      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-purple-900">Was ist der KI Assistent für Unterrichtsabläufe?</h2>
        <p className="text-purple-800">
          Ein intelligentes Werkzeug zur Erstellung strukturierter Unterrichtsabläufe. Kombinieren Sie didaktische Entwurfsmuster mit passenden Bildungsressourcen aus der WLO-Datenbank und erstellen Sie wiederverwendbare Templates für Ihren Unterricht. Laden Sie praxiserprobte Vorlagen aus der Community und passen Sie diese für Ihre Zwecke an.
        </p>
      </div>

      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-green-900">Ihre Vorteile</h2>
        <ul className="space-y-2 text-green-800">
          <li className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            Maschinenlesbare Unterrichtsabläufe für einfachen Austausch
          </li>
          <li className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            Professionalisierung durch Community-Austausch
          </li>
          <li className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            Stärkung der Lehrenden-Community
          </li>
          <li className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            Zeitersparnis in der Unterrichtsvorbereitung
          </li>
          <li className="flex items-center">
            <span className="text-emerald-500 mr-2">✓</span>
            KI-gestützte Optimierung und WLO-Integration
          </li>
        </ul>
      </div>

      <div className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-amber-900">Empfohlener Workflow</h2>
        <div className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <div className="text-lg font-medium text-amber-700">1. Grundlagen definieren</div>
            <p className="text-amber-800">
              Beginnen Sie mit der Beschreibung und Didaktik. Definieren Sie Probleme, Ziele und Kontext.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium text-amber-700">2. Struktur aufbauen</div>
            <p className="text-amber-800">
              Legen Sie Akteure und Lernumgebungen fest. Suchen Sie passende WLO-Ressourcen im Warenkorb und gestalten Sie den Unterrichtsablauf.
            </p>
          </div>
          <div className="space-y-2">
            <div className="text-lg font-medium text-amber-700">3. Optimieren & Erweitern</div>
            <p className="text-amber-800">
              Nutzen Sie die KI-Funktionen für die Optimierung und die WLO-Integration für passende Bildungsressourcen.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-r from-cyan-50 to-teal-50 p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4 text-cyan-900">Hilfreiche Tipps</h2>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2 text-cyan-800">Bearbeiten Sie die Tabs von links nach rechts:</h3>
            <ul className="space-y-2 text-cyan-700 list-disc list-inside">
              <li>Allgemeines - Grundlegende Informationen</li>
              <li>Didaktik - Didaktische Struktur</li>
              <li>Akteure - Beteiligte Personen/Gruppen</li>
              <li>Lernumgebungen - Manuelle Ressourcen & Werkzeuge</li>
              <li>Warenkorb - WLO-Bildungsressourcen suchen</li>
              <li>Unterrichtsablauf - Detaillierte Planung</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2 text-cyan-800">Zusätzliche Funktionen:</h3>
            <ul className="space-y-2 text-cyan-700 list-disc list-inside">
              <li>Vorschau - Visualisierung mit WLO-Vorschaubildern</li>
              <li>KI Ablauf - Automatische Optimierung</li>
              <li>KI Filter - Intelligente Ressourcensuche</li>
              <li>WLO Inhalte - Integration von Bildungsressourcen</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <Link 
          to="/general-settings"
          className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium text-lg shadow-lg transform transition hover:scale-105"
        >
          Jetzt starten
        </Link>
      </div>
    </div>
  );
}