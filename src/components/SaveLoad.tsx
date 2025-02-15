import { useTemplateStore } from '../store/templateStore';
import { exampleTemplate } from '../data/exampleTemplate';
import { DocumentArrowDownIcon, DocumentArrowUpIcon, DocumentPlusIcon, TrashIcon, DocumentTextIcon, UsersIcon } from '@heroicons/react/24/outline';
import { Link } from 'react-router-dom';
import { generatePDF } from '../lib/pdfGenerator';

export function SaveLoad() {
  const state = useTemplateStore();

  const handleSave = () => {
    const template = {
      metadata: state.metadata,
      problem: state.problem,
      context: state.context,
      influence_factors: state.influence_factors,
      solution: state.solution,
      consequences: state.consequences,
      implementation_notes: state.implementation_notes,
      related_patterns: state.related_patterns,
      feedback: state.feedback,
      sources: state.sources,
      actors: state.actors,
      environments: state.environments
    };

    const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${template.metadata.title || 'template'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleLoad = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const template = JSON.parse(content);
        
        if (template.metadata) state.setMetadata(template.metadata);
        if (template.problem) state.setProblem(template.problem);
        if (template.context) state.setContext(template.context);
        if (template.influence_factors) state.setInfluenceFactors(template.influence_factors);
        if (template.solution) state.setSolution(template.solution);
        if (template.consequences) state.setConsequences(template.consequences);
        if (template.implementation_notes) state.setImplementationNotes(template.implementation_notes);
        if (template.related_patterns) state.setRelatedPatterns(template.related_patterns);
        if (template.feedback) state.setFeedback(template.feedback);
        if (template.sources) state.setSources(template.sources);
        if (template.actors) state.setActors(template.actors);
        if (template.environments) state.setEnvironments(template.environments);
      } catch (error) {
        console.error('Error loading template:', error);
        alert('Fehler beim Laden der Vorlage');
      }
    };
    reader.readAsText(file);
  };

  const handleLoadExample = () => {
    if (!confirm('Möchten Sie das Beispiel-Template laden? Aktuelle Änderungen gehen verloren.')) {
      return;
    }

    state.setMetadata(exampleTemplate.metadata);
    state.setProblem(exampleTemplate.problem);
    state.setContext(exampleTemplate.context);
    state.setInfluenceFactors(exampleTemplate.influence_factors);
    state.setSolution(exampleTemplate.solution);
    state.setConsequences(exampleTemplate.consequences);
    state.setImplementationNotes(exampleTemplate.implementation_notes);
    state.setRelatedPatterns(exampleTemplate.related_patterns);
    state.setFeedback(exampleTemplate.feedback);
    state.setSources(exampleTemplate.sources);
    state.setActors(exampleTemplate.actors);
    state.setEnvironments(exampleTemplate.environments);
  };

  const handleClear = () => {
    if (!confirm('Möchten Sie wirklich alle Daten löschen?')) {
      return;
    }
    
    state.setMetadata({ title: '', description: '', keywords: [], author: '', version: '1.0' });
    state.setProblem({ problem_description: '', learning_goals: [], didactic_keywords: [] });
    state.setContext({ target_group: '', subject: '', educational_level: '', prerequisites: '', time_frame: '' });
    state.setInfluenceFactors([]);
    state.setSolution({ solution_description: '', didactic_approach: '', didactic_template: { learning_sequences: [] } });
    state.setConsequences({ advantages: [], disadvantages: [] });
    state.setImplementationNotes([]);
    state.setRelatedPatterns([]);
    state.setFeedback({ comments: [] });
    state.setSources([]);
    state.setActors([]);
    state.setEnvironments([]);
  };

  const handleGeneratePDF = async () => {
    try {
      await generatePDF(state);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Fehler bei der PDF-Generierung. Bitte versuchen Sie es erneut.');
    }
  };

  return (
    <div className="flex space-x-2">
      <label className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 cursor-pointer flex items-center gap-1 text-sm">
        <DocumentArrowUpIcon className="w-4 h-4" />
        Template laden
        <input
          type="file"
          accept=".json"
          onChange={handleLoad}
          className="hidden"
        />
      </label>

      <button
        onClick={handleSave}
        className="px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 flex items-center gap-1 text-sm"
      >
        <DocumentArrowDownIcon className="w-4 h-4" />
        Template speichern
      </button>

      <button
        onClick={handleGeneratePDF}
        className="px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-1 text-sm"
      >
        <DocumentTextIcon className="w-4 h-4" />
        PDF generieren
      </button>

      <button
        onClick={handleLoadExample}
        className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1 text-sm"
      >
        <DocumentPlusIcon className="w-4 h-4" />
        Beispiel laden
      </button>
      
      <Link
        to="/community"
        className="px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 flex items-center gap-1 text-sm"
      >
        <UsersIcon className="w-4 h-4" />
        Community
      </Link>

      <button
        onClick={handleClear}
        className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 flex items-center gap-1 text-sm"
      >
        <TrashIcon className="w-4 h-4" />
        Einträge löschen
      </button>
    </div>
  );
}