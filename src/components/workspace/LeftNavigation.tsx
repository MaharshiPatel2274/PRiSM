import { cn } from '@/lib/utils';
import { SectionType } from '@/types';
import { 
  Terminal, 
  Zap, 
  Box, 
  Wind, 
  Code, 
  Package, 
  AlertTriangle, 
  TestTube, 
  BookOpen 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface LeftNavigationProps {
  activeSection: SectionType;
  onSectionChange: (section: SectionType) => void;
}

const navigationItems = [
  {
    id: 'command-prompt' as SectionType,
    label: 'Command Prompt',
    icon: Terminal,
    description: 'Source of truth'
  },
  {
    id: 'circuits' as SectionType,
    label: 'Circuits',
    icon: Zap,
    description: 'Schematics & simulation'
  },
  {
    id: 'cad' as SectionType,
    label: 'CAD',
    icon: Box,
    description: '3D models & files'
  },
  {
    id: 'cfd' as SectionType,
    label: 'CFD/Simulations',
    icon: Wind,
    description: 'Fluid dynamics'
  },
  {
    id: 'working-code' as SectionType,
    label: 'Working Code',
    icon: Code,
    description: 'Generated code'
  },
  {
    id: 'bom' as SectionType,
    label: 'BOM',
    icon: Package,
    description: 'Bill of materials'
  },
  {
    id: 'risk-analysis' as SectionType,
    label: 'Risk Analysis',
    icon: AlertTriangle,
    description: 'Risk assessment'
  },
  {
    id: 'testing-methods' as SectionType,
    label: 'Testing Methods',
    icon: TestTube,
    description: 'Test procedures'
  },
  {
    id: 'user-manual' as SectionType,
    label: 'User Manual',
    icon: BookOpen,
    description: 'Documentation'
  }
];

export default function LeftNavigation({ activeSection, onSectionChange }: LeftNavigationProps) {
  return (
    <div className="w-64 bg-card border-r border-border h-full sticky top-0">
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-4">Workspace</h2>
        <nav className="space-y-2">
          {navigationItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <motion.button
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                onClick={() => onSectionChange(item.id)}
                className={cn(
                  "w-full text-left p-3 rounded-lg transition-colors duration-200 group",
                  isActive 
                    ? "bg-primary text-primary-foreground" 
                    : "hover:bg-muted"
                )}
              >
                <div className="flex items-center space-x-3">
                  <Icon className={cn(
                    "h-5 w-5",
                    isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground"
                  )} />
                  <div className="flex-1 min-w-0">
                    <div className={cn(
                      "font-medium text-sm",
                      isActive ? "text-primary-foreground" : "text-foreground"
                    )}>
                      {item.label}
                    </div>
                    <div className={cn(
                      "text-xs truncate",
                      isActive ? "text-primary-foreground/80" : "text-muted-foreground"
                    )}>
                      {item.description}
                    </div>
                  </div>
                </div>
              </motion.button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}