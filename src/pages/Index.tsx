import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import ProjectCard from '@/components/ProjectCard';
import { Project } from '@/types';
import { 
  Plus, 
  Search, 
  Zap, 
  RefreshCw, 
  Moon, 
  Sun, 
  Thermometer, 
  Cpu, 
  Wifi,
  Box,
  Wind,
  Code,
  Package,
  FileText
} from 'lucide-react';
import { motion } from 'framer-motion';
import { loadProjects, addProject, generateProjectId, initializeSampleProjects, StoredProject } from '@/lib/projectStorage';
import { getRandomCircuitImage, getContextualCircuitImage } from '@/server/mock/circuitImages';

export default function Index() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState<StoredProject[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isNewProjectOpen, setIsNewProjectOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: ''
  });
  const [isCreating, setIsCreating] = useState(false);
  const [circuitPreview, setCircuitPreview] = useState(getRandomCircuitImage());
  const [darkMode, setDarkMode] = useState(false);

  // Initialize dark mode from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // Load projects on component mount
  useEffect(() => {
    initializeSampleProjects();
    const loadedProjects = loadProjects();
    setProjects(loadedProjects);
  }, []);

  // Update circuit preview when project title changes
  useEffect(() => {
    if (newProject.title.trim()) {
      const contextualImage = getContextualCircuitImage(newProject.title);
      setCircuitPreview(contextualImage);
    } else {
      setCircuitPreview(getRandomCircuitImage());
    }
  }, [newProject.title]);

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProjectClick = (projectId: string) => {
    navigate(`/workspace/${projectId}`);
  };

  const handleCreateProject = async () => {
    if (newProject.title.trim()) {
      setIsCreating(true);
      try {
        const projectId = generateProjectId();
        const circuitImage = getContextualCircuitImage(newProject.title);
        
        // Create new project with enhanced data
        const createdProject = addProject({
          id: projectId,
          title: newProject.title.trim(),
          description: newProject.description.trim() || `Engineering project: ${newProject.title}`,
          date: new Date().toISOString().split('T')[0],
          status: 'draft' as const,
          prompt: newProject.description.trim() || newProject.title.trim(),
          circuitImage: circuitImage.imageUrl,
        });

        // Update local state
        setProjects(prev => [createdProject, ...prev]);

        // Navigate to project workspace
        navigate(`/workspace/${projectId}?name=${encodeURIComponent(newProject.title.trim())}&prompt=${encodeURIComponent(newProject.description.trim() || newProject.title.trim())}`);
        
        // Reset form
        setIsNewProjectOpen(false);
        setNewProject({ title: '', description: '' });
        
      } catch (error) {
        console.error('Failed to create project:', error);
      } finally {
        setIsCreating(false);
      }
    }
  };

  const handleCreateProjectFromTemplate = (template: any) => {
    const projectId = generateProjectId();
    navigate(`/workspace/${projectId}?name=${encodeURIComponent(template.title)}&prompt=${encodeURIComponent(template.prompt)}`);
  };

  const refreshCircuitPreview = () => {
    if (newProject.title.trim()) {
      // Get a different contextual image by adding randomness
      const randomizedPrompt = newProject.title + ' ' + Math.random().toString();
      const newImage = getContextualCircuitImage(randomizedPrompt);
      setCircuitPreview(newImage);
    } else {
      setCircuitPreview(getRandomCircuitImage());
    }
  };

  const features = [
    {
      icon: Zap,
      title: 'Circuit Design',
      description: 'Generate schematics and simulations',
      color: 'text-yellow-600 dark:text-yellow-400'
    },
    {
      icon: Box,
      title: '3D CAD Models',
      description: 'Create detailed 3D designs',
      color: 'text-green-600 dark:text-green-400'
    },
    {
      icon: Wind,
      title: 'CFD Analysis',
      description: 'Fluid dynamics simulations',
      color: 'text-cyan-600 dark:text-cyan-400'
    },
    {
      icon: Code,
      title: 'Working Code',
      description: 'Generate functional firmware',
      color: 'text-purple-600 dark:text-purple-400'
    },
    {
      icon: Package,
      title: 'Bill of Materials',
      description: 'Complete component lists',
      color: 'text-orange-600 dark:text-orange-400'
    },
    {
      icon: FileText,
      title: 'Documentation',
      description: 'Comprehensive user manuals',
      color: 'text-gray-600 dark:text-gray-400'
    }
  ];

  const projectTemplates = [
    {
      title: 'ESP32 Temperature Monitor',
      description: 'WiFi-enabled temperature monitoring with email alerts',
      image: '/temperature-control-circuit.png', // Updated to use new temperature circuit image
      prompt: 'Design an ESP32-based temperature monitoring system with WiFi connectivity, email alerts, and web dashboard',
      tags: ['ESP32', 'WiFi', 'Sensors'],
      icon: Thermometer,
      color: 'bg-blue-500'
    },
    {
      title: 'Arduino LED Controller',
      description: 'Music-reactive LED strip with mobile control',
      image: '/Circuit 3.jpg', // Fixed to Circuit 3 for Arduino LED projects
      prompt: 'Create an Arduino-controlled LED strip with music visualization and mobile app control',
      tags: ['Arduino', 'LED', 'Mobile'],
      icon: Zap,
      color: 'bg-purple-500'
    },
    {
      title: 'Raspberry Pi Robot',
      description: 'Computer vision robotic arm for object sorting',
      image: '/Circuit 7.jpg', // Fixed to Circuit 7 for Raspberry Pi projects
      prompt: 'Build a Raspberry Pi robotic arm with computer vision for object sorting and manipulation',
      tags: ['Raspberry Pi', 'AI', 'Robotics'],
      icon: Cpu,
      color: 'bg-green-500'
    },
    {
      title: 'IoT Weather Station',
      description: 'Solar-powered weather monitoring system',
      image: '/Circuit 5.jpg', // Fixed to Circuit 5 for solar/weather projects
      prompt: 'Develop a solar-powered weather station with data logging and remote monitoring capabilities',
      tags: ['IoT', 'Solar', 'Sensors'],
      icon: Wifi,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50 transition-colors duration-300"
      >
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-3">
                <img
                  src="/prism-logo.jpg"
                  alt="PRiSM logo"
                  className="w-10 h-10 object-contain rounded-md"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                    PRiSM
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400">AI-Powered Engineering Design Platform</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <div className="flex items-center space-x-3">
                <Label htmlFor="dark-mode" className="text-sm font-medium">
                  {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
                </Label>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={toggleDarkMode}
                />
              </div>

              <Dialog open={isNewProjectOpen} onOpenChange={setIsNewProjectOpen}>
                <DialogTrigger asChild>
                  <Button className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                    <Plus className="h-4 w-4" />
                    <span>New Project</span>
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Create New Project</DialogTitle>
                  </DialogHeader>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Form Section */}
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="title">Project Title</Label>
                        <Input
                          id="title"
                          value={newProject.title}
                          onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                          placeholder="Enter project title..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description">Description / Requirements</Label>
                        <Textarea
                          id="description"
                          value={newProject.description}
                          onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                          placeholder="Describe your engineering project requirements..."
                          className="mt-1 min-h-[120px]"
                        />
                      </div>
                      <div className="flex justify-end space-x-2">
                        <Button 
                          variant="outline" 
                          onClick={() => setIsNewProjectOpen(false)}
                          disabled={isCreating}
                        >
                          Cancel
                        </Button>
                        <Button 
                          onClick={handleCreateProject}
                          disabled={!newProject.title.trim() || isCreating}
                        >
                          {isCreating ? 'Creating...' : 'Create Project'}
                        </Button>
                      </div>
                    </div>

                    {/* Circuit Preview Section */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Circuit Preview</Label>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={refreshCircuitPreview}
                          className="flex items-center space-x-1"
                        >
                          <RefreshCw className="h-3 w-3" />
                          <span>Refresh</span>
                        </Button>
                      </div>
                      <Card>
                        <CardContent className="p-4">
                          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                            <img
                              src={circuitPreview.imageUrl}
                              alt={circuitPreview.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div className="mt-3">
                            <h4 className="font-medium text-sm">{circuitPreview.title}</h4>
                            <p className="text-xs text-muted-foreground mt-1">
                              {circuitPreview.description}
                            </p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {circuitPreview.components.slice(0, 3).map((component, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                                >
                                  {component}
                                </span>
                              ))}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <p className="text-xs text-muted-foreground">
                        This preview shows a contextual circuit design that will be generated based on your project requirements.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Quick Start Templates */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Quick Start Templates
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {projectTemplates.map((template, index) => {
              const Icon = template.icon;
              return (
                <motion.div
                  key={template.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-xl transition-all duration-300 cursor-pointer group bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700"
                        onClick={() => handleCreateProjectFromTemplate(template)}>
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={template.image}
                          alt={template.title}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className={`absolute top-2 left-2 w-8 h-8 ${template.color} rounded-full flex items-center justify-center`}>
                          <Icon className="h-4 w-4 text-white" />
                        </div>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{template.title}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{template.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {template.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Everything You Need
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full hover:shadow-lg transition-all duration-300 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center space-x-3 mb-3">
                        <Icon className={`h-6 w-6 ${feature.color}`} />
                        <h4 className="font-semibold text-gray-900 dark:text-white">{feature.title}</h4>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle>Your Projects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search projects..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="text-sm text-muted-foreground">
                  {filteredProjects.length} of {projects.length} projects
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Projects Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {filteredProjects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ProjectCard
                    project={project}
                    onClick={handleProjectClick}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No projects found matching your search.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </motion.div>
      </main>
    </div>
  );
}