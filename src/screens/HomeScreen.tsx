import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ClipboardList, 
  UserCheck, 
  Code, 
  BarChart4 
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { findUserById } from '../mockData/users';
import { NotificationProvider } from '../components/ui/Notification';

export const HomeScreen: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, isUserRole } = useAuthStore();
  
  if (!currentUser) return null;
  
  return (
    <NotificationProvider>
      <div className="pa-container">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold mb-2">Welcome, {currentUser.name}</h1>
          <p className="text-gray-600">
            You are logged in as a {currentUser.role}. Select an option below to get started.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {isUserRole('Project Manager') && (
            <div 
              onClick={() => navigate('/assessments')}
              className="pa-card p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <ClipboardList size={24} className="text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Assessments</h3>
              <p className="text-center text-gray-600">Create and manage project assessments</p>
            </div>
          )}
          
          {isUserRole('BA') && (
            <div 
              onClick={() => navigate('/ba-management')}
              className="pa-card p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <UserCheck size={24} className="text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">My Assessments</h3>
              <p className="text-center text-gray-600">View and complete your assigned assessments</p>
            </div>
          )}
          
          {isUserRole('Developer') && (
            <div 
              onClick={() => navigate('/developer-tasks')}
              className="pa-card p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
            >
              <div className="w-16 h-16 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <Code size={24} className="text-purple-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">My Tasks</h3>
              <p className="text-center text-gray-600">Manage your development tasks</p>
            </div>
          )}
          
          <div 
            onClick={() => navigate('/dashboard')}
            className="pa-card p-6 flex flex-col items-center cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center mb-4">
              <BarChart4 size={24} className="text-orange-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Dashboard</h3>
            <p className="text-center text-gray-600">View project status and metrics</p>
          </div>
        </div>
        
        <div className="mt-8 pa-card p-6">
          <h2 className="text-xl font-semibold mb-4">Quick Guide</h2>
          
          {isUserRole('Project Manager') && (
            <div>
              <h3 className="font-medium mb-2">Project Manager Actions:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create new project assessments</li>
                <li>Assign assessments to Business Analysts</li>
                <li>Track project progress on the dashboard</li>
                <li>Review and approve requirements</li>
              </ul>
            </div>
          )}
          
          {isUserRole('BA') && (
            <div>
              <h3 className="font-medium mb-2">Business Analyst Actions:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Review assigned assessments</li>
                <li>Create and document requirements</li>
                <li>Upload Business Requirements Documents (BRDs)</li>
                <li>Track assessment progress</li>
              </ul>
            </div>
          )}
          
          {isUserRole('Developer') && (
            <div>
              <h3 className="font-medium mb-2">Developer Actions:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>Create Solution Design Documents (SDDs)</li>
                <li>Break down requirements into development tasks</li>
                <li>Update task status through the development lifecycle</li>
                <li>Mark tasks ready for UAT and Production</li>
              </ul>
            </div>
          )}
          
          {isUserRole('Stakeholder') && (
            <div>
              <h3 className="font-medium mb-2">Stakeholder Actions:</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li>View project status on the dashboard</li>
                <li>Monitor progress of assessments and tasks</li>
                <li>Access project documentation</li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </NotificationProvider>
  );
};