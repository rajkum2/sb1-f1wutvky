// Type definitions for Power Apps data model

export type Role = 'Project Manager' | 'BA' | 'Developer' | 'Stakeholder';
export type AssessmentStatus = 'New' | 'Assigned' | 'In Progress' | 'Completed';
export type Priority = 'High' | 'Medium' | 'Low';
export type AnalysisStatus = 'Not Started' | 'In Progress' | 'Completed';
export type SDDStatus = 'Not Started' | 'In Progress' | 'Completed';
export type TaskStatus = 
  'Not Started' | 
  'In Progress' | 
  'Code Review' | 
  'Ready for UAT' | 
  'In UAT' | 
  'Ready for Prod' | 
  'In Prod';
export type UATStatus = 'Not Started' | 'In Progress' | 'Passed' | 'Failed';
export type ProdStatus = 'Not Started' | 'Deployed';

export interface User {
  id: string;
  role: Role;
  email: string;
  name: string;
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  status: AssessmentStatus;
  assignedToBA: string; // Reference to User.id
  createdBy: string; // Reference to User.id
  createdDate: string; // ISO date string
  priority: Priority;
  dueDate: string; // ISO date string
}

export interface Requirement {
  id: string;
  assessmentId: string; // Reference to Assessment.id
  title: string;
  description: string;
  brdLink: string; // URL
  productAnalysisStatus: AnalysisStatus;
  assignedToBA: string; // Reference to User.id
  createdDate: string; // ISO date string
  dueDate: string; // ISO date string
}

export interface SolutionDesignDocument {
  id: string;
  requirementId: string; // Reference to Requirement.id
  title: string;
  link: string; // URL
  status: SDDStatus;
  assignedToDeveloper: string; // Reference to User.id
  createdDate: string; // ISO date string
  dueDate: string; // ISO date string
}

export interface DevelopmentTask {
  id: string;
  sddId: string; // Reference to SolutionDesignDocument.id
  title: string;
  description: string;
  status: TaskStatus;
  assignedToDeveloper: string; // Reference to User.id
  createdDate: string; // ISO date string
  dueDate: string; // ISO date string
  uatStatus: UATStatus;
  prodStatus: ProdStatus;
}