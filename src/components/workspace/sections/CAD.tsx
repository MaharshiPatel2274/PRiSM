import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CADData } from '@/types';
import { Box, Download, Eye, Ruler } from 'lucide-react';
import { motion } from 'framer-motion';

interface CADProps {
  data?: CADData;
  isLoading: boolean;
  prompt?: string;
}

// Fixed CAD model mapping based on prompt keywords - deterministic
const CAD_KEYWORD_MAPPING: Record<string, string> = {
  'arduino': '/CAD Model 1.jpg',     // Arduino LED Controller gets CAD Model 1
  'led': '/CAD Model 1.jpg',         // LED projects get CAD Model 1
  'esp32': '/CAD Model 2.jpg',       // ESP32 projects get CAD Model 2
  'temperature': '/CAD Model 2.jpg', // Temperature monitoring gets CAD Model 2
  'raspberry pi': '/CAD Model 3.jpg', // Raspberry Pi projects get CAD Model 3
  'robot': '/CAD Model 3.jpg',       // Robotic projects get CAD Model 3
  'drone': '/CAD Model 4.jpg',       // Drone projects get CAD Model 4
  'solar': '/CAD Model 4.jpg',       // Solar projects get CAD Model 4
  'weather': '/CAD Model 4.jpg',     // Weather station gets CAD Model 4
};

// All available CAD images for fallback
const ALL_CAD_IMAGES = [
  '/CAD Model 1.jpg',
  '/CAD Model 2.jpg',
  '/CAD Model 3.jpg',
  '/CAD Model 4.jpg',
];

// Function to get CAD image based on prompt - deterministic mapping
function getCADImageFromPrompt(prompt: string = ''): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // Check for keyword matches (first match wins) - deterministic based on prompt
  for (const [keyword, imagePath] of Object.entries(CAD_KEYWORD_MAPPING)) {
    if (lowerPrompt.includes(keyword)) {
      return imagePath;
    }
  }
  
  // If no keyword matches, use deterministic selection based on prompt hash
  const hash = prompt.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const index = Math.abs(hash) % ALL_CAD_IMAGES.length;
  return ALL_CAD_IMAGES[index];
}

// Function to get CAD title based on image
function getCADTitle(imagePath: string): string {
  const imageNumber = imagePath.match(/CAD Model (\d+)/)?.[1];
  const titles: Record<string, string> = {
    '1': 'LED Controller Enclosure',      // Arduino LED Controller
    '2': 'Temperature Monitor Housing',   // ESP32 Temperature Monitor
    '3': 'Robotic Platform Assembly',     // Raspberry Pi Robot
    '4': 'Weather Station Enclosure',     // IoT Weather Station / Drone
  };
  return titles[imageNumber || '1'] || '3D CAD Model';
}

export default function CAD({ data, isLoading, prompt }: CADProps) {
  const handleDownloadSTEP = () => {
    // Create a download link for the STEP file
    const link = document.createElement('a');
    link.href = data?.stepFileUrl || '#';
    link.download = 'model.step';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Generating 3D CAD model...</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-64 bg-muted rounded"></div>
              <div className="h-8 bg-muted rounded w-1/3"></div>
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
            <Box className="h-5 w-5" />
            <span>3D CAD Model</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Box className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No CAD model generated yet. Run the command prompt to generate 3D models.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Get the appropriate CAD image based on prompt
  const cadImage = getCADImageFromPrompt(prompt);
  const cadTitle = getCADTitle(cadImage);

  return (
    <div className="space-y-6">
      {/* 3D Model Viewer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <Box className="h-5 w-5" />
                <span>3D CAD Model</span>
                <Badge variant="secondary">Generated</Badge>
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleDownloadSTEP}>
                  <Download className="h-4 w-4 mr-2" />
                  Download STEP
                </Button>
                <Button variant="outline" size="sm">
                  <Eye className="h-4 w-4 mr-2" />
                  Full View
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-gray-50 border">
                <img
                  src={cadImage}
                  alt={cadTitle}
                  className="w-full h-auto max-h-96 object-contain"
                  onError={(e) => {
                    // Fallback to data model3D if uploaded image fails
                    const target = e.target as HTMLImageElement;
                    target.src = data.model3D || '';
                  }}
                />
                <div className="absolute bottom-2 left-2">
                  <Badge variant="secondary" className="bg-white/90">
                    {cadTitle}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="outline" className="bg-white/90">
                    3D Model
                  </Badge>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="font-medium text-blue-800">File Format</div>
                  <div className="text-blue-600">STEP (.step)</div>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <div className="font-medium text-green-800">Material</div>
                  <div className="text-green-600">ABS Plastic</div>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <div className="font-medium text-purple-800">Complexity</div>
                  <div className="text-purple-600">Medium</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Model Specifications */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Ruler className="h-5 w-5" />
              <span>Model Specifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Dimensions</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Width:</span>
                    <span className="font-medium">{data.dimensions?.width || 100} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Height:</span>
                    <span className="font-medium">{data.dimensions?.height || 50} mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Depth:</span>
                    <span className="font-medium">{data.dimensions?.depth || 25} mm</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Volume:</span>
                    <span className="font-medium">
                      {((data.dimensions?.width || 100) * (data.dimensions?.height || 50) * (data.dimensions?.depth || 25) / 1000).toFixed(1)} cm³
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold">Manufacturing</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Process:</span>
                    <span className="font-medium">3D Printing</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Layer Height:</span>
                    <span className="font-medium">0.2 mm</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Infill:</span>
                    <span className="font-medium">20%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Est. Print Time:</span>
                    <span className="font-medium">2h 45m</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span>Material Cost:</span>
                    <span className="font-medium text-green-600">$3.20</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Design Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Design Features</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold">Structural Features</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Optimized wall thickness for strength</p>
                  <p>• Integrated mounting points</p>
                  <p>• Ventilation slots for heat dissipation</p>
                  <p>• Cable management channels</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Assembly Notes</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p>• Press-fit assembly design</p>
                  <p>• No additional fasteners required</p>
                  <p>• Snap-fit connectors included</p>
                  <p>• Easy access for maintenance</p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-2">
                <div className="text-yellow-600 font-semibold text-sm">⚠️ Manufacturing Note:</div>
                <div className="text-yellow-700 text-sm">
                  Ensure proper support structures for overhangs during 3D printing. Post-processing may be required for optimal surface finish.
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}