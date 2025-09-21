export interface Project {
  id: string;
  title: string;
  date: string;
  status: 'active' | 'completed' | 'draft';
  description?: string;
}

export interface Variable {
  name: string;
  value: string;
  type: 'string' | 'number' | 'boolean';
}

export interface ComputeRequest {
  prompt: string;
  variables: Variable[];
  projectId: string;
}

export interface CircuitData {
  schematic: string;
  simulation: {
    voltage: number[];
    current: number[];
    time: number[];
  };
}

export interface CADData {
  model3D: string;
  stepFileUrl: string;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
}

export interface CFDData {
  preview: string;
  metrics: {
    maxStress: number;
    maxStrain: number;
    maxTemperature: number;
    safetyFactor: number;
  };
}

export interface CodeFile {
  name: string;
  content: string;
  language: string;
}

export interface BOMItem {
  component: string;
  quantity: number;
  price: number;
  supplier: string;
  partNumber: string;
}

export interface Risk {
  id: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  mitigation: string;
  probability: number;
}

export interface TestingMethod {
  id: string;
  title: string;
  procedure: string[];
  expectedResults: string;
  equipment: string[];
}

export interface UserManualSection {
  title: string;
  content: string;
  images?: string[];
}

export type SectionType = 
  | 'command-prompt'
  | 'circuits'
  | 'cad'
  | 'cfd'
  | 'working-code'
  | 'bom'
  | 'risk-analysis'
  | 'testing-methods'
  | 'user-manual';

export interface ComputeResult {
  circuits?: CircuitData;
  cad?: CADData;
  cfd?: CFDData;
  workingCode?: CodeFile[];
  bom?: BOMItem[];
  risks?: Risk[];
  testing?: TestingMethod[];
  userManual?: UserManualSection[];
}