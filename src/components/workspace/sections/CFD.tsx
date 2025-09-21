import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CFDData } from '@/types';
import { Wind, Thermometer, Zap, Shield } from 'lucide-react';
import { motion } from 'framer-motion';

interface CFDProps {
  data?: CFDData;
  isLoading: boolean;
}

export default function CFD({ data, isLoading }: CFDProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Running CFD simulation...</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-muted rounded-lg"></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-muted rounded-lg"></div>
                <div className="h-24 bg-muted rounded-lg"></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!data) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Wind className="h-5 w-5" />
            <span>CFD/Simulations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Wind className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No simulation data available. Run the command prompt to generate CFD analysis.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStressColor = (stress: number) => {
    if (stress < 100) return 'text-green-600';
    if (stress < 150) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getStressProgress = (stress: number) => {
    return Math.min((stress / 200) * 100, 100);
  };

  const getSafetyFactorColor = (factor: number) => {
    if (factor >= 2.0) return 'text-green-600';
    if (factor >= 1.5) return 'text-yellow-600';
    return 'text-red-600';
  };

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
              <Wind className="h-5 w-5" />
              <span>CFD Simulation</span>
              <Badge variant="secondary">SimScale Analysis</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <img 
                src={data.preview} 
                alt="CFD Simulation" 
                className="w-full h-64 object-cover rounded-lg border"
              />
              <div className="absolute top-2 right-2">
                <Badge className="bg-blue-500 text-white">
                  Converged
                </Badge>
              </div>
            </div>
            <div className="mt-4 text-sm text-muted-foreground">
              Computational Fluid Dynamics analysis showing stress distribution and thermal patterns
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Simulation Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="h-4 w-4 text-blue-500" />
                    <span className="font-medium">Max Stress</span>
                  </div>
                  <div className={`text-2xl font-bold ${getStressColor(data.metrics.maxStress)}`}>
                    {data.metrics.maxStress} MPa
                  </div>
                  <Progress 
                    value={getStressProgress(data.metrics.maxStress)} 
                    className="mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Material yield strength: 200 MPa
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Thermometer className="h-4 w-4 text-red-500" />
                    <span className="font-medium">Max Temperature</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {data.metrics.maxTemperature}°C
                  </div>
                  <Progress 
                    value={(data.metrics.maxTemperature / 100) * 100} 
                    className="mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Operating limit: 100°C
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Wind className="h-4 w-4 text-green-500" />
                    <span className="font-medium">Max Strain</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {data.metrics.maxStrain}
                  </div>
                  <Progress 
                    value={(data.metrics.maxStrain / 0.005) * 100} 
                    className="mt-2"
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    Elastic limit: 0.005
                  </div>
                </div>

                <div className="p-4 border rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Shield className="h-4 w-4 text-purple-500" />
                    <span className="font-medium">Safety Factor</span>
                  </div>
                  <div className={`text-2xl font-bold ${getSafetyFactorColor(data.metrics.safetyFactor)}`}>
                    {data.metrics.safetyFactor}
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    Minimum recommended: 2.0
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Analysis Summary</h4>
              <div className="text-sm text-muted-foreground space-y-1">
                <p>• Simulation completed with {data.metrics.safetyFactor >= 2.0 ? 'acceptable' : 'marginal'} safety margins</p>
                <p>• Maximum stress occurs at connection points under peak load conditions</p>
                <p>• Thermal analysis shows {data.metrics.maxTemperature < 80 ? 'adequate' : 'elevated'} temperature distribution</p>
                <p>• Recommended for {data.metrics.safetyFactor >= 2.0 ? 'production' : 'design review'}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}