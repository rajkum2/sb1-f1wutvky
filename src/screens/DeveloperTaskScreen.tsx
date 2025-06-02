import React, { useState } from 'react';
import { ExternalLink, Plus, FileText, Check, Clock } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { 
  TaskStatus, 
  UATStatus, 
  ProdStatus, 
  SolutionDesignDocument,
  DevelopmentTask
} from '../types/dataModel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CommandBar, CommandButton } from '../components/ui/CommandBar';
import { NotificationProvider, useNotification } from '../components/ui/Notification';
import { findUserById } from '../mockData/users';

export const DeveloperTaskScreen: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { 
    sdds, 
    tasks, 
    getCompletedRequirements, 
    getRequirementById,
    getSDDsByRequirement,
    addSDD,
    addTask,
    updateTask
  } = useDataStore();
  const { notify } = useNotification();
  
  // State for selected items
  const [selectedRequirement, setSelectedRequirement] = useState<string | null>(null);
  const [selectedSDD, setSelectedSDD] = useState<string | null>(null);
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  
  // Form visibility state
  const [showSDDForm, setShowSDDForm] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  
  // Form data state
  const [sddForm, setSDDForm] = useState<Partial<SolutionDesignDocument>>({
    title: '',
    link: '',
    status: 'Not Started',
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 7)
    ).toISOString().split('T')[0],
  });
  
  const [taskForm, setTaskForm] = useState<Partial<DevelopmentTask>>({
    title: '',
    description: '',
    status: 'Not Started',
    uatStatus: 'Not Started',
    prodStatus: 'Not Started',
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 7)
    ).toISOString().split('T')[0],
  });
  
  // Get completed requirements
  const completedRequirements = getCompletedRequirements();
  
  // Get SDDs for selected requirement
  const requirementSDDs = selectedRequirement ? 
    getSDDsByRequirement(selectedRequirement) : [];
  
  // Get selected SDD
  const sdd = selectedSDD ? 
    sdds.find(s => s.id === selectedSDD) : null;
  
  // Get tasks for selected SDD
  const sddTasks = selectedSDD ? 
    tasks.filter(t => t.sddId === selectedSDD) : [];
  
  // Get selected task
  const task = selectedTask ? 
    tasks.find(t => t.id === selectedTask) : null;
  
  // Select a requirement
  const handleSelectRequirement = (reqId: string) => {
    setSelectedRequirement(reqId);
    setSelectedSDD(null);
    setSelectedTask(null);
    setShowSDDForm(false);
    setShowTaskForm(false);
  };
  
  // Select an SDD
  const handleSelectSDD = (sddId: string) => {
    setSelectedSDD(sddId);
    setSelectedTask(null);
    setShowTaskForm(false);
  };
  
  // Create a new SDD
  const handleCreateSDD = () => {
    setShowSDDForm(true);
    setShowTaskForm(false);
    setSDDForm({
      title: '',
      link: '',
      status: 'Not Started',
      dueDate: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toISOString().split('T')[0],
    });
  };
  
  // Submit SDD form
  const handleSDDSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedRequirement || !currentUser) {
      notify('Unable to create SDD. Please select a requirement.', 'error');
      return;
    }
    
    if (!sddForm.title?.trim()) {
      notify('Please enter a title for the SDD', 'error');
      return;
    }
    
    // Create new SDD
    const newSddId = addSDD({
      ...sddForm as Omit<SolutionDesignDocument, 'id' | 'createdDate'>,
      requirementId: selectedRequirement,
      assignedToDeveloper: currentUser.id
    });
    
    notify('Solution Design Document created successfully', 'success');
    setShowSDDForm(false);
    setSelectedSDD(newSddId);
  };
  
  // Create a new task
  const handleCreateTask = () => {
    setShowTaskForm(true);
    setTaskForm({
      title: '',
      description: '',
      status: 'Not Started',
      uatStatus: 'Not Started',
      prodStatus: 'Not Started',
      dueDate: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toISOString().split('T')[0],
    });
  };
  
  // Submit task form
  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSDD || !currentUser) {
      notify('Unable to create task. Please select an SDD.', 'error');
      return;
    }
    
    if (!taskForm.title?.trim()) {
      notify('Please enter a title for the task', 'error');
      return;
    }
    
    if (!taskForm.description?.trim()) {
      notify('Please enter a description for the task', 'error');
      return;
    }
    
    // Create new task
    const newTaskId = addTask({
      ...taskForm as Omit<DevelopmentTask, 'id' | 'createdDate'>,
      sddId: selectedSDD,
      assignedToDeveloper: currentUser.id
    });
    
    notify('Development task created successfully', 'success');
    setShowTaskForm(false);
    setSelectedTask(newTaskId);
  };
  
  // Select a task
  const handleSelectTask = (taskId: string) => {
    setSelectedTask(taskId);
    setShowTaskForm(false);
  };
  
  // Update task status
  const handleUpdateTaskStatus = (
    taskId: string, 
    status: TaskStatus,
    uatStatus?: UATStatus,
    prodStatus?: ProdStatus
  ) => {
    const updates: Partial<DevelopmentTask> = { status };
    
    if (uatStatus) updates.uatStatus = uatStatus;
    if (prodStatus) updates.prodStatus = prodStatus;
    
    updateTask(taskId, updates);
    notify('Task status updated successfully', 'success');
  };
  
  return (
    <NotificationProvider>
      <div className="pa-container">
        <h1 className="text-2xl font-semibold mb-6">Developer Tasks</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* First column - Requirements */}
          <div className="pa-card p-4">
            <h2 className="text-lg font-medium mb-4">Completed Requirements</h2>
            
            {completedRequirements.length > 0 ? (
              <div className="space-y-3">
                {completedRequirements.map(req => {
                  const isSelected = selectedRequirement === req.id;
                  
                  return (
                    <div 
                      key={req.id}
                      onClick={() => handleSelectRequirement(req.id)}
                      className={`p-3 rounded-md cursor-pointer border ${
                        isSelected 
                          ? 'bg-blue-50 border-blue-200' 
                          : 'border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <h3 className="font-medium">{req.title}</h3>
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                        {req.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                No completed requirements available for development.
              </p>
            )}
          </div>
          
          {/* Second column - Solution Design Documents */}
          <div className="pa-card p-4">
            {selectedRequirement ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Solution Design Documents</h2>
                  <CommandButton 
                    icon={<Plus size={16} />}
                    label="New SDD"
                    onClick={handleCreateSDD}
                    primary
                  />
                </div>
                
                {requirementSDDs.length > 0 ? (
                  <div className="space-y-3">
                    {requirementSDDs.map(sdd => {
                      const isSelected = selectedSDD === sdd.id;
                      
                      return (
                        <div 
                          key={sdd.id}
                          onClick={() => handleSelectSDD(sdd.id)}
                          className={`p-3 rounded-md cursor-pointer border ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{sdd.title}</h3>
                            <StatusBadge 
                              status={sdd.status} 
                              type="sdd" 
                            />
                          </div>
                          
                          {sdd.link && (
                            <a 
                              href={sdd.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-blue-600 hover:underline flex items-center text-sm mt-1"
                            >
                              <FileText size={14} className="mr-1" />
                              View Document
                              <ExternalLink size={12} className="ml-1" />
                            </a>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {showSDDForm ? (
                      <p className="text-gray-500">
                        Create your first SDD for this requirement.
                      </p>
                    ) : (
                      <div>
                        <p className="text-gray-500 mb-4">
                          No SDDs found for this requirement.
                        </p>
                        <button
                          onClick={handleCreateSDD}
                          className="pa-button pa-button-primary"
                        >
                          Create First SDD
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* SDD Form */}
                {showSDDForm && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-medium mb-3">New Solution Design Document</h3>
                    
                    <form onSubmit={handleSDDSubmit}>
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="title">Title</label>
                        <input
                          type="text"
                          id="title"
                          value={sddForm.title || ''}
                          onChange={e => setSDDForm({...sddForm, title: e.target.value})}
                          className="pa-input"
                          placeholder="Enter SDD title"
                        />
                      </div>
                      
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="link">Document Link</label>
                        <input
                          type="url"
                          id="link"
                          value={sddForm.link || ''}
                          onChange={e => setSDDForm({...sddForm, link: e.target.value})}
                          className="pa-input"
                          placeholder="https://sharepoint.example.com/document.docx"
                        />
                      </div>
                      
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="status">Status</label>
                        <select
                          id="status"
                          value={sddForm.status || 'Not Started'}
                          onChange={e => setSDDForm({
                            ...sddForm, 
                            status: e.target.value as any
                          })}
                          className="pa-select"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Completed">Completed</option>
                        </select>
                      </div>
                      
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="dueDate">Due Date</label>
                        <input
                          type="date"
                          id="dueDate"
                          value={sddForm.dueDate ? sddForm.dueDate.split('T')[0] : ''}
                          onChange={e => setSDDForm({...sddForm, dueDate: e.target.value})}
                          className="pa-input"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowSDDForm(false)}
                          className="pa-button pa-button-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="pa-button pa-button-primary"
                        >
                          Create SDD
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Select a requirement to view or create SDDs.
                </p>
              </div>
            )}
          </div>
          
          {/* Third column - Tasks */}
          <div className="pa-card p-4">
            {selectedSDD ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Development Tasks</h2>
                  <CommandButton 
                    icon={<Plus size={16} />}
                    label="New Task"
                    onClick={handleCreateTask}
                    primary
                  />
                </div>
                
                {sddTasks.length > 0 ? (
                  <div className="space-y-3">
                    {sddTasks.map(task => {
                      const isSelected = selectedTask === task.id;
                      
                      return (
                        <div 
                          key={task.id}
                          onClick={() => handleSelectTask(task.id)}
                          className={`p-3 rounded-md cursor-pointer border ${
                            isSelected 
                              ? 'bg-blue-50 border-blue-200' 
                              : 'border-gray-200 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex justify-between">
                            <h3 className="font-medium">{task.title}</h3>
                            <StatusBadge 
                              status={task.status} 
                              type="task" 
                            />
                          </div>
                          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                            {task.description}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {showTaskForm ? (
                      <p className="text-gray-500">
                        Create your first task for this SDD.
                      </p>
                    ) : (
                      <div>
                        <p className="text-gray-500 mb-4">
                          No tasks found for this SDD.
                        </p>
                        <button
                          onClick={handleCreateTask}
                          className="pa-button pa-button-primary"
                        >
                          Create First Task
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Task Form */}
                {showTaskForm && (
                  <div className="mt-4 border-t pt-4">
                    <h3 className="font-medium mb-3">New Development Task</h3>
                    
                    <form onSubmit={handleTaskSubmit}>
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="title">Title</label>
                        <input
                          type="text"
                          id="title"
                          value={taskForm.title || ''}
                          onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                          className="pa-input"
                          placeholder="Enter task title"
                        />
                      </div>
                      
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="description">Description</label>
                        <textarea
                          id="description"
                          value={taskForm.description || ''}
                          onChange={e => setTaskForm({...taskForm, description: e.target.value})}
                          className="pa-input h-20"
                          placeholder="Enter task description"
                        />
                      </div>
                      
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="status">Status</label>
                        <select
                          id="status"
                          value={taskForm.status || 'Not Started'}
                          onChange={e => setTaskForm({
                            ...taskForm, 
                            status: e.target.value as any
                          })}
                          className="pa-select"
                        >
                          <option value="Not Started">Not Started</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Code Review">Code Review</option>
                          <option value="Ready for UAT">Ready for UAT</option>
                        </select>
                      </div>
                      
                      <div className="pa-form-group">
                        <label className="pa-label" htmlFor="dueDate">Due Date</label>
                        <input
                          type="date"
                          id="dueDate"
                          value={taskForm.dueDate ? taskForm.dueDate.split('T')[0] : ''}
                          onChange={e => setTaskForm({...taskForm, dueDate: e.target.value})}
                          className="pa-input"
                        />
                      </div>
                      
                      <div className="flex justify-end space-x-2 mt-4">
                        <button
                          type="button"
                          onClick={() => setShowTaskForm(false)}
                          className="pa-button pa-button-secondary"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="pa-button pa-button-primary"
                        >
                          Create Task
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Select an SDD to view or create tasks.
                </p>
              </div>
            )}
          </div>
          
          {/* Fourth column - Task Details */}
          <div className="pa-card p-4">
            {task ? (
              <div>
                <h2 className="text-lg font-medium mb-2">{task.title}</h2>
                <StatusBadge status={task.status} type="task" />
                
                <p className="mt-4 text-gray-700">
                  {task.description}
                </p>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <p className="text-sm text-gray-500">Developer</p>
                    <p>{findUserById(task.assignedToDeveloper)?.name || 'Unassigned'}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p>{new Date(task.dueDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">UAT Status</p>
                    <StatusBadge status={task.uatStatus} type="uat" />
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Production Status</p>
                    <StatusBadge status={task.prodStatus} type="prod" />
                  </div>
                </div>
                
                <div className="mt-6 border-t pt-4">
                  <h3 className="font-medium mb-2">Update Task Status</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-2">Development Status</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, 'Not Started')}
                          className={`px-2 py-1 text-xs rounded ${
                            task.status === 'Not Started' ? 'bg-gray-200' : 'bg-gray-100 hover:bg-gray-200'
                          }`}
                        >
                          Not Started
                        </button>
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, 'In Progress')}
                          className={`px-2 py-1 text-xs rounded ${
                            task.status === 'In Progress' ? 'bg-yellow-200' : 'bg-yellow-100 hover:bg-yellow-200'
                          }`}
                        >
                          In Progress
                        </button>
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, 'Code Review')}
                          className={`px-2 py-1 text-xs rounded ${
                            task.status === 'Code Review' ? 'bg-purple-200' : 'bg-purple-100 hover:bg-purple-200'
                          }`}
                        >
                          Code Review
                        </button>
                        <button
                          onClick={() => handleUpdateTaskStatus(task.id, 'Ready for UAT')}
                          className={`px-2 py-1 text-xs rounded ${
                            task.status === 'Ready for UAT' ? 'bg-blue-200' : 'bg-blue-100 hover:bg-blue-200'
                          }`}
                        >
                          Ready for UAT
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">UAT Status</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdateTaskStatus(
                            task.id, 
                            task.status === 'Ready for UAT' ? 'In UAT' : task.status,
                            'In Progress'
                          )}
                          className={`px-2 py-1 text-xs rounded flex items-center ${
                            task.uatStatus === 'In Progress' ? 'bg-indigo-200' : 'bg-indigo-100 hover:bg-indigo-200'
                          }`}
                          disabled={!['Ready for UAT', 'In UAT'].includes(task.status)}
                        >
                          <Clock size={12} className="mr-1" />
                          In Progress
                        </button>
                        <button
                          onClick={() => handleUpdateTaskStatus(
                            task.id, 
                            'Ready for Prod',
                            'Passed'
                          )}
                          className={`px-2 py-1 text-xs rounded flex items-center ${
                            task.uatStatus === 'Passed' ? 'bg-green-200' : 'bg-green-100 hover:bg-green-200'
                          }`}
                          disabled={!['In UAT'].includes(task.status)}
                        >
                          <Check size={12} className="mr-1" />
                          Passed
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-2">Production Status</p>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => handleUpdateTaskStatus(
                            task.id, 
                            'In Prod',
                            undefined,
                            'Deployed'
                          )}
                          className={`px-2 py-1 text-xs rounded ${
                            task.prodStatus === 'Deployed' ? 'bg-pink-200' : 'bg-pink-100 hover:bg-pink-200'
                          }`}
                          disabled={task.status !== 'Ready for Prod'}
                        >
                          Mark as Deployed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {selectedSDD 
                    ? 'Select a task to view details and update status'
                    : selectedRequirement
                      ? 'Select an SDD first'
                      : 'Select a requirement first'
                  }
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </NotificationProvider>
  );
};