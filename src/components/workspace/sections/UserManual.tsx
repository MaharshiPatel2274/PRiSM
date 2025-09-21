import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UserManualSection } from '@/types';
import { FileText, Download, Eye, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import jsPDF from 'jspdf';

interface UserManualProps {
  data?: UserManualSection[];
  isLoading: boolean;
  prompt?: string;
  circuitImage?: string;
  cadImage?: string;
}

// Fixed circuit image mapping based on prompt - same as Circuits component
const getCircuitImageFromPrompt = (prompt: string = ''): string => {
  const lowerPrompt = prompt.toLowerCase();
  const CIRCUIT_KEYWORD_MAPPING: Record<string, string> = {
    'esp32': '/Circuit 1.jpg',
    'raspberry pi': '/Circuit 7.jpg',
    'arduino': '/Circuit 3.jpg',
    'arguino': '/Circuit 3.jpg',
    'temperature': '/temperature-control-circuit.png',
    'sensor': '/Circuit 2.jpg',
    'motor': '/Circuit 6.jpg',
    'drone': '/Circuit 4.jpg',
    'led': '/Circuit 3.jpg',
    'solar': '/Circuit 5.jpg',
    'weather': '/Circuit 5.jpg',
  };
  
  for (const [keyword, imagePath] of Object.entries(CIRCUIT_KEYWORD_MAPPING)) {
    if (lowerPrompt.includes(keyword)) {
      return imagePath;
    }
  }
  
  // Deterministic fallback based on prompt hash
  const hash = prompt.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const circuits = ['/Circuit 1.jpg', '/Circuit 2.jpg', '/Circuit 3.jpg', '/Circuit 4.jpg', '/Circuit 5.jpg', '/Circuit 6.jpg', '/Circuit 7.jpg'];
  return circuits[Math.abs(hash) % circuits.length];
};

// Fixed CAD image mapping based on prompt - same as CAD component
const getCADImageFromPrompt = (prompt: string = ''): string => {
  const lowerPrompt = prompt.toLowerCase();
  const CAD_KEYWORD_MAPPING: Record<string, string> = {
    'arduino': '/CAD Model 1.jpg',
    'led': '/CAD Model 1.jpg',
    'esp32': '/CAD Model 2.jpg',
    'temperature': '/CAD Model 2.jpg',
    'raspberry pi': '/CAD Model 3.jpg',
    'robot': '/CAD Model 3.jpg',
    'drone': '/CAD Model 4.jpg',
    'solar': '/CAD Model 4.jpg',
    'weather': '/CAD Model 4.jpg',
  };
  
  for (const [keyword, imagePath] of Object.entries(CAD_KEYWORD_MAPPING)) {
    if (lowerPrompt.includes(keyword)) {
      return imagePath;
    }
  }
  
  // Deterministic fallback based on prompt hash
  const hash = prompt.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  const cadModels = ['/CAD Model 1.jpg', '/CAD Model 2.jpg', '/CAD Model 3.jpg', '/CAD Model 4.jpg'];
  return cadModels[Math.abs(hash) % cadModels.length];
};

export default function UserManual({ data, isLoading, prompt }: UserManualProps) {
  const [selectedSection, setSelectedSection] = useState<number>(0);

  const handleExportPDF = async () => {
    const pdf = new jsPDF();
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const contentWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to add a new page if needed
    const checkPageBreak = (requiredHeight: number) => {
      if (yPosition + requiredHeight > pageHeight - margin) {
        pdf.addPage();
        yPosition = margin;
      }
    };

    // Helper function to add text with word wrapping
    const addWrappedText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
      
      const lines = pdf.splitTextToSize(text, contentWidth);
      const lineHeight = fontSize * 0.4;
      
      checkPageBreak(lines.length * lineHeight);
      
      lines.forEach((line: string) => {
        pdf.text(line, margin, yPosition);
        yPosition += lineHeight;
      });
      
      yPosition += 5; // Add some spacing after text
    };

    // Helper function to add image from URL
    const addImageFromURL = async (imageUrl: string, caption: string, maxHeight: number = 80) => {
      try {
        // Convert image URL to base64
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const reader = new FileReader();
        
        return new Promise<void>((resolve) => {
          reader.onload = () => {
            const base64 = reader.result as string;
            
            checkPageBreak(maxHeight + 20);
            
            // Calculate image dimensions to fit within page
            const imgWidth = contentWidth * 0.8;
            const imgHeight = Math.min(maxHeight, imgWidth * 0.6);
            const imgX = margin + (contentWidth - imgWidth) / 2;
            
            pdf.addImage(base64, 'JPEG', imgX, yPosition, imgWidth, imgHeight);
            yPosition += imgHeight + 5;
            
            // Add caption
            pdf.setFontSize(10);
            pdf.setFont('helvetica', 'italic');
            pdf.text(caption, margin + (contentWidth - pdf.getTextWidth(caption)) / 2, yPosition);
            yPosition += 15;
            
            resolve();
          };
          reader.readAsDataURL(blob);
        });
      } catch (error) {
        console.error('Error adding image to PDF:', error);
        // Add placeholder text if image fails
        addWrappedText(`[Image: ${caption}]`, 10, true);
      }
    };

    // Title Page
    pdf.setFontSize(24);
    pdf.setFont('helvetica', 'bold');
    pdf.text('User Manual', margin, yPosition);
    yPosition += 20;

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Engineering Project Documentation', margin, yPosition);
    yPosition += 15;

    if (prompt) {
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'italic');
      const promptLines = pdf.splitTextToSize(`Project: ${prompt}`, contentWidth);
      promptLines.forEach((line: string) => {
        pdf.text(line, margin, yPosition);
        yPosition += 6;
      });
    }

    yPosition += 20;

    // Add Circuit Image - Fixed based on prompt
    const circuitImage = getCircuitImageFromPrompt(prompt);
    const circuitTitle = 'Circuit Schematic Design';
    await addImageFromURL(circuitImage, circuitTitle);

    // Add CAD Image - Fixed based on prompt
    const cadImage = getCADImageFromPrompt(prompt);
    const cadTitle = '3D CAD Model';
    await addImageFromURL(cadImage, cadTitle);

    // Add manual sections
    if (data && data.length > 0) {
      data.forEach((section) => {
        checkPageBreak(30);
        
        // Section title
        addWrappedText(section.title, 16, true);
        
        // Section content
        addWrappedText(section.content, 12, false);
        
        yPosition += 10;
      });
    } else {
      // Default manual content
      const defaultSections = [
        {
          title: 'Introduction',
          content: `This user manual provides comprehensive instructions for operating and maintaining your engineering project. Please read all sections carefully before use.`
        },
        {
          title: 'System Overview',
          content: `Your system includes advanced electronic components, sensors, and control mechanisms designed for optimal performance and reliability.`
        },
        {
          title: 'Installation & Setup',
          content: `Follow the installation procedures carefully. Ensure all connections are secure and power requirements are met before initial startup.`
        },
        {
          title: 'Operation',
          content: `Normal operation procedures include system startup, monitoring, and shutdown sequences. Refer to the circuit diagram and CAD model for component locations.`
        },
        {
          title: 'Troubleshooting',
          content: `Common issues and their solutions are provided. For technical support, contact the engineering team with system details and error descriptions.`
        }
      ];

      defaultSections.forEach((section) => {
        checkPageBreak(30);
        addWrappedText(section.title, 16, true);
        addWrappedText(section.content, 12, false);
        yPosition += 10;
      });
    }

    // Footer
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth - margin - 20,
        pageHeight - 10
      );
      pdf.text(
        `Generated: ${new Date().toLocaleDateString()}`,
        margin,
        pageHeight - 10
      );
    }

    // Save the PDF
    pdf.save('user-manual.pdf');
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Generating user manual...</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-20 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const manualData = data || [
    {
      title: 'Introduction',
      content: `Welcome to your Engineering Project!\n\nThis comprehensive manual will guide you through setup, operation, troubleshooting, and maintenance procedures. Please read all sections carefully before operating the system.\n\nYour system has been specifically designed based on the requirements: "${prompt || 'Custom engineering solution'}"`
    },
    {
      title: 'System Overview',
      content: `Your engineering system includes the following key components:\n\n• Advanced microcontroller for processing and control\n• Sensor array for data collection and monitoring\n• Communication interface for connectivity\n• Power management and regulation system\n• User interface for monitoring and configuration\n• Safety and protection circuits\n\nThe system is designed to provide reliable, automated operation with minimal user intervention.`
    },
    {
      title: 'Installation & Setup',
      content: `Follow these steps to install your system:\n\n1. **Unpacking**: Carefully unpack all components and verify against the included BOM\n2. **Location**: Choose an appropriate installation location considering environmental factors\n3. **Mounting**: Secure the main unit using the provided mounting hardware\n4. **Connections**: Connect all sensors and actuators according to the wiring diagram\n5. **Power**: Connect the power adapter and verify voltage requirements\n6. **Software**: Install any required software on your computer or mobile device\n7. **Configuration**: Run the initial setup wizard to configure system parameters\n8. **Testing**: Perform initial system test to verify proper operation\n\n⚠️ **Safety Note**: Ensure power is disconnected during installation.`
    },
    {
      title: 'Operation',
      content: `To operate your system:\n\n**Startup Procedure:**\n1. Power on the system using the main switch\n2. Wait for initialization sequence (LED indicators will show status)\n3. The system will automatically begin normal operation\n4. Monitor status via the display panel or web interface\n\n**Normal Operation:**\n• The system operates autonomously once configured\n• Monitor real-time data and system status regularly\n• Configure alerts and thresholds as needed for your application\n• Perform regular maintenance as outlined in this manual\n\n**Shutdown Procedure:**\n1. Save any important data or configurations\n2. Use the proper shutdown sequence (do not just disconnect power)\n3. Wait for all indicators to turn off before disconnecting power`
    },
    {
      title: 'Troubleshooting',
      content: `Common issues and solutions:\n\n**System Won't Start:**\n• Check power connections and verify voltage\n• Ensure all fuses are intact\n• Verify power adapter specifications\n\n**No Sensor Readings:**\n• Check sensor connections and wiring\n• Verify sensor power supply\n• Run sensor calibration procedure\n\n**Communication Errors:**\n• Check network settings and connectivity\n• Restart communication interface\n• Check for interference sources\n\n**Erratic Behavior:**\n• Restart system using proper shutdown/startup procedure\n• Check for electromagnetic interference\n• Verify all connections are secure\n• Update firmware if available\n\n**Technical Support:**\nFor additional assistance, contact technical support with:\n• System serial number\n• Detailed description of the issue\n• Any error messages displayed\n• Recent changes to the system`
    }
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
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>User Manual</span>
                <Badge variant="secondary">Complete</Badge>
              </CardTitle>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Comprehensive documentation with integrated circuit and CAD images
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Table of Contents */}
              <div className="lg:col-span-1">
                <h4 className="font-semibold mb-3">Table of Contents</h4>
                <div className="space-y-1">
                  {manualData.map((section, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSection(index)}
                      className={`w-full text-left p-2 rounded text-sm transition-colors ${
                        selectedSection === index
                          ? 'bg-primary text-primary-foreground'
                          : 'hover:bg-muted'
                      }`}
                    >
                      {section.title}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div className="lg:col-span-3">
                <motion.div
                  key={selectedSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  <div className="flex items-center space-x-2">
                    <h3 className="text-xl font-semibold">{manualData[selectedSection].title}</h3>
                    <Badge variant="outline">
                      Section {selectedSection + 1}
                    </Badge>
                  </div>
                  
                  <div className="prose prose-sm max-w-none">
                    <div className="whitespace-pre-line text-muted-foreground leading-relaxed">
                      {manualData[selectedSection].content}
                    </div>
                  </div>

                  {/* Show images for first section - Fixed images based on prompt */}
                  {selectedSection === 0 && (
                    <div className="mt-6 space-y-4">
                      <h4 className="font-semibold">System Images</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <img
                            src={getCircuitImageFromPrompt(prompt)}
                            alt="Circuit Design"
                            className="w-full h-32 object-cover rounded border"
                          />
                          <p className="text-xs text-muted-foreground text-center">Circuit Schematic</p>
                        </div>
                        <div className="space-y-2">
                          <img
                            src={getCADImageFromPrompt(prompt)}
                            alt="CAD Model"
                            className="w-full h-32 object-cover rounded border"
                          />
                          <p className="text-xs text-muted-foreground text-center">3D CAD Model</p>
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Export Info */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Eye className="h-5 w-5" />
              <span>Export Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="font-medium text-blue-800 dark:text-blue-200">PDF Export</div>
                <div className="text-sm text-blue-600 dark:text-blue-300 mt-1">
                  Includes all sections with fixed circuit and CAD images based on project type
                </div>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="font-medium text-green-800 dark:text-green-200">Fixed Image Mapping</div>
                <div className="text-sm text-green-600 dark:text-green-300 mt-1">
                  Arduino LED Controller always gets CAD Model 1 and Circuit 3
                </div>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="font-medium text-purple-800 dark:text-purple-200">Consistent Design</div>
                <div className="text-sm text-purple-600 dark:text-purple-300 mt-1">
                  Same prompt always produces the same circuit and CAD images
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}