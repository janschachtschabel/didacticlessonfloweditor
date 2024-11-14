import { Link, useLocation } from 'react-router-dom';
import {
  Cog6ToothIcon,
  PuzzlePieceIcon,
  UsersIcon,
  BuildingLibraryIcon,
  AcademicCapIcon,
  BoltIcon,
  FunnelIcon,
  GlobeAltIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

const navItems = [
  { 
    path: '/', 
    label: 'Allgemeine Einstellungen',
    icon: Cog6ToothIcon
  },
  { 
    path: '/pattern-elements', 
    label: 'Patternelemente',
    icon: PuzzlePieceIcon
  },
  { 
    path: '/actors', 
    label: 'Akteure',
    icon: UsersIcon
  },
  { 
    path: '/environments', 
    label: 'Lernumgebungen',
    icon: BuildingLibraryIcon
  },
  { 
    path: '/course-flow', 
    label: 'Unterrichtsablauf',
    icon: AcademicCapIcon
  },
  { 
    path: '/preview', 
    label: 'Vorschau',
    icon: ChartBarIcon
  },
  { 
    path: '/ai-flow-agent', 
    label: 'KI Ablauf',
    icon: BoltIcon
  },
  { 
    path: '/ai-filter-agent', 
    label: 'KI Filter',
    icon: FunnelIcon
  },
  { 
    path: '/wlo-agent', 
    label: 'WLO Inhalte',
    icon: GlobeAltIcon
  }
];

export function Navigation() {
  const location = useLocation();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex space-x-4 overflow-x-auto">
          {navItems.map(({ path, label, icon: Icon }) => (
            <Link
              key={path}
              to={path}
              className={`px-4 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 ${
                location.pathname === path
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <Icon className="w-4 h-4" />
              {label}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}