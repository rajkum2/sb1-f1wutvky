import React, { useState } from 'react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Filter, Calendar, RefreshCw } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { findUserById } from '../mockData/users';
import { StatusBadge } from '../components/ui/StatusBadge';

export const DashboardScreen: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { 
    assessments, 
    requirements, 
    sdds, 
    tasks 
  } = useDataStore();
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState<string>('All');
  
  // Calculate stats
  const totalAssessments = assessments.length;
  const completedAssessments = assessments.filter(a => a.status === 'Completed').length;
  const inProgressAssessments = assessments.filter(a => a.status === 'In Progress').length;
  
  const totalTasks = tasks.length;
  const notStartedTasks = tasks.filter(t => t.status === 'Not Started').length;
  const inProgressTasks = tasks.filter(t => t.status === 'In Progress').length;
  const inReviewTasks = tasks.filter(t => t.status === 'Code Review').length;
  const readyForUATTasks = tasks.filter(t => t.status === 'Ready for UAT').length;
  const inUATTasks = tasks.filter(t => t.status === 'In UAT').length;
  const readyForProdTasks = tasks.filter(t => t.status === 'Ready for Prod').length;
  const inProdTasks = tasks.filter(t => t.status === 'In Prod').length;
  
  // Filter tasks based on status
  const filteredTasks = statusFilter === 'All' 
    ? tasks 
    : tasks.filter(t => t.status === statusFilter);
  
  // Data for charts
  const taskStatusData = [
    { name: 'Not Started', value: notStartedTasks, color: '#d1d5db' },
    { name: 'In Progress', value: inProgressTasks, color: '#fbbf24' },
    { name: 'Code Review', value: inReviewTasks, color: '#a78bfa' },
    { name: 'Ready for UAT', value: readyForUATTasks, color: '#60a5fa' },
    { name: 'In UAT', value: inUATTasks, color: '#818cf8' },
    { name: 'Ready for Prod', value: readyForProdTasks, color: '#34d399' },
    { name: 'In Prod', value: inProdTasks, color: '#f472b6' }
  ].filter(item => item.value > 0);
  
  // Data for bar chart - tasks by assignee
  const developers = [...new Set(tasks.map(t => t.assignedToDeveloper))];
  const tasksByDeveloper = developers.map(devId => {
    const dev = findUserById(devId);
    const devTasks = tasks.filter(t => t.assignedToDeveloper === devId);
    
    return {
      name: dev?.name || 'Unknown',
      'Not Started': devTasks.filter(t => t.status === 'Not Started').length,
      'In Progress': devTasks.filter(t => t.status === 'In Progress').length,
      'Code Review': devTasks.filter(t => t.status === 'Code Review').length,
      'Ready for UAT': devTasks.filter(t => t.status === 'Ready for UAT').length,
      'In UAT': devTasks.filter(t => t.status === 'In UAT').length,
      'Ready for Prod': devTasks.filter(t => t.status === 'Ready for Prod').length,
      'In Prod': devTasks.filter(t => t.status === 'In Prod').length,
    };
  });
  
  // Due soon tasks
  const today = new Date();
  const oneWeekFromNow = new Date();
  oneWeekFromNow.setDate(today.getDate() + 7);
  
  const dueSoonTasks = tasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    return dueDate >= today && dueDate <= oneWeekFromNow;
  });
  
  return (
    <div className="pa-container">
      <h1 className="text-2xl font-semibold mb-6">Project Status Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="pa-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Assessments</h3>
            <span className="text-2xl font-semibold">{totalAssessments}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <div className="flex items-center">
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ width: `${(completedAssessments / totalAssessments) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">{completedAssessments}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In Progress</span>
              <div className="flex items-center">
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-yellow-500" 
                    style={{ width: `${(inProgressAssessments / totalAssessments) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">{inProgressAssessments}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pa-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Requirements</h3>
            <span className="text-2xl font-semibold">{requirements.length}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <div className="flex items-center">
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-500" 
                    style={{ 
                      width: `${(requirements.filter(r => r.productAnalysisStatus === 'Completed').length / requirements.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">
                  {requirements.filter(r => r.productAnalysisStatus === 'Completed').length}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pa-card p-6">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-medium">Tasks</h3>
            <span className="text-2xl font-semibold">{totalTasks}</span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm">In UAT</span>
              <div className="flex items-center">
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500" 
                    style={{ width: `${(inUATTasks / totalTasks) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">{inUATTasks}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">In Prod</span>
              <div className="flex items-center">
                <div className="h-2 w-24 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-pink-500" 
                    style={{ width: `${(inProdTasks / totalTasks) * 100}%` }}
                  ></div>
                </div>
                <span className="ml-2 text-sm">{inProdTasks}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Task Status Distribution Chart */}
        <div className="pa-card p-6">
          <h3 className="text-lg font-medium mb-4">Task Status Distribution</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Tasks by Developer Chart */}
        <div className="pa-card p-6">
          <h3 className="text-lg font-medium mb-4">Tasks by Developer</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={tasksByDeveloper}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 60, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                <Bar dataKey="Not Started" stackId="a" fill="#d1d5db" />
                <Bar dataKey="In Progress" stackId="a" fill="#fbbf24" />
                <Bar dataKey="Code Review" stackId="a" fill="#a78bfa" />
                <Bar dataKey="Ready for UAT" stackId="a" fill="#60a5fa" />
                <Bar dataKey="In UAT" stackId="a" fill="#818cf8" />
                <Bar dataKey="Ready for Prod" stackId="a" fill="#34d399" />
                <Bar dataKey="In Prod" stackId="a" fill="#f472b6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        {/* Task List */}
        <div className="pa-card p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Development Tasks</h3>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="pa-select pr-8 py-1 pl-7 text-sm"
                >
                  <option value="All">All Status</option>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Code Review">Code Review</option>
                  <option value="Ready for UAT">Ready for UAT</option>
                  <option value="In UAT">In UAT</option>
                  <option value="Ready for Prod">Ready for Prod</option>
                  <option value="In Prod">In Prod</option>
                </select>
                <Filter size={16} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-500" />
              </div>
              <button
                onClick={() => setStatusFilter('All')}
                className="p-1 rounded-md hover:bg-gray-100"
                title="Reset Filters"
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="pa-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Status</th>
                  <th>Assigned To</th>
                  <th>Due Date</th>
                  <th>UAT</th>
                  <th>Production</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => {
                  const developer = findUserById(task.assignedToDeveloper);
                  const dueDate = new Date(task.dueDate);
                  const isPastDue = dueDate < today && task.status !== 'In Prod';
                  
                  return (
                    <tr key={task.id}>
                      <td>{task.title}</td>
                      <td><StatusBadge status={task.status} type="task" /></td>
                      <td>{developer?.name || 'Unassigned'}</td>
                      <td className={isPastDue ? 'text-red-600 font-medium' : ''}>
                        {dueDate.toLocaleDateString()}
                        {isPastDue && ' (Past Due)'}
                      </td>
                      <td><StatusBadge status={task.uatStatus} type="uat" /></td>
                      <td><StatusBadge status={task.prodStatus} type="prod" /></td>
                    </tr>
                  );
                })}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-4 text-gray-500">
                      No tasks found with the selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Due Soon Tasks */}
        <div className="pa-card p-6">
          <div className="flex items-center mb-4">
            <Calendar size={20} className="text-orange-500 mr-2" />
            <h3 className="text-lg font-medium">Tasks Due Within One Week</h3>
          </div>
          
          {dueSoonTasks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="pa-table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Status</th>
                    <th>Assigned To</th>
                    <th>Due Date</th>
                  </tr>
                </thead>
                <tbody>
                  {dueSoonTasks.map(task => {
                    const developer = findUserById(task.assignedToDeveloper);
                    return (
                      <tr key={task.id}>
                        <td>{task.title}</td>
                        <td><StatusBadge status={task.status} type="task" /></td>
                        <td>{developer?.name || 'Unassigned'}</td>
                        <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500 text-center py-4">
              No tasks due within the next week.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};