import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Settings, LogOut, Code2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
  const location = useLocation();
  const { signOut } = useAuth();
  const [isExpanded, setIsExpanded] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div 
      className={`fixed left-0 top-0 h-screen bg-gray-900 text-white p-6 transition-none z-[9999] ${
        isExpanded ? 'w-64' : 'w-20'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className={`flex items-center gap-2 mb-12 ${!isExpanded && 'justify-center'}`}>
        <Code2 className="w-8 h-8 text-blue-400 ml-2 flex-shrink-0" />
        <span className={`text-xl ml-2 font-bold transition-opacity duration-300 ${
          !isExpanded ? 'opacity-0 w-0' : 'opacity-100'
        }`}>
          OneShot CodeGen
        </span>
      </div>
      
      <nav className="space-y-4">
        <Link
          to="/dashboard"
          className={`flex items-center  p-3 rounded-lg transition-colors ${
            isActive('/dashboard') ? 'bg-gray-800' : 'hover:bg-gray-800'
          } ${!isExpanded && 'justify-center'}`}
        >
          <LayoutDashboard className="w-5 h-5 ml-2 flex-shrink-0" />
          <span className={`transition-opacity ml-2 duration-300 ${
            !isExpanded ? 'opacity-0 w-0' : 'opacity-100'
          }`}>
            Dashboard
          </span>
        </Link>
        <Link
          to="/settings"
          className={`flex items-center  p-3 rounded-lg transition-colors ${
            isActive('/settings') ? 'bg-gray-800' : 'hover:bg-gray-800'
          } ${!isExpanded && 'justify-center'}`}
        >
          <Settings className="w-5 h-5 ml-2 flex-shrink-0" />
          <span className={`transition-opacity ml-2 duration-300 ${
            !isExpanded ? 'opacity-0 w-0' : 'opacity-100'
          }`}>
            Settings
          </span>
        </Link>
        <button
          onClick={signOut}
          className={`w-full flex items-center  p-3 rounded-lg hover:bg-gray-800 transition-colors ${
            !isExpanded && 'justify-center'
          }`}
        >
          <LogOut className="w-5 h-5 ml-2 flex-shrink-0" />
          <span className={`transition-opacity ml-2 duration-300 ${
            !isExpanded ? 'opacity-0 w-0' : 'opacity-100'
          }`}>
            Logout
          </span>
        </button>
      </nav>
    </div>
  );
};

export default Sidebar;