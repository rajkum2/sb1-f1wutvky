import React, { useState } from 'react';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, ArrowLeft, ChevronRight } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { 
  Assessment, 
  Priority, 
  AssessmentStatus 
} from '../types/dataModel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CommandBar, CommandButton } from '../components/ui/CommandBar';
import { NotificationProvider, useNotification } from '../components/ui/Notification';
import { findUsersByRole, findUserById } from '../mockData/users';

// AssessmentList component
const AssessmentList: React.FC = () => {
  const navigate = useNavigate();
  const { assessments } = useDataStore();
  const { currentUser } = useAuthStore();
  
  // Sort assessments by creation date (newest first)
  const sortedAssessments = [...assessments].sort((a, b) => 
    new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
  );
  
  return (
    <div>
      <CommandBar>
        <CommandButton 
          icon={<Plus size={16} />} 
          label="New Assessment"
          onClick={() => navigate('/assessments/new')}
          primary
        />
      </CommandBar>
      
      <div className="mt-4 pa-card">
        <div className="overflow-x-auto">
          <table className="pa-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Assigned To</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAssessments.map((assessment) => {
                const assignedBA = findUserById(assessment.assignedToBA);
                const dueDate = new Date(assessment.dueDate).toLocaleDateString();
                
                return (
                  <tr key={assessment.id} 
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => navigate(`/assessments/${assessment.id}`)}
                  >
                    <td>{assessment.title}</td>
                    <td><StatusBadge status={assessment.status} type="assessment" /></td>
                    <td>
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        assessment.priority === 'High' 
                          ? 'bg-red-500' 
                          : assessment.priority === 'Medium' 
                            ? 'bg-yellow-500' 
                            : 'bg-blue-500'
                      }`}></span>
                      {assessment.priority}
                    </td>
                    <td>{assignedBA?.name || 'Unassigned'}</td>
                    <td>{dueDate}</td>
                    <td>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/assessments/edit/${assessment.id}`);
                        }}
                        className="text-gray-600 hover:text-blue-600 mr-2"
                      >
                        <Edit size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {assessments.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-4 text-gray-500">
                    No assessments found. Create a new assessment to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// AssessmentForm component for create/edit
const AssessmentForm: React.FC<{
  mode: 'create' | 'edit';
  assessmentId?: string;
}> = ({ mode, assessmentId }) => {
  const navigate = useNavigate();
  const { notify } = useNotification();
  const { currentUser } = useAuthStore();
  const { 
    addAssessment, 
    updateAssessment, 
    getAssessmentById 
  } = useDataStore();
  
  const existingAssessment = 
    mode === 'edit' && assessmentId 
      ? getAssessmentById(assessmentId) 
      : null;
  
  const [formData, setFormData] = useState<Partial<Assessment>>(
    existingAssessment || {
      title: '',
      description: '',
      status: 'New' as AssessmentStatus,
      assignedToBA: '',
      priority: 'Medium' as Priority,
      dueDate: new Date(
        new Date().setDate(new Date().getDate() + 14)
      ).toISOString().split('T')[0],
    }
  );
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const businessAnalysts = findUsersByRole('BA');
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title?.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.assignedToBA) {
      newErrors.assignedToBA = 'Please assign to a Business Analyst';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      notify('Please fix the errors in the form', 'error');
      return;
    }
    
    if (mode === 'create') {
      // Set creator
      const newAssessmentData = {
        ...formData as Omit<Assessment, 'id' | 'createdDate'>,
        createdBy: currentUser?.id || '',
      };
      
      addAssessment(newAssessmentData);
      notify('Assessment created successfully', 'success');
    } else if (mode === 'edit' && assessmentId) {
      updateAssessment(assessmentId, formData);
      notify('Assessment updated successfully', 'success');
    }
    
    navigate('/assessments');
  };
  
  return (
    <div>
      <CommandBar>
        <CommandButton 
          icon={<ArrowLeft size={16} />}
          label="Back to Assessments"
          onClick={() => navigate('/assessments')}
        />
      </CommandBar>
      
      <div className="mt-4 pa-card p-6">
        <h2 className="text-xl font-semibold mb-4">
          {mode === 'create' ? 'Create New Assessment' : 'Edit Assessment'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="pa-form-group">
            <label className="pa-label" htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title || ''}
              onChange={handleChange}
              className={`pa-input ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter assessment title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}
          </div>
          
          <div className="pa-form-group">
            <label className="pa-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              className={`pa-input h-24 ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter assessment description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="pa-form-group">
              <label className="pa-label" htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={formData.priority || 'Medium'}
                onChange={handleChange}
                className="pa-select"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            
            <div className="pa-form-group">
              <label className="pa-label" htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status || 'New'}
                onChange={handleChange}
                className="pa-select"
              >
                <option value="New">New</option>
                <option value="Assigned">Assigned</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
            
            <div className="pa-form-group">
              <label className="pa-label" htmlFor="assignedToBA">Assigned To</label>
              <select
                id="assignedToBA"
                name="assignedToBA"
                value={formData.assignedToBA || ''}
                onChange={handleChange}
                className={`pa-select ${errors.assignedToBA ? 'border-red-500' : ''}`}
              >
                <option value="">Select a Business Analyst</option>
                {businessAnalysts.map(ba => (
                  <option key={ba.id} value={ba.id}>
                    {ba.name}
                  </option>
                ))}
              </select>
              {errors.assignedToBA && (
                <p className="text-red-500 text-sm mt-1">{errors.assignedToBA}</p>
              )}
            </div>
            
            <div className="pa-form-group">
              <label className="pa-label" htmlFor="dueDate">Due Date</label>
              <input
                type="date"
                id="dueDate"
                name="dueDate"
                value={formData.dueDate ? formData.dueDate.split('T')[0] : ''}
                onChange={handleChange}
                className={`pa-input ${errors.dueDate ? 'border-red-500' : ''}`}
              />
              {errors.dueDate && (
                <p className="text-red-500 text-sm mt-1">{errors.dueDate}</p>
              )}
            </div>
          </div>
          
          <div className="flex justify-end mt-6 space-x-4">
            <button
              type="button"
              onClick={() => navigate('/assessments')}
              className="pa-button pa-button-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="pa-button pa-button-primary"
            >
              {mode === 'create' ? 'Create Assessment' : 'Update Assessment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AssessmentDetail component
const AssessmentDetail: React.FC<{ assessmentId: string }> = ({ assessmentId }) => {
  const navigate = useNavigate();
  const { getAssessmentById, getRequirementsByAssessment } = useDataStore();
  
  const assessment = getAssessmentById(assessmentId);
  const requirements = getRequirementsByAssessment(assessmentId);
  
  if (!assessment) {
    return <div>Assessment not found</div>;
  }
  
  const assignedBA = findUserById(assessment.assignedToBA);
  const createdBy = findUserById(assessment.createdBy);
  
  return (
    <div>
      <CommandBar>
        <CommandButton 
          icon={<ArrowLeft size={16} />}
          label="Back to Assessments"
          onClick={() => navigate('/assessments')}
        />
        <CommandButton 
          icon={<Edit size={16} />}
          label="Edit"
          onClick={() => navigate(`/assessments/edit/${assessmentId}`)}
        />
      </CommandBar>
      
      <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <div className="pa-card p-6">
            <h2 className="text-xl font-semibold">{assessment.title}</h2>
            <div className="mt-4">
              <StatusBadge status={assessment.status} type="assessment" />
              <span className="ml-2 inline-flex items-center">
                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                  assessment.priority === 'High' 
                    ? 'bg-red-500' 
                    : assessment.priority === 'Medium' 
                      ? 'bg-yellow-500' 
                      : 'bg-blue-500'
                }`}></span>
                {assessment.priority} Priority
              </span>
            </div>
            
            <div className="mt-4 text-gray-700">
              <p>{assessment.description}</p>
            </div>
          </div>
          
          <div className="pa-card p-6 mt-4">
            <h3 className="text-lg font-semibold mb-4">Requirements</h3>
            
            {requirements.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="pa-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Status</th>
                      <th>Due Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requirements.map(req => (
                      <tr key={req.id}>
                        <td>{req.title}</td>
                        <td>
                          <StatusBadge 
                            status={req.productAnalysisStatus} 
                            type="analysis" 
                          />
                        </td>
                        <td>{new Date(req.dueDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">
                No requirements have been created for this assessment yet.
              </p>
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="pa-card p-6">
            <h3 className="text-lg font-semibold mb-4">Details</h3>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-500">Assigned To</p>
                <p>{assignedBA?.name || 'Unassigned'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Created By</p>
                <p>{createdBy?.name || 'Unknown'}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Created Date</p>
                <p>{new Date(assessment.createdDate).toLocaleDateString()}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Due Date</p>
                <p>{new Date(assessment.dueDate).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main AssessmentScreen component
export const AssessmentScreen: React.FC = () => {
  return (
    <NotificationProvider>
      <div className="pa-container">
        <h1 className="text-2xl font-semibold mb-6">Assessments</h1>
        
        <Routes>
          <Route path="/" element={<AssessmentList />} />
          <Route path="/new" element={<AssessmentForm mode="create" />} />
          <Route path="/edit/:id" element={
            ({ params }: any) => <AssessmentForm mode="edit" assessmentId={params?.id} />
          } />
          <Route path="/:id" element={
            ({ params }: any) => <AssessmentDetail assessmentId={params?.id} />
          } />
        </Routes>
      </div>
    </NotificationProvider>
  );
};