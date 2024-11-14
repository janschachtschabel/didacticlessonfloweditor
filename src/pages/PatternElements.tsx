import { useTemplateStore } from '../store/templateStore';
import { SaveLoad } from '../components/SaveLoad';

const defaultProblem = {
  problem_description: '',
  learning_goals: [],
  didactic_keywords: []
};

const defaultContext = {
  target_group: '',
  subject: '',
  educational_level: '',
  prerequisites: '',
  time_frame: ''
};

const defaultSolution = {
  solution_description: '',
  didactic_approach: '',
  didactic_template: { learning_sequences: [] }
};

const defaultConsequences = {
  advantages: [],
  disadvantages: []
};

const defaultFeedback = {
  comments: []
};

export function PatternElements() {
  const { 
    problem = defaultProblem,
    setProblem,
    influence_factors = [],
    setInfluenceFactors,
    context = defaultContext,
    setContext,
    solution = defaultSolution,
    setSolution,
    consequences = defaultConsequences,
    setConsequences,
    implementation_notes = [],
    setImplementationNotes,
    related_patterns = [],
    setRelatedPatterns,
    feedback = defaultFeedback,
    setFeedback,
    sources = [],
    setSources
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

  const handleAdvantagesChange = (value: string) => {
    setConsequences({
      ...consequences,
      advantages: value.split('\n').map(a => a.trim()).filter(a => a)
    });
  };

  const handleDisadvantagesChange = (value: string) => {
    setConsequences({
      ...consequences,
      disadvantages: value.split('\n').map(d => d.trim()).filter(d => d)
    });
  };

  const handleRelatedPatternsChange = (value: string) => {
    setRelatedPatterns(value.split('\n').map(p => p.trim()).filter(p => p));
  };

  const handleAddImplementationNote = () => {
    const noteNumber = implementation_notes.length + 1;
    const noteId = `Note${noteNumber}`;
    
    setImplementationNotes([
      ...implementation_notes,
      { note_id: noteId, description: '' }
    ]);
  };

  const handleUpdateImplementationNote = (index: number, description: string) => {
    const newNotes = [...implementation_notes];
    newNotes[index] = { ...newNotes[index], description };
    setImplementationNotes(newNotes);
  };

  const handleRemoveImplementationNote = (index: number) => {
    setImplementationNotes(implementation_notes.filter((_, i) => i !== index));
  };

  const handleAddSource = () => {
    const sourceNumber = sources.length + 1;
    const sourceId = `S${sourceNumber}`;
    
    setSources([
      ...sources,
      {
        source_id: sourceId,
        title: '',
        author: '',
        year: new Date().getFullYear(),
        publisher: '',
        url: ''
      }
    ]);
  };

  const handleUpdateSource = (index: number, updates: Partial<typeof sources[0]>) => {
    const newSources = [...sources];
    newSources[index] = { ...newSources[index], ...updates };
    setSources(newSources);
  };

  const handleRemoveSource = (index: number) => {
    setSources(sources.filter((_, i) => i !== index));
  };

  const handleAddFeedback = () => {
    const newComment = {
      date: new Date().toISOString().split('T')[0],
      name: '',
      comment: ''
    };
    
    setFeedback({
      comments: [...feedback.comments, newComment]
    });
  };

  const handleUpdateFeedback = (index: number, updates: Partial<typeof feedback.comments[0]>) => {
    const newComments = [...feedback.comments];
    newComments[index] = { ...newComments[index], ...updates };
    setFeedback({ comments: newComments });
  };

  const handleRemoveFeedback = (index: number) => {
    setFeedback({
      comments: feedback.comments.filter((_, i) => i !== index)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold">Patternelemente</h1>
        <SaveLoad />
      </div>

      {/* Problem Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Problem</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Problembeschreibung</label>
            <textarea
              value={problem.problem_description}
              onChange={(e) => setProblem({ ...problem, problem_description: e.target.value })}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Lernziele (eines pro Zeile)</label>
            <textarea
              value={problem.learning_goals.join('\n')}
              onChange={(e) => handleLearningGoalsChange(e.target.value)}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Didaktische Schlüsselwörter (kommagetrennt)</label>
            <input
              type="text"
              value={problem.didactic_keywords.join(', ')}
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
              value={context.target_group}
              onChange={(e) => setContext({ ...context, target_group: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Fach</label>
            <input
              type="text"
              value={context.subject}
              onChange={(e) => setContext({ ...context, subject: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Bildungsstufe</label>
            <input
              type="text"
              value={context.educational_level}
              onChange={(e) => setContext({ ...context, educational_level: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Voraussetzungen</label>
            <input
              type="text"
              value={context.prerequisites}
              onChange={(e) => setContext({ ...context, prerequisites: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Zeitrahmen</label>
            <input
              type="text"
              value={context.time_frame}
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
              value={solution.solution_description}
              onChange={(e) => setSolution({ ...solution, solution_description: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Didaktischer Ansatz</label>
            <textarea
              value={solution.didactic_approach}
              onChange={(e) => setSolution({ ...solution, didactic_approach: e.target.value })}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="z.B. Problemorientiertes Lernen, Entdeckendes Lernen, etc."
            />
          </div>
        </div>
      </div>

      {/* Consequences Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Konsequenzen</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Vorteile (einer pro Zeile)</label>
            <textarea
              value={consequences.advantages.join('\n')}
              onChange={(e) => handleAdvantagesChange(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="z.B. Fördert selbstständiges Lernen"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nachteile (einer pro Zeile)</label>
            <textarea
              value={consequences.disadvantages.join('\n')}
              onChange={(e) => handleDisadvantagesChange(e.target.value)}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="z.B. Höherer Zeitaufwand in der Vorbereitung"
            />
          </div>
        </div>
      </div>

      {/* Implementation Notes Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Umsetzungshinweise</h2>
        <div className="space-y-4">
          {implementation_notes.map((note, index) => (
            <div key={note.note_id} className="flex gap-4 items-start">
              <div className="flex-1">
                <textarea
                  value={note.description}
                  onChange={(e) => handleUpdateImplementationNote(index, e.target.value)}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="Beschreiben Sie den Umsetzungshinweis..."
                />
              </div>
              <button
                onClick={() => handleRemoveImplementationNote(index)}
                className="mt-1 p-2 text-red-600 hover:text-red-800"
              >
                Entfernen
              </button>
            </div>
          ))}
          <button
            onClick={handleAddImplementationNote}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Hinweis hinzufügen
          </button>
        </div>
      </div>

      {/* Related Patterns Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Verwandte Muster</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700">Verwandte Muster (eines pro Zeile)</label>
          <textarea
            value={related_patterns.join('\n')}
            onChange={(e) => handleRelatedPatternsChange(e.target.value)}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="z.B. Kooperatives Lernen"
          />
        </div>
      </div>

      {/* Feedback Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Feedback</h2>
        <div className="space-y-4">
          {feedback.comments.map((comment, index) => (
            <div key={index} className="border p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4 mb-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Datum</label>
                  <input
                    type="date"
                    value={comment.date}
                    onChange={(e) => handleUpdateFeedback(index, { date: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    value={comment.name}
                    onChange={(e) => handleUpdateFeedback(index, { name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Kommentar</label>
                <textarea
                  value={comment.comment}
                  onChange={(e) => handleUpdateFeedback(index, { comment: e.target.value })}
                  rows={2}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleRemoveFeedback(index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Entfernen
              </button>
            </div>
          ))}
          <button
            onClick={handleAddFeedback}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Feedback hinzufügen
          </button>
        </div>
      </div>

      {/* Sources Section */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Quellen</h2>
        <div className="space-y-4">
          {sources.map((source, index) => (
            <div key={source.source_id} className="border p-4 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Titel</label>
                  <input
                    type="text"
                    value={source.title}
                    onChange={(e) => handleUpdateSource(index, { title: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Autor</label>
                  <input
                    type="text"
                    value={source.author}
                    onChange={(e) => handleUpdateSource(index, { author: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Jahr</label>
                  <input
                    type="number"
                    value={source.year}
                    onChange={(e) => handleUpdateSource(index, { year: parseInt(e.target.value) })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Verlag</label>
                  <input
                    type="text"
                    value={source.publisher}
                    onChange={(e) => handleUpdateSource(index, { publisher: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">URL</label>
                <input
                  type="url"
                  value={source.url}
                  onChange={(e) => handleUpdateSource(index, { url: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={() => handleRemoveSource(index)}
                className="mt-2 text-red-600 hover:text-red-800"
              >
                Entfernen
              </button>
            </div>
          ))}
          <button
            onClick={handleAddSource}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Quelle hinzufügen
          </button>
        </div>
      </div>
    </div>
  );
}