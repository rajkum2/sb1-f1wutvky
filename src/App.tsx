import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PowerAppsLayout } from './components/layout/PowerAppsLayout';
import { HomeScreen } from './screens/HomeScreen';
import { AssessmentScreen } from './screens/AssessmentScreen';
import { BAManagementScreen } from './screens/BAManagementScreen';
import { DeveloperTaskScreen } from './screens/DeveloperTaskScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { useAuthStore } from './stores/authStore';

function App() {
  // Auto-login for demo purposes - in a real app, this would be replaced with actual auth
  const { currentUser, login } = useAuthStore();

  React.useEffect(() => {
    if (!currentUser) {
      // Default to Project Manager for demo
      login('PM001');
    }
  }, [currentUser, login]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--power-apps-background)]">
        <div className="pa-card p-8 max-w-md w-full">
          <h1 className="text-2xl font-semibold text-center mb-6">
            Project Tracker Loading...
          </h1>
          <div className="animate-pulse flex justify-center">
            <div className="h-8 w-8 bg-[var(--power-apps-primary)] rounded-full"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <PowerAppsLayout>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/assessments/*" element={<AssessmentScreen />} />
        <Route path="/ba-management" element={<BAManagementScreen />} />
        <Route path="/developer-tasks" element={<DeveloperTaskScreen />} />
        <Route path="/dashboard" element={<DashboardScreen />} />
        <Route path="*" element={<Navigate to="/\" replace />} />
      </Routes>
    </PowerAppsLayout>
  );
}

export default App;