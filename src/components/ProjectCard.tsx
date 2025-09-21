import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Project } from '@/types';
import { Calendar, Zap, Eye } from 'lucide-react';
import { motion } from 'framer-motion';
import { StoredProject } from '@/lib/projectStorage';

interface ProjectCardProps {
  project: Project | StoredProject;
  onClick: (id: string) => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'active':
        return '🔄';
      case 'draft':
        return '📝';
      default:
        return '❓';
    }
  };

  // Check if this is a StoredProject with circuit image
  const storedProject = project as StoredProject;
  const hasCircuitImage = storedProject.circuitImage;

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white/80 backdrop-blur-sm"
        onClick={() => onClick(project.id)}
      >
        {/* Circuit Image Header */}
        {hasCircuitImage && (
          <div className="relative h-32 overflow-hidden rounded-t-lg">
            <img
              src={storedProject.circuitImage}
              alt={`${project.title} circuit`}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="bg-white/90 text-gray-700">
                <Eye className="h-3 w-3 mr-1" />
                Preview
              </Badge>
            </div>
          </div>
        )}

        <CardHeader className={hasCircuitImage ? 'pb-2' : 'pb-4'}>
          <div className="flex justify-between items-start">
            <CardTitle className="text-lg font-semibold line-clamp-2 flex-1">
              {project.title}
            </CardTitle>
            <Badge className={`ml-2 ${getStatusColor(project.status)} border`}>
              <span className="mr-1">{getStatusIcon(project.status)}</span>
              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          {project.description && (
            <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
              {project.description}
            </p>
          )}
          
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center space-x-1">
              <Calendar className="h-3 w-3" />
              <span>{new Date(project.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Zap className="h-3 w-3" />
              <span>Engineering</span>
            </div>
          </div>

          {/* Show additional info for stored projects */}
          {storedProject.prompt && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <p className="text-xs text-muted-foreground">
                <span className="font-medium">Requirements:</span> {storedProject.prompt.substring(0, 80)}
                {storedProject.prompt.length > 80 ? '...' : ''}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}