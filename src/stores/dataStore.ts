import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import { 
  Assessment, 
  Requirement, 
  SolutionDesignDocument, 
  DevelopmentTask 
} from '../types/dataModel';
import { 
  initialAssessments, 
  initialRequirements, 
  initialSDDs, 
  initialTasks 
} from '../mockData/initialData';

interface DataState {
  assessments: Assessment[];
  requirements: Requirement[];
  sdds: SolutionDesignDocument[];
  tasks: DevelopmentTask[];
  
  // Assessments
  addAssessment: (assessment: Omit<Assessment, 'id' | 'createdDate'>) => string;
  updateAssessment: (id: string, updates: Partial<Assessment>) => void;
  getAssessmentById: (id: string) => Assessment | undefined;
  getAssessmentsByBA: (baId: string) => Assessment[];
  
  // Requirements
  addRequirement: (requirement: Omit<Requirement, 'id' | 'createdDate'>) => string;
  updateRequirement: (id: string, updates: Partial<Requirement>) => void;
  getRequirementById: (id: string) => Requirement | undefined;
  getRequirementsByAssessment: (assessmentId: string) => Requirement[];
  getCompletedRequirements: () => Requirement[];
  
  // Solution Design Documents
  addSDD: (sdd: Omit<SolutionDesignDocument, 'id' | 'createdDate'>) => string;
  updateSDD: (id: string, updates: Partial<SolutionDesignDocument>) => void;
  getSDDById: (id: string) => SolutionDesignDocument | undefined;
  getSDDsByRequirement: (requirementId: string) => SolutionDesignDocument[];
  
  // Development Tasks
  addTask: (task: Omit<DevelopmentTask, 'id' | 'createdDate'>) => string;
  updateTask: (id: string, updates: Partial<DevelopmentTask>) => void;
  getTaskById: (id: string) => DevelopmentTask | undefined;
  getTasksBySDD: (sddId: string) => DevelopmentTask[];
  getTasksByDeveloper: (developerId: string) => DevelopmentTask[];
}

export const useDataStore = create<DataState>((set, get) => ({
  assessments: [...initialAssessments],
  requirements: [...initialRequirements],
  sdds: [...initialSDDs],
  tasks: [...initialTasks],
  
  // Assessments
  addAssessment: (assessmentData) => {
    const id = uuidv4();
    const newAssessment: Assessment = {
      ...assessmentData,
      id,
      createdDate: new Date().toISOString()
    };
    
    set(state => ({
      assessments: [...state.assessments, newAssessment]
    }));
    
    return id;
  },
  
  updateAssessment: (id, updates) => {
    set(state => ({
      assessments: state.assessments.map(assessment => 
        assessment.id === id ? { ...assessment, ...updates } : assessment
      )
    }));
  },
  
  getAssessmentById: (id) => {
    return get().assessments.find(a => a.id === id);
  },
  
  getAssessmentsByBA: (baId) => {
    return get().assessments.filter(a => a.assignedToBA === baId);
  },
  
  // Requirements
  addRequirement: (requirementData) => {
    const id = uuidv4();
    const newRequirement: Requirement = {
      ...requirementData,
      id,
      createdDate: new Date().toISOString()
    };
    
    set(state => ({
      requirements: [...state.requirements, newRequirement]
    }));
    
    return id;
  },
  
  updateRequirement: (id, updates) => {
    set(state => ({
      requirements: state.requirements.map(requirement => 
        requirement.id === id ? { ...requirement, ...updates } : requirement
      )
    }));
  },
  
  getRequirementById: (id) => {
    return get().requirements.find(r => r.id === id);
  },
  
  getRequirementsByAssessment: (assessmentId) => {
    return get().requirements.filter(r => r.assessmentId === assessmentId);
  },
  
  getCompletedRequirements: () => {
    return get().requirements.filter(r => r.productAnalysisStatus === 'Completed');
  },
  
  // Solution Design Documents
  addSDD: (sddData) => {
    const id = uuidv4();
    const newSDD: SolutionDesignDocument = {
      ...sddData,
      id,
      createdDate: new Date().toISOString()
    };
    
    set(state => ({
      sdds: [...state.sdds, newSDD]
    }));
    
    return id;
  },
  
  updateSDD: (id, updates) => {
    set(state => ({
      sdds: state.sdds.map(sdd => 
        sdd.id === id ? { ...sdd, ...updates } : sdd
      )
    }));
  },
  
  getSDDById: (id) => {
    return get().sdds.find(s => s.id === id);
  },
  
  getSDDsByRequirement: (requirementId) => {
    return get().sdds.filter(s => s.requirementId === requirementId);
  },
  
  // Development Tasks
  addTask: (taskData) => {
    const id = uuidv4();
    const newTask: DevelopmentTask = {
      ...taskData,
      id,
      createdDate: new Date().toISOString()
    };
    
    set(state => ({
      tasks: [...state.tasks, newTask]
    }));
    
    return id;
  },
  
  updateTask: (id, updates) => {
    set(state => ({
      tasks: state.tasks.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    }));
  },
  
  getTaskById: (id) => {
    return get().tasks.find(t => t.id === id);
  },
  
  getTasksBySDD: (sddId) => {
    return get().tasks.filter(t => t.sddId === sddId);
  },
  
  getTasksByDeveloper: (developerId) => {
    return get().tasks.filter(t => t.assignedToDeveloper === developerId);
  }
}));