import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FileText, ArrowRight, ExternalLink } from 'lucide-react';
import { useDataStore } from '../stores/dataStore';
import { useAuthStore } from '../stores/authStore';
import { Requirement, AnalysisStatus } from '../types/dataModel';
import { StatusBadge } from '../components/ui/StatusBadge';
import { CommandBar, CommandButton } from '../components/ui/CommandBar';
import { NotificationProvider, useNotification } from '../components/ui/Notification';
import { findUserById } from '../mockData/users';

export const BAManagementScreen: React.FC = () => {
  const { currentUser } = useAuthStore();
  const { 
    assessments, 
    requirements, 
    addRequirement, 
    updateRequirement,
    getAssessmentById
  } = useDataStore();
  const { notify } = useNotification();
  
  // Selected state
  const [selectedAssessment, setSelectedAssessment] = useState<string | null>(null);
  const [showRequirementForm, setShowRequirementForm] = useState(false);
  const [showRequirementDetail, setShowRequirementDetail] = useState<string | null>(null);
  
  // Form state
  const [requirementForm, setRequirementForm] = useState<Partial<Requirement>>({
    title: '',
    description: '',
    brdLink: '',
    productAnalysisStatus: 'Not Started',
    dueDate: new Date(
      new Date().setDate(new Date().getDate() + 7)
    ).toISOString().split('T')[0],
  });
  
  // Filter assessments assigned to current BA
  const myAssessments = assessments.filter(
    assessment => assessment.assignedToBA === currentUser?.id
  );
  
  // Get requirements for selected assessment
  const assessmentRequirements = selectedAssessment ? 
    requirements.filter(req => req.assessmentId === selectedAssessment) : [];
  
  // Get selected requirement
  const selectedRequirement = showRequirementDetail ? 
    requirements.find(req => req.id === showRequirementDetail) : null;
  
  const handleSelectAssessment = (assessmentId: string) => {
    setSelectedAssessment(assessmentId);
    setShowRequirementForm(false);
    setShowRequirementDetail(null);
  };
  
  const handleCreateRequirement = () => {
    setShowRequirementForm(true);
    setShowRequirementDetail(null);
    setRequirementForm({
      title: '',
      description: '',
      brdLink: '',
      productAnalysisStatus: 'Not Started',
      dueDate: new Date(
        new Date().setDate(new Date().getDate() + 7)
      ).toISOString().split('T')[0],
    });
  };
  
  const handleRequirementSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedAssessment || !currentUser) {
      notify('Unable to create requirement. Please select an assessment.', 'error');
      return;
    }
    
    if (!requirementForm.title?.trim()) {
      notify('Please enter a title for the requirement', 'error');
      return;
    }
    
    if (!requirementForm.description?.trim()) {
      notify('Please enter a description for the requirement', 'error');
      return;
    }
    
    // Create new requirement
    addRequirement({
      ...requirementForm as Omit<Requirement, 'id' | 'createdDate'>,
      assessmentId: selectedAssessment,
      assignedToBA: currentUser.id
    });
    
    // Update assessment status if needed
    const assessment = getAssessmentById(selectedAssessment);
    if (assessment && assessment.status === 'Assigned') {
      updateAssessment(selectedAssessment, { status: 'In Progress' });
    }
    
    notify('Requirement created successfully', 'success');
    setShowRequirementForm(false);
    
    function updateAssessment(id: string, { status }: { status: string; }) {
      // Find the assessment in the local store and update it
      const assessment = getAssessmentById(id);
      if (assessment) {
        useDataStore.getState().updateAssessment(id, { status: status as any });
      }
    }
  };
  
  const handleViewRequirement = (requirementId: string) => {
    setShowRequirementDetail(requirementId);
    setShowRequirementForm(false);
  };
  
  const handleUpdateRequirementStatus = (
    requirementId: string, 
    status: AnalysisStatus
  ) => {
    updateRequirement(requirementId, { productAnalysisStatus: status });
    
    // If marking as completed and this was the last requirement, update assessment
    if (status === 'Completed' && selectedAssessment) {
      const allRequirements = requirements.filter(
        req => req.assessmentId === selectedAssessment
      );
      
      const allCompleted = allRequirements.every(
        req => req.id === requirementId 
          ? status === 'Completed' 
          : req.productAnalysisStatus === 'Completed'
      );
      
      if (allCompleted) {
        updateAssessment(selectedAssessment, { status: 'Completed' });
        notify('All requirements completed. Assessment marked as Completed.', 'success');
      } else {
        notify('Requirement status updated successfully', 'success');
      }
    } else {
      notify('Requirement status updated successfully', 'success');
    }
    
    function updateAssessment(id: string, { status }: { status: string; }) {
      // Find the assessment in the local store and update it
      const assessment = getAssessmentById(id);
      if (assessment) {
        useDataStore.getState().updateAssessment(id, { status: status as any });
      }
    }
  };
  
  return (
    <NotificationProvider>
      <div className="pa-container">
        <h1 className="text-2xl font-semibold mb-6">My Assessments</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Left panel - Assessments List */}
          <div className="pa-card p-4">
            <h2 className="text-lg font-medium mb-4">Assigned Assessments</h2>
            
            {myAssessments.length > 0 ? (
              <div className="space-y-3">
                {myAssessments.map(assessment => (
                  <div 
                    key={assessment.id}
                    onClick={() => handleSelectAssessment(assessment.id)}
                    className={`p-3 rounded-md cursor-pointer flex justify-between items-center ${
                      selectedAssessment === assessment.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <div>
                      <h3 className="font-medium">{assessment.title}</h3>
                      <div className="mt-1 flex items-center">
                        <StatusBadge status={assessment.status} type="assessment" />
                        <span className="ml-2 text-sm text-gray-500">
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    <ArrowRight 
                      size={16} 
                      className={selectedAssessment === assessment.id ? 'text-blue-500' : 'text-gray-400'} 
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                You have no assessments assigned to you.
              </p>
            )}
          </div>
          
          {/* Middle panel - Requirements for selected assessment */}
          <div className="pa-card p-4">
            {selectedAssessment ? (
              <>
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Requirements</h2>
                  <CommandButton 
                    icon={<Plus size={16} />}
                    label="Add Requirement"
                    onClick={handleCreateRequirement}
                    primary
                  />
                </div>
                
                {assessmentRequirements.length > 0 ? (
                  <div className="space-y-3">
                    {assessmentRequirements.map(requirement => (
                      <div 
                        key={requirement.id}
                        onClick={() => handleViewRequirement(requirement.id)}
                        className={`p-3 rounded-md cursor-pointer border ${
                          showRequirementDetail === requirement.id 
                            ? 'bg-blue-50 border-blue-200' 
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between">
                          <h3 className="font-medium">{requirement.title}</h3>
                          <StatusBadge 
                            status={requirement.productAnalysisStatus} 
                            type="analysis" 
                          />
                        </div>
                        <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                          {requirement.description}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    {showRequirementForm ? (
                      <p className="text-gray-500">
                        Create your first requirement for this assessment.
                      </p>
                    ) : (
                      <div>
                        <p className="text-gray-500 mb-4">
                          No requirements found for this assessment.
                        </p>
                        <button
                          onClick={handleCreateRequirement}
                          className="pa-button pa-button-primary"
                        >
                          Create First Requirement
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  Select an assessment to view or create requirements.
                </p>
              </div>
            )}
          </div>
          
          {/* Right panel - Requirement details or form */}
          <div className="pa-card p-4">
            {showRequirementForm ? (
              <>
                <h2 className="text-lg font-medium mb-4">New Requirement</h2>
                
                <form onSubmit={handleRequirementSubmit}>
                  <div className="pa-form-group">
                    <label className="pa-label" htmlFor="title">Title</label>
                    <input
                      type="text"
                      id="title"
                      value={requirementForm.title || ''}
                      onChange={e => setRequirementForm({...requirementForm, title: e.target.value})}
                      className="pa-input"
                      placeholder="Enter requirement title"
                    />
                  </div>
                  
                  <div className="pa-form-group">
                    <label className="pa-label" htmlFor="description">Description</label>
                    <textarea
                      id="description"
                      value={requirementForm.description || ''}
                      onChange={e => setRequirementForm({...requirementForm, description: e.target.value})}
                      className="pa-input h-24"
                      placeholder="Enter requirement description"
                    />
                  </div>
                  
                  <div className="pa-form-group">
                    <label className="pa-label" htmlFor="brdLink">BRD Document Link</label>
                    <input
                      type="url"
                      id="brdLink"
                      value={requirementForm.brdLink || ''}
                      onChange={e => setRequirementForm({...requirementForm, brdLink: e.target.value})}
                      className="pa-input"
                      placeholder="https://sharepoint.example.com/document.docx"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Enter a link to the Business Requirements Document
                    </p>
                  </div>
                  
                  <div className="pa-form-group">
                    <label className="pa-label" htmlFor="status">Status</label>
                    <select
                      id="status"
                      value={requirementForm.productAnalysisStatus || 'Not Started'}
                      onChange={e => setRequirementForm({
                        ...requirementForm, 
                        productAnalysisStatus: e.target.value as AnalysisStatus
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
                      value={requirementForm.dueDate ? requirementForm.dueDate.split('T')[0] : ''}
                      onChange={e => setRequirementForm({...requirementForm, dueDate: e.target.value})}
                      className="pa-input"
                    />
                  </div>
                  
                  <div className="flex justify-end mt-6 space-x-4">
                    <button
                      type="button"
                      onClick={() => setShowRequirementForm(false)}
                      className="pa-button pa-button-secondary"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="pa-button pa-button-primary"
                    >
                      Create Requirement
                    </button>
                  </div>
                </form>
              </>
            ) : selectedRequirement ? (
              <div>
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-lg font-medium">{selectedRequirement.title}</h2>
                  <StatusBadge 
                    status={selectedRequirement.productAnalysisStatus} 
                    type="analysis" 
                  />
                </div>
                
                <p className="text-gray-700 mb-6">
                  {selectedRequirement.description}
                </p>
                
                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-500">Due Date</p>
                    <p>{new Date(selectedRequirement.dueDate).toLocaleDateString()}</p>
                  </div>
                  
                  <div>
                    <p className="text-sm text-gray-500">Created Date</p>
                    <p>{new Date(selectedRequirement.createdDate).toLocaleDateString()}</p>
                  </div>
                  
                  {selectedRequirement.brdLink && (
                    <div>
                      <p className="text-sm text-gray-500">BRD Document</p>
                      <a 
                        href={selectedRequirement.brdLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center"
                      >
                        <FileText size={16} className="mr-1" />
                        View Document
                        <ExternalLink size={14} className="ml-1" />
                      </a>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <p className="text-sm font-medium mb-2">Update Status</p>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdateRequirementStatus(
                        selectedRequirement.id, 
                        'Not Started'
                      )}
                      className={`px-3 py-1 text-sm rounded-md ${
                        selectedRequirement.productAnalysisStatus === 'Not Started'
                          ? 'bg-gray-200 text-gray-800'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      Not Started
                    </button>
                    <button
                      onClick={() => handleUpdateRequirementStatus(
                        selectedRequirement.id, 
                        'In Progress'
                      )}
                      className={`px-3 py-1 text-sm rounded-md ${
                        selectedRequirement.productAnalysisStatus === 'In Progress'
                          ? 'bg-yellow-200 text-yellow-800'
                          : 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200'
                      }`}
                    >
                      In Progress
                    </button>
                    <button
                      onClick={() => handleUpdateRequirementStatus(
                        selectedRequirement.id, 
                        'Completed'
                      )}
                      className={`px-3 py-1 text-sm rounded-md ${
                        selectedRequirement.productAnalysisStatus === 'Completed'
                          ? 'bg-green-200 text-green-800'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      Completed
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  {selectedAssessment 
                    ? 'Select or create a requirement to view details'
                    : 'Select an assessment first'
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