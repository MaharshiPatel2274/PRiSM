import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Terminal, Play, Zap, Loader2, CheckCircle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CommandPromptProps {
  onCompute: (prompt: string, variables?: any[]) => void;
  isLoading: boolean;
  initialPrompt?: string;
}

export default function CommandPrompt({ onCompute, isLoading, initialPrompt }: CommandPromptProps) {
  const [prompt, setPrompt] = useState(initialPrompt || '');
  const [showSuccess, setShowSuccess] = useState(false);
  const [processingStage, setProcessingStage] = useState('');

  const handleCompute = () => {
    if (prompt.trim() && onCompute) {
      setShowSuccess(false);
      onCompute(prompt.trim(), []);
    }
  };

  // Simulate processing stages for better UX
  useEffect(() => {
    if (isLoading) {
      const stages = [
        'Analyzing requirements...',
        'Generating circuit design...',
        'Creating 3D models...',
        'Calculating BOM...',
        'Finalizing documentation...'
      ];
      
      let currentStage = 0;
      setProcessingStage(stages[0]);
      
      const interval = setInterval(() => {
        currentStage++;
        if (currentStage < stages.length) {
          setProcessingStage(stages[currentStage]);
        } else {
          clearInterval(interval);
        }
      }, 2000);
      
      return () => clearInterval(interval);
    } else if (!isLoading && processingStage) {
      // Show success message when processing completes
      setShowSuccess(true);
      setProcessingStage('');
      setTimeout(() => setShowSuccess(false), 4000);
    }
  }, [isLoading, processingStage]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCompute();
    }
  };

  const examplePrompts = [
    "Design an ESP32-based temperature monitoring system with WiFi connectivity and email alerts",
    "Create an Arduino-controlled LED strip with music visualization and mobile app control",
    "Build a Raspberry Pi robotic arm with computer vision for object sorting and manipulation",
    "Develop a solar-powered weather station with data logging and remote monitoring capabilities"
  ];

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Terminal className="h-5 w-5" />
              <span>Engineering Specification</span>
              <Badge variant="secondary">Source of Truth</Badge>
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Describe your engineering project requirements to generate circuits, CAD models, simulations, and documentation.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Describe your engineering project requirements..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
                className="min-h-[120px] resize-none"
                disabled={isLoading}
              />
              <div className="flex justify-between items-center text-xs text-muted-foreground">
                <span>{prompt.length} characters</span>
                <span>Press Ctrl+Enter to generate</span>
              </div>
            </div>

            <div className="flex justify-center">
              <Button
                onClick={handleCompute}
                disabled={!prompt.trim() || isLoading}
                size="lg"
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Play className="h-4 w-4" />
                )}
                <span>{isLoading ? 'Generating Project...' : 'Generate Project'}</span>
              </Button>
            </div>

            {/* Processing Feedback */}
            <AnimatePresence>
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                >
                  <div className="flex items-center space-x-3">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Generating your engineering project...
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-300 flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{processingStage}</span>
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Success Feedback */}
              {showSuccess && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800"
                >
                  <div className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-green-800 dark:text-green-200">
                        Project generated successfully!
                      </p>
                      <p className="text-xs text-green-600 dark:text-green-300">
                        Navigate through the sections to explore your engineering project
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </motion.div>

      {/* Getting Started Guide */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Zap className="h-5 w-5" />
              <span>Getting Started</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your engineering requirements above and click "Generate Project" to create circuits, CAD models, simulations, and documentation.
              </p>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-sm">Example Projects:</h4>
                <div className="grid grid-cols-1 gap-2">
                  {examplePrompts.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setPrompt(example)}
                      disabled={isLoading}
                      className="text-left p-3 text-xs bg-muted hover:bg-muted/80 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                <div className="text-xs space-y-1 text-green-700 dark:text-green-300">
                  <p><strong>💡 Pro Tips:</strong></p>
                  <p>• Be specific about components (ESP32, Arduino, Raspberry Pi)</p>
                  <p>• Include functionality requirements (WiFi, sensors, motors)</p>
                  <p>• Mention any special features (mobile app, alerts, automation)</p>
                  <p>• Specify power requirements or environmental conditions</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}