import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeFile } from '@/types';
import { Code, File, Download, Copy, Check } from 'lucide-react';
import { motion } from 'framer-motion';

interface WorkingCodeProps {
  data?: CodeFile[];
  isLoading: boolean;
}

export default function WorkingCode({ data, isLoading }: WorkingCodeProps) {
  const [selectedFile, setSelectedFile] = useState<number>(0);
  const [copiedFile, setCopiedFile] = useState<number | null>(null);

  const handleCopyCode = async (code: string, index: number) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedFile(index);
      setTimeout(() => setCopiedFile(null), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const handleDownloadFile = (file: CodeFile) => {
    const blob = new Blob([file.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const getLanguageColor = (language: string) => {
    const colors: Record<string, string> = {
      python: 'bg-blue-500',
      javascript: 'bg-yellow-500',
      typescript: 'bg-blue-600',
      json: 'bg-green-500',
      html: 'bg-orange-500',
      css: 'bg-purple-500',
      cpp: 'bg-red-500',
      java: 'bg-red-600'
    };
    return colors[language.toLowerCase()] || 'bg-gray-500';
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Generating code...</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="h-64 bg-muted rounded-lg"></div>
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
            <Code className="h-5 w-5" />
            <span>Working Code</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No code generated yet. Run the command prompt to generate working code.</p>
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
              <Code className="h-5 w-5" />
              <span>Working Code</span>
              <Badge variant="secondary">Python Generated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              {/* File Tree */}
              <div className="w-64 border-r pr-4">
                <h4 className="font-medium mb-3 text-sm">Project Files</h4>
                <div className="space-y-1">
                  {data.map((file, index) => (
                    <motion.button
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setSelectedFile(index)}
                      className={`w-full text-left p-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
                        selectedFile === index 
                          ? 'bg-primary text-primary-foreground' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      <File className="h-4 w-4" />
                      <span className="text-sm truncate">{file.name}</span>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${getLanguageColor(file.language)} text-white border-none`}
                      >
                        {file.language}
                      </Badge>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Code Viewer */}
              <div className="flex-1">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-sm">
                    {data[selectedFile]?.name}
                  </h4>
                  <div className="flex space-x-2">
                    <Button
                      onClick={() => handleCopyCode(data[selectedFile].content, selectedFile)}
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      {copiedFile === selectedFile ? (
                        <Check className="h-4 w-4" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                      <span>{copiedFile === selectedFile ? 'Copied!' : 'Copy'}</span>
                    </Button>
                    <Button
                      onClick={() => handleDownloadFile(data[selectedFile])}
                      size="sm"
                      variant="outline"
                      className="flex items-center space-x-1"
                    >
                      <Download className="h-4 w-4" />
                      <span>Download</span>
                    </Button>
                  </div>
                </div>
                
                <div className="relative">
                  <pre className="bg-muted p-4 rounded-lg overflow-auto max-h-96 text-sm">
                    <code>{data[selectedFile]?.content}</code>
                  </pre>
                </div>
              </div>
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
            <CardTitle>Code Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-blue-600 font-medium">Total Files</div>
                <div className="text-2xl font-bold text-blue-800">{data.length}</div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-green-600 font-medium">Lines of Code</div>
                <div className="text-2xl font-bold text-green-800">
                  {data.reduce((total, file) => total + file.content.split('\n').length, 0)}
                </div>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-purple-600 font-medium">Languages</div>
                <div className="text-2xl font-bold text-purple-800">
                  {new Set(data.map(file => file.language)).size}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <div className="text-sm">
                <strong>Generated Features:</strong> Control system, configuration management, 
                error handling, logging, and modular architecture ready for deployment.
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}