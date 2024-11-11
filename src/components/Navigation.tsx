import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'General Settings' },
  { path: '/pattern-elements', label: 'Pattern Elements' },
  { path: '/actors', label: 'Actors' },
  { path: '/environments', label: 'Learning Environments' },
  { path: '/course-flow', label: 'Course Flow' },
  { path: '/preview', label: 'Preview' },
  { path: '/ai-flow-agent', label: 'AI Flow Agent' },
  { path: '/ai-filter-agent', label: 'AI Filter Agent' }
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto">
          {navItems.map(({ path, label }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${
                location.pathname === path
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}