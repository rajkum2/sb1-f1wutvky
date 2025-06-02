import { v4 as uuidv4 } from 'uuid';
import { 
  Assessment, 
  Requirement, 
  SolutionDesignDocument, 
  DevelopmentTask 
} from '../types/dataModel';

// Generate realistic dates within a range
const getRandomDate = (start: Date, end: Date): string => {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();
};

// Today and dates for relative calculations
const today = new Date();
const oneMonthAgo = new Date(today);
oneMonthAgo.setMonth(today.getMonth() - 1);

const oneMonthFromNow = new Date(today);
oneMonthFromNow.setMonth(today.getMonth() + 1);

// Initial Assessments
export const initialAssessments: Assessment[] = [
  {
    id: uuidv4(),
    title: 'Customer Portal Enhancement',
    description: 'Implement new features to improve customer self-service capabilities',
    status: 'In Progress',
    assignedToBA: 'BA001',
    createdBy: 'PM001',
    createdDate: getRandomDate(oneMonthAgo, today),
    priority: 'High',
    dueDate: getRandomDate(today, oneMonthFromNow)
  },
  {
    id: uuidv4(),
    title: 'Internal Reporting Dashboard',
    description: 'Create a new dashboard for executive reporting on project status',
    status: 'Assigned',
    assignedToBA: 'BA002',
    createdBy: 'PM001',
    createdDate: getRandomDate(oneMonthAgo, today),
    priority: 'Medium',
    dueDate: getRandomDate(today, oneMonthFromNow)
  },
  {
    id: uuidv4(),
    title: 'Mobile App Integration',
    description: 'Assess requirements for integrating with the new mobile application',
    status: 'New',
    assignedToBA: 'BA001',
    createdBy: 'PM001',
    createdDate: getRandomDate(oneMonthAgo, today),
    priority: 'Low',
    dueDate: getRandomDate(today, oneMonthFromNow)
  }
];

// Create a completed assessment to link requirements to
const completedAssessment: Assessment = {
  id: uuidv4(),
  title: 'User Authentication System',
  description: 'Implement secure authentication system with multi-factor capabilities',
  status: 'Completed',
  assignedToBA: 'BA001',
  createdBy: 'PM001',
  createdDate: getRandomDate(oneMonthAgo, today),
  priority: 'High',
  dueDate: getRandomDate(today, oneMonthFromNow)
};

initialAssessments.push(completedAssessment);

// Initial Requirements linked to the completed assessment
export const initialRequirements: Requirement[] = [
  {
    id: uuidv4(),
    assessmentId: completedAssessment.id,
    title: 'Password Reset Functionality',
    description: 'Implement secure password reset with email verification',
    brdLink: 'https://sharepoint.example.com/brd/password-reset.docx',
    productAnalysisStatus: 'Completed',
    assignedToBA: 'BA001',
    createdDate: getRandomDate(oneMonthAgo, today),
    dueDate: getRandomDate(today, oneMonthFromNow)
  },
  {
    id: uuidv4(),
    assessmentId: completedAssessment.id,
    title: 'Multi-factor Authentication',
    description: 'Implement MFA using SMS and authenticator apps',
    brdLink: 'https://sharepoint.example.com/brd/mfa-implementation.docx',
    productAnalysisStatus: 'Completed',
    assignedToBA: 'BA001',
    createdDate: getRandomDate(oneMonthAgo, today),
    dueDate: getRandomDate(today, oneMonthFromNow)
  }
];

// Create SDD for the first requirement
const passwordResetReq = initialRequirements[0];
const passwordResetSDD: SolutionDesignDocument = {
  id: uuidv4(),
  requirementId: passwordResetReq.id,
  title: 'Password Reset System Design',
  link: 'https://sharepoint.example.com/sdd/password-reset-design.docx',
  status: 'Completed',
  assignedToDeveloper: 'DEV001',
  createdDate: getRandomDate(oneMonthAgo, today),
  dueDate: getRandomDate(today, oneMonthFromNow)
};

export const initialSDDs: SolutionDesignDocument[] = [passwordResetSDD];

// Initial Tasks for the SDD
export const initialTasks: DevelopmentTask[] = [
  {
    id: uuidv4(),
    sddId: passwordResetSDD.id,
    title: 'Implement email verification service',
    description: 'Create service to send verification emails for password reset',
    status: 'Ready for UAT',
    assignedToDeveloper: 'DEV001',
    createdDate: getRandomDate(oneMonthAgo, today),
    dueDate: getRandomDate(today, oneMonthFromNow),
    uatStatus: 'In Progress',
    prodStatus: 'Not Started'
  },
  {
    id: uuidv4(),
    sddId: passwordResetSDD.id,
    title: 'Create password reset form UI',
    description: 'Implement responsive UI for password reset process',
    status: 'In Progress',
    assignedToDeveloper: 'DEV001',
    createdDate: getRandomDate(oneMonthAgo, today),
    dueDate: getRandomDate(today, oneMonthFromNow),
    uatStatus: 'Not Started',
    prodStatus: 'Not Started'
  },
  {
    id: uuidv4(),
    sddId: passwordResetSDD.id,
    title: 'Implement password validation logic',
    description: 'Create validation for password strength and security requirements',
    status: 'Code Review',
    assignedToDeveloper: 'DEV002',
    createdDate: getRandomDate(oneMonthAgo, today),
    dueDate: getRandomDate(today, oneMonthFromNow),
    uatStatus: 'Not Started',
    prodStatus: 'Not Started'
  }
];