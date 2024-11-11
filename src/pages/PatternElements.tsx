import { useTemplateStore } from '../store/templateStore';

export function PatternElements() {
  const { 
    problem, setProblem,
    influence_factors, setInfluenceFactors,
    context, setContext,
    solution, setSolution
  } = useTemplateStore();

  const handleLearningGoalsChange = (value: string) => {
    setProblem({
      ...problem,
      learning_goals: value.split('\n').map(g => g.trim()).filter(g => g)
    });
  };

  const handleKeywordsChange = (value: string) => {
    setProblem({
      ...problem,
      didactic_keywords: value.split(',').map(k => k.trim()).filter(k => k)
    });
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Patternelemente</h1>

      {/* Problem Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Problem</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Problembeschreibung</label>
            <textarea
              value={problem.problem_description || ''}
              onChange={(e) => setProblem({ ...problem, problem_description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lernziele (eines pro Zeile)</label>
            <textarea
              value={(problem.learning_goals || []).join('\n')}
              onChange={(e) => handleLearningGoalsChange(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Didaktische Schlüsselwörter (kommagetrennt)</label>
            <input
              type="text"
              value={(problem.didactic_keywords || []).join(', ')}
              onChange={(e) => handleKeywordsChange(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Context Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Kontext</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Zielgruppe</label>
            <input
              type="text"
              value={context.target_group || ''}
              onChange={(e) => setContext({ ...context, target_group: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fach</label>
            <input
              type="text"
              value={context.subject || ''}
              onChange={(e) => setContext({ ...context, subject: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bildungsstufe</label>
            <input
              type="text"
              value={context.educational_level || ''}
              onChange={(e) => setContext({ ...context, educational_level: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Voraussetzungen</label>
            <input
              type="text"
              value={context.prerequisites || ''}
              onChange={(e) => setContext({ ...context, prerequisites: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Zeitrahmen</label>
            <input
              type="text"
              value={context.time_frame || ''}
              onChange={(e) => setContext({ ...context, time_frame: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Influence Factors Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Einflussfaktoren</h2>
        <div className="space-y-4">
          {influence_factors.map((factor, index) => (
            <div key={index} className="flex gap-4 items-start">
              <div className="flex-1">
                <input
                  type="text"
                  value={factor.factor}
                  onChange={(e) => {
                    const newFactors = [...influence_factors];
                    newFactors[index] = { ...factor, factor: e.target.value };
                    setInfluenceFactors(newFactors);
                  }}
                  placeholder="Faktor"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
                <textarea
                  value={factor.description}
                  onChange={(e) => {
                    const newFactors = [...influence_factors];
                    newFactors[index] = { ...factor, description: e.target.value };
                    setInfluenceFactors(newFactors);
                  }}
                  placeholder="Beschreibung"
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => {
                  const newFactors = influence_factors.filter((_, i) => i !== index);
                  setInfluenceFactors(newFactors);
                }}
                className="mt-1 p-2 text-red-600 hover:text-red-800"
              >
                Entfernen
              </button>
            </div>
          ))}
          <button
            onClick={() => setInfluenceFactors([...influence_factors, { factor: '', description: '' }])}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Faktor hinzufügen
          </button>
        </div>
      </div>

      {/* Solution Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Lösung</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Lösungsbeschreibung</label>
            <textarea
              value={solution.solution_description || ''}
              onChange={(e) => setSolution({ ...solution, solution_description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Didaktischer Ansatz</label>
            <textarea
              value={solution.didactic_approach || ''}
              onChange={(e) => setSolution({ ...solution, didactic_approach: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}