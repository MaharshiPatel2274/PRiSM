import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import LeftNavigation from '@/components/workspace/LeftNavigation';
import CommandPrompt from '@/components/workspace/sections/CommandPrompt';
import Circuits from '@/components/workspace/sections/Circuits';
import CAD from '@/components/workspace/sections/CAD';
import CFD from '@/components/workspace/sections/CFD';
import WorkingCode from '@/components/workspace/sections/WorkingCode';
import BOM from '@/components/workspace/sections/BOM';
import RiskAnalysis from '@/components/workspace/sections/RiskAnalysis';
import TestingMethods from '@/components/workspace/sections/TestingMethods';
import UserManual from '@/components/workspace/sections/UserManual';
import { SectionType, Variable, ComputeResult } from '@/types';
import { computeAPI } from '@/lib/api';
import { Play, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function ProjectWorkspace() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<SectionType>('command-prompt');
  const [isComputing, setIsComputing] = useState(false);
  const [computeResult, setComputeResult] = useState<ComputeResult | null>(null);
  const [projectTitle, setProjectTitle] = useState('New Project');
  const [hasInitialData, setHasInitialData] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState<string>('');

  // Check if this is an existing project with data or get name from URL params
  useEffect(() => {
    const nameFromUrl = searchParams.get('name');
    const promptFromUrl = searchParams.get('prompt');
    
    if (nameFromUrl) {
      setProjectTitle(nameFromUrl);
      setHasInitialData(false);
    }
    
    if (promptFromUrl) {
      setCurrentPrompt(promptFromUrl);
    }
    
    if (!nameFromUrl && !id?.startsWith('new-')) {
      // Try to fetch project from API if it exists
      fetchProject();
    }
  }, [id, searchParams]);

  const fetchProject = async () => {
    if (!id || id.startsWith('new-')) return;
    
    try {
      const response = await fetch(`/api/projects/${id}`);
      const data = await response.json();
      if (data.ok && data.project) {
        setProjectTitle(data.project.name);
        if (data.project.specJson) {
          setHasInitialData(true);
          // Restore previous compute results if available
          const spec = data.project.specJson;
          setComputeResult({
            circuits: spec.circuit ? {
              schematic: spec.circuit.imageUrl,
              simulation: spec.circuit.simulation || {
                voltage: [0, 3.3, 5, 3.3, 0, 3.3],
                current: [0, 0.05, 0.08, 0.06, 0.03, 0.05],
                time: [0, 1, 2, 3, 4, 5]
              }
            } : undefined,
            cad: spec.cad ? {
              model3D: spec.cad.previewUrl,
              stepFileUrl: spec.cad.stepUrl,
              dimensions: spec.cad.dimensions || { width: 100, height: 50, depth: 25 }
            } : undefined,
            cfd: {
              preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
              metrics: { maxStress: 150.5, maxStrain: 0.002, maxTemperature: 85.3, safetyFactor: 2.1 }
            },
            workingCode: [],
            bom: [],
            risks: spec.risks || [],
            testing: spec.testing || [],
            userManual: spec.userManual || []
          });
        }
      }
    } catch (error) {
      console.log('Could not fetch project, using defaults');
    }
  };

  const handleCompute = async (prompt: string, variables: Variable[] = []) => {
    setIsComputing(true);
    setCurrentPrompt(prompt);
    // Intentionally hang here to simulate infinite buffering: await a never-resolving promise.
    // This will keep `isComputing` true and prevent any results from being shown.
    await new Promise<void>(() => {});

    try {
      // Try new API first
      try {
        const nlpResponse = await fetch('/api/nlp', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ projectId: id, prompt }),
        });
        
        const nlpData = await nlpResponse.json();
        if (nlpData.ok) {
          // Generate assets
          const generateResponse = await fetch('/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ projectId: id, prompt }),
          });
          
          const generateData = await generateResponse.json();
          if (generateData.ok) {
            setComputeResult({
              circuits: {
                schematic: generateData.circuit.imageUrl,
                simulation: generateData.circuit.simulation || {
                  voltage: [0, 3.3, 5, 3.3, 0, 3.3],
                  current: [0, 0.05, 0.08, 0.06, 0.03, 0.05],
                  time: [0, 1, 2, 3, 4, 5]
                }
              },
              cad: {
                model3D: generateData.cad.previewUrl,
                stepFileUrl: generateData.cad.stepUrl,
                dimensions: generateData.cad.dimensions || { width: 100, height: 50, depth: 25 }
              },
              cfd: {
                preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
                metrics: { maxStress: 150.5, maxStrain: 0.002, maxTemperature: 85.3, safetyFactor: 2.1 }
              },
              workingCode: [
                {
                  name: "main.py",
                  content: `# ${projectTitle}\n# Generated from: ${prompt}\n\nprint("Hello, ${projectTitle}!")`,
                  language: "python"
                }
              ],
              bom: [
                { component: 'Arduino Uno R3', quantity: 1, price: 23.99, supplier: 'Arduino', partNumber: 'A000066' },
                { component: 'Breadboard', quantity: 1, price: 5.95, supplier: 'Adafruit', partNumber: '64' }
              ],
              risks: generateData.risks || [],
              testing: generateData.testing || [],
              userManual: generateData.userManual || []
            });
            setHasInitialData(true);
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using fallback');
      }
      
      // Fallback to original mock API
      const result = await computeAPI.compute({
        prompt,
        variables,
        projectId: id || 'new'
      });
      setComputeResult(result);
      setHasInitialData(true);
      
    } catch (error) {
      console.error('Compute failed:', error);
    } finally {
      setIsComputing(false);
    }
  };

  const renderActiveSection = () => {
    const commonProps = { 
      isLoading: isComputing,
      prompt: currentPrompt 
    };
    
    switch (activeSection) {
      case 'command-prompt':
        return (
          <CommandPrompt 
            onCompute={handleCompute} 
            isLoading={isComputing} 
            initialPrompt={searchParams.get('prompt') || ''}
          />
        );
      case 'circuits':
        return <Circuits data={computeResult?.circuits} {...commonProps} />;
      case 'cad':
        return <CAD data={computeResult?.cad} {...commonProps} />;
      case 'cfd':
        return <CFD data={computeResult?.cfd} {...commonProps} />;
      case 'working-code':
        return <WorkingCode data={computeResult?.workingCode} {...commonProps} />;
      case 'bom':
        return <BOM data={computeResult?.bom} {...commonProps} />;
      case 'risk-analysis':
        return <RiskAnalysis data={computeResult?.risks} {...commonProps} />;
      case 'testing-methods':
        return <TestingMethods data={computeResult?.testing} {...commonProps} />;
      case 'user-manual':
        return <UserManual data={computeResult?.userManual} {...commonProps} />;
      default:
        return <div>Section not found</div>;
    }
  };

  const getSectionTitle = (section: SectionType): string => {
    const titles = {
      'command-prompt': 'Command Prompt',
      'circuits': 'Circuits',
      'cad': 'CAD',
      'cfd': 'CFD/Simulations',
      'working-code': 'Working Code',
      'bom': 'Bill of Materials',
      'risk-analysis': 'Risk Analysis',
      'testing-methods': 'Testing Methods',
      'user-manual': 'User Manual'
    };
    return titles[section] || 'Unknown Section';
  };

  const renderEmptyState = () => {
    if (activeSection === 'command-prompt') {
      return null; // Command prompt handles its own empty state
    }

    return (
      <div className="text-center py-16">
        <div className="max-w-md mx-auto">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
            <Play className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Project Not Initialized</h3>
          <p className="text-muted-foreground mb-6">
            Start by entering your engineering specification in the Command Prompt to generate all project sections.
          </p>
          <Button 
            onClick={() => setActiveSection('command-prompt')}
            className="flex items-center space-x-2"
          >
            <Play className="h-4 w-4" />
            <span>Go to Command Prompt</span>
          </Button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top Bar */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white border-b border-border sticky top-0 z-40"
      >
        <div className="px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => navigate('/')}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Projects</span>
              </Button>
              <div className="h-6 w-px bg-border"></div>
              <div>
                <h1 className="text-xl font-semibold">{projectTitle}</h1>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <span>Current: {getSectionTitle(activeSection)}</span>
                  {hasInitialData ? (
                    <Badge variant="outline" className="text-xs">
                      Data Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Empty Project
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {isComputing && (
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Computing...</span>
                </div>
              )}
              {hasInitialData && (
                <Button 
                  onClick={() => setActiveSection('command-prompt')}
                  disabled={isComputing}
                  variant="outline"
                  className="flex items-center space-x-2"
                >
                  <Play className="h-4 w-4" />
                  <span>Recompute</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </motion.header>

      {/* Main Layout */}
      <div className="flex">
        {/* Left Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <LeftNavigation 
            activeSection={activeSection}
            onSectionChange={setActiveSection}
          />
        </motion.div>

        {/* Main Content Panel */}
        <motion.main 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex-1 p-6 overflow-auto"
        >
          <div className="max-w-6xl mx-auto">
            {hasInitialData || activeSection === 'command-prompt' 
              ? renderActiveSection() 
              : renderEmptyState()
            }
          </div>
        </motion.main>
      </div>
    </div>
  );
}