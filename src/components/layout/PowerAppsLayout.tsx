import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Users, ClipboardList, LineChart, Menu, LogOut, User } from 'lucide-react';
import { useAuthStore, switchUserRole } from '../../stores/authStore';
import { User as UserType, Role } from '../../types/dataModel';
import { findUserById } from '../../mockData/users';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  roles: Role[];
}

export const PowerAppsLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  if (!currentUser) return null;

  const navItems: NavItem[] = [
    { 
      label: 'Home', 
      path: '/', 
      icon: <Users size={20} />, 
      roles: ['Project Manager', 'BA', 'Developer', 'Stakeholder'] 
    },
    { 
      label: 'Assessments', 
      path: '/assessments', 
      icon: <ClipboardList size={20} />, 
      roles: ['Project Manager'] 
    },
    { 
      label: 'My Assessments', 
      path: '/ba-management', 
      icon: <ClipboardList size={20} />, 
      roles: ['BA'] 
    },
    { 
      label: 'My Tasks', 
      path: '/developer-tasks', 
      icon: <ClipboardList size={20} />, 
      roles: ['Developer'] 
    },
    { 
      label: 'Dashboard', 
      path: '/dashboard', 
      icon: <LineChart size={20} />, 
      roles: ['Project Manager', 'BA', 'Developer', 'Stakeholder'] 
    },
  ];

  const filteredNavItems = navItems.filter(item => 
    item.roles.includes(currentUser.role)
  );

  const handleRoleSwitch = (role: Role) => {
    switchUserRole(role);
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Power Apps Header */}
      <header className="pa-header">
        <div className="flex items-center">
          <button 
            onClick={() => setMenuOpen(!menuOpen)}
            className="lg:hidden mr-2 p-1"
          >
            <Menu size={24} />
          </button>
          <h1 className="text-xl font-semibold">Project Tracker</h1>
        </div>
        
        <div className="relative">
          <button 
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="flex items-center space-x-2 hover:bg-[var(--power-apps-primary-dark)] p-2 rounded-md"
          >
            <User size={20} />
            <span>{currentUser.name}</span>
          </button>
          
          {userMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md z-10">
              <div className="p-3 border-b">
                <p className="font-semibold">{currentUser.name}</p>
                <p className="text-sm text-gray-600">{currentUser.role}</p>
              </div>
              
              <div className="p-2">
                <p className="px-3 py-1 text-sm font-medium text-gray-700">Switch Role:</p>
                <button 
                  onClick={() => handleRoleSwitch('Project Manager')}
                  className="w-full text-left px-3 py-1 hover:bg-gray-100 rounded-md"
                >
                  Project Manager
                </button>
                <button 
                  onClick={() => handleRoleSwitch('BA')}
                  className="w-full text-left px-3 py-1 hover:bg-gray-100 rounded-md"
                >
                  Business Analyst
                </button>
                <button 
                  onClick={() => handleRoleSwitch('Developer')}
                  className="w-full text-left px-3 py-1 hover:bg-gray-100 rounded-md"
                >
                  Developer
                </button>
                <button 
                  onClick={() => handleRoleSwitch('Stakeholder')}
                  className="w-full text-left px-3 py-1 hover:bg-gray-100 rounded-md"
                >
                  Stakeholder
                </button>
              </div>
            </div>
          )}
        </div>
      </header>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Side Navigation */}
        <nav className={`bg-[#f0f0f0] w-64 border-r border-[var(--power-apps-border)] ${
          menuOpen ? 'block absolute z-10 h-full lg:relative' : 'hidden lg:block'
        }`}>
          <div className="p-4">
            <div className="border-b pb-2 mb-4 border-[var(--power-apps-border)]">
              <p className="font-medium">Current Role:</p>
              <p>{currentUser.role}</p>
            </div>
            
            <ul className="space-y-1">
              {filteredNavItems.map((item) => (
                <li key={item.path}>
                  <button
                    onClick={() => {
                      navigate(item.path);
                      setMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-md ${
                      location.pathname === item.path
                        ? 'bg-[var(--power-apps-primary)] text-white'
                        : 'hover:bg-gray-200'
                    }`}
                  >
                    {item.icon}
                    <span>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </nav>
        
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-[var(--power-apps-background)] p-4">
          {children}
        </main>
      </div>
    </div>
  );
};