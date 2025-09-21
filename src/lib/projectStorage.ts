export interface StoredProject {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'draft' | 'active' | 'completed';
  prompt?: string;
  circuitImage?: string;
}

const STORAGE_KEY = 'engineering_projects';

// Sample projects data - removed "Hello" and "bkah boayh" projects
const SAMPLE_PROJECTS: StoredProject[] = [
  {
    id: 'temp-monitor-001',
    title: 'Temperature Monitoring System',
    description: 'Arduino-based temperature monitoring with email alerts and data logging capabilities',
    date: '1/14/2024',
    status: 'active',
    prompt: 'Create a temperature monitoring system using Arduino with email alerts when temp...',
    circuitImage: '/temperature-monitoring.png' // Using the uploaded image
  },
  {
    id: 'smart-home-001',
    title: 'Smart Home Automation',
    description: 'IoT-enabled home automation system with voice control and mobile app integration',
    date: '1/30/2024',
    status: 'completed',
    prompt: 'Design a smart home automation system with ESP32, connecting lights, fans, and...',
    circuitImage: '/Circuit 5.jpg'
  },
  {
    id: 'drone-controller-001',
    title: 'Drone Flight Controller',
    description: 'Custom flight controller design for autonomous drone navigation and obstacle avoidance',
    date: '1/7/2024',
    status: 'draft',
    prompt: 'Build a drone flight controller with GPS navigation and obstacle avoidance using...',
    circuitImage: '/Circuit 4.jpg'
  },
  {
    id: 'solar-optimizer-001',
    title: 'Solar Panel Optimizer',
    description: 'Maximum power point tracking system for solar panel efficiency optimization',
    date: '12/15/2023',
    status: 'active',
    prompt: 'Design a solar panel optimizer with MPPT controller for maximum energy harvest...',
    circuitImage: '/Circuit 5.jpg'
  },
  {
    id: 'robotic-arm-001',
    title: 'Robotic Arm Control',
    description: 'Precision robotic arm with computer vision for automated assembly tasks',
    date: '12/8/2023',
    status: 'completed',
    prompt: 'Create a robotic arm control system with computer vision for pick and place operations...',
    circuitImage: '/Circuit 7.jpg'
  },
  {
    id: 'water-quality-001',
    title: 'Water Quality Monitor',
    description: 'Real-time water quality monitoring system with pH, turbidity, and chemical sensors',
    date: '11/22/2023',
    status: 'draft',
    prompt: 'Build a water quality monitoring system with multiple sensors for pH, turbidity...',
    circuitImage: '/Circuit 2.jpg'
  }
];

export function loadProjects(): StoredProject[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
  return [];
}

export function saveProjects(projects: StoredProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
  } catch (error) {
    console.error('Error saving projects:', error);
  }
}

export function addProject(project: StoredProject): StoredProject {
  const projects = loadProjects();
  projects.unshift(project);
  saveProjects(projects);
  return project;
}

export function generateProjectId(): string {
  return `proj-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function initializeSampleProjects(): void {
  const existingProjects = loadProjects();
  if (existingProjects.length === 0) {
    saveProjects(SAMPLE_PROJECTS);
  }
}