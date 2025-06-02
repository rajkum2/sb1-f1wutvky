import React from 'react';
import { 
  AssessmentStatus, 
  AnalysisStatus, 
  SDDStatus, 
  TaskStatus, 
  UATStatus, 
  ProdStatus 
} from '../../types/dataModel';

type StatusType = 
  | AssessmentStatus 
  | AnalysisStatus 
  | SDDStatus 
  | TaskStatus 
  | UATStatus 
  | ProdStatus;

interface StatusBadgeProps {
  status: StatusType;
  type?: 'assessment' | 'analysis' | 'sdd' | 'task' | 'uat' | 'prod';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  status, 
  type = 'task' 
}) => {
  // Define classes based on status
  let className = 'pa-status ';
  
  switch (status) {
    // New/Not Started statuses
    case 'New':
    case 'Not Started':
      className += 'bg-gray-100 text-gray-800';
      break;
      
    // In progress statuses
    case 'In Progress':
    case 'Assigned':
      className += 'bg-yellow-100 text-yellow-800';
      break;
      
    // Review statuses
    case 'Code Review':
      className += 'bg-purple-100 text-purple-800';
      break;
      
    // Ready statuses
    case 'Ready for UAT':
    case 'Ready for Prod':
      className += 'bg-blue-100 text-blue-800';
      break;
      
    // Testing statuses
    case 'In UAT':
      className += 'bg-indigo-100 text-indigo-800';
      break;
      
    // Deployment statuses
    case 'In Prod':
    case 'Deployed':
      className += 'bg-pink-100 text-pink-800';
      break;
      
    // Completion statuses
    case 'Completed':
    case 'Passed':
      className += 'bg-green-100 text-green-800';
      break;
      
    // Failure statuses
    case 'Failed':
      className += 'bg-red-100 text-red-800';
      break;
      
    // Default
    default:
      className += 'bg-gray-100 text-gray-800';
  }
  
  return (
    <span className={className}>
      {status}
    </span>
  );
};