import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { TestingMethod } from '@/types';
import { TestTube, ChevronDown, ChevronRight, CheckCircle, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface TestingMethodsProps {
  data?: TestingMethod[];
  isLoading: boolean;
}

export default function TestingMethods({ data, isLoading }: TestingMethodsProps) {
  const [expandedTests, setExpandedTests] = useState<Set<string>>(new Set());

  const toggleExpanded = (testId: string) => {
    const newExpanded = new Set(expandedTests);
    if (newExpanded.has(testId)) {
      newExpanded.delete(testId);
    } else {
      newExpanded.add(testId);
    }
    setExpandedTests(newExpanded);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Generating testing procedures...</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5" />
            <span>Testing Methods</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <TestTube className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No testing methods available. Run the command prompt to generate test procedures.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

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
              <TestTube className="h-5 w-5" />
              <span>Testing Methods</span>
              <Badge variant="secondary">Gemini Generated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data.map((test, index) => (
                <motion.div
                  key={test.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Collapsible
                    open={expandedTests.has(test.id)}
                    onOpenChange={() => toggleExpanded(test.id)}
                  >
                    <Card className="border-l-4 border-l-blue-500">
                      <CollapsibleTrigger asChild>
                        <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg flex items-center space-x-2">
                              <TestTube className="h-5 w-5 text-blue-500" />
                              <span>{test.title}</span>
                            </CardTitle>
                            <div className="flex items-center space-x-2">
                              <Badge variant="outline">
                                {test.procedure.length} steps
                              </Badge>
                              {expandedTests.has(test.id) ? (
                                <ChevronDown className="h-4 w-4" />
                              ) : (
                                <ChevronRight className="h-4 w-4" />
                              )}
                            </div>
                          </div>
                        </CardHeader>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <CardContent className="pt-0">
                          <div className="space-y-6">
                            {/* Test Procedure */}
                            <div>
                              <h4 className="font-medium mb-3 flex items-center space-x-2">
                                <Settings className="h-4 w-4" />
                                <span>Test Procedure</span>
                              </h4>
                              <div className="space-y-2">
                                {test.procedure.map((step, stepIndex) => (
                                  <div 
                                    key={stepIndex}
                                    className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg"
                                  >
                                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
                                      {stepIndex + 1}
                                    </div>
                                    <div className="text-sm">{step}</div>
                                  </div>
                                ))}
                              </div>
                            </div>

                            {/* Expected Results */}
                            <div>
                              <h4 className="font-medium mb-2 flex items-center space-x-2">
                                <CheckCircle className="h-4 w-4 text-green-500" />
                                <span>Expected Results</span>
                              </h4>
                              <div className="p-3 bg-green-50 rounded-lg border-l-4 border-l-green-500">
                                <div className="text-sm text-green-800">{test.expectedResults}</div>
                              </div>
                            </div>

                            {/* Required Equipment */}
                            <div>
                              <h4 className="font-medium mb-2">Required Equipment</h4>
                              <div className="flex flex-wrap gap-2">
                                {test.equipment.map((equipment, eqIndex) => (
                                  <Badge key={eqIndex} variant="outline">
                                    {equipment}
                                  </Badge>
                                ))}
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex space-x-2 pt-2">
                              <Button size="sm" className="flex items-center space-x-1">
                                <CheckCircle className="h-4 w-4" />
                                <span>Mark Complete</span>
                              </Button>
                              <Button size="sm" variant="outline">
                                Export Test Plan
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Testing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-blue-600 font-medium">Total Tests</div>
                <div className="text-2xl font-bold text-blue-800">{data.length}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-green-600 font-medium">Total Steps</div>
                <div className="text-2xl font-bold text-green-800">
                  {data.reduce((sum, test) => sum + test.procedure.length, 0)}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-purple-600 font-medium">Equipment Types</div>
                <div className="text-2xl font-bold text-purple-800">
                  {new Set(data.flatMap(test => test.equipment)).size}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="text-sm">
                <strong>Testing Strategy:</strong> Comprehensive validation covering functional, 
                performance, and safety aspects. Execute tests in sequence for optimal results.
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}