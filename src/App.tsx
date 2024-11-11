import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { GeneralSettings } from './pages/GeneralSettings';
import { PatternElements } from './pages/PatternElements';
import { Actors } from './pages/Actors';
import { LearningEnvironments } from './pages/LearningEnvironments';
import { CourseFlow } from './pages/CourseFlow';
import { Preview } from './pages/Preview';
import { AIFlowAgent } from './pages/AIFlowAgent';
import { AIFilterAgent } from './pages/AIFilterAgent';
import { WLOAgent } from './pages/WLOAgent';
import { SaveLoad } from './components/SaveLoad';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="container mx-auto py-6 px-4">
          <SaveLoad />
          <div className="mt-6">
            <Routes>
              <Route path="/" element={<GeneralSettings />} />
              <Route path="/pattern-elements" element={<PatternElements />} />
              <Route path="/actors" element={<Actors />} />
              <Route path="/environments" element={<LearningEnvironments />} />
              <Route path="/course-flow" element={<CourseFlow />} />
              <Route path="/preview" element={<Preview />} />
              <Route path="/ai-flow-agent" element={<AIFlowAgent />} />
              <Route path="/ai-filter-agent" element={<AIFilterAgent />} />
              <Route path="/wlo-agent" element={<WLOAgent />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}