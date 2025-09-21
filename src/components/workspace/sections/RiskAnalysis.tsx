import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Risk } from '@/types';
import { AlertTriangle, Shield, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface RiskAnalysisProps {
  data?: Risk[];
  isLoading: boolean;
}

const severityColors = {
  low: 'bg-green-500',
  medium: 'bg-yellow-500',
  high: 'bg-orange-500',
  critical: 'bg-red-500'
};

const severityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical'
};

export default function RiskAnalysis({ data, isLoading }: RiskAnalysisProps) {
  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Analyzing risks...</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 bg-muted rounded"></div>
                ))}
              </div>
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
            <AlertTriangle className="h-5 w-5" />
            <span>Risk Analysis</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No risk analysis available. Run the command prompt to generate risk assessment.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const riskCounts = data.reduce((acc, risk) => {
    acc[risk.severity] = (acc[risk.severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const averageRisk = data.reduce((sum, risk) => sum + risk.probability, 0) / data.length;

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
              <AlertTriangle className="h-5 w-5" />
              <span>Risk Analysis</span>
              <Badge variant="secondary">Gemini AI Assessment</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Risk Description</TableHead>
                  <TableHead>Severity</TableHead>
                  <TableHead>Probability</TableHead>
                  <TableHead>Mitigation Strategy</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.map((risk, index) => (
                  <motion.tr
                    key={risk.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-medium max-w-xs">
                      {risk.description}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`${severityColors[risk.severity]} text-white`}
                      >
                        {severityLabels[risk.severity]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium">
                          {(risk.probability * 100).toFixed(0)}%
                        </div>
                        <Progress 
                          value={risk.probability * 100} 
                          className="w-16 h-2"
                        />
                      </div>
                    </TableCell>
                    <TableCell className="max-w-md">
                      <div className="text-sm text-muted-foreground">
                        {risk.mitigation}
                      </div>
                    </TableCell>
                  </motion.tr>
                ))}
              </TableBody>
            </Table>
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
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Risk Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-medium">Risk Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(severityLabels).map(([key, label]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${severityColors[key as keyof typeof severityColors]}`}></div>
                        <span className="text-sm">{label}</span>
                      </div>
                      <Badge variant="outline">
                        {riskCounts[key] || 0}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Risk Metrics</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-blue-600 font-medium">Total Risks</div>
                    <div className="text-2xl font-bold text-blue-800">{data.length}</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="text-sm text-orange-600 font-medium">Average Probability</div>
                    <div className="text-2xl font-bold text-orange-800">
                      {(averageRisk * 100).toFixed(0)}%
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-600 font-medium">High/Critical Risks</div>
                    <div className="text-2xl font-bold text-red-800">
                      {(riskCounts.high || 0) + (riskCounts.critical || 0)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-muted rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-5 w-5 text-blue-500 mt-0.5" />
                <div className="text-sm">
                  <strong>Risk Assessment Summary:</strong>
                  <p className="mt-1 text-muted-foreground">
                    {riskCounts.critical > 0 && "Critical risks identified - immediate attention required. "}
                    {riskCounts.high > 0 && "High-priority risks need mitigation planning. "}
                    {(riskCounts.critical || 0) + (riskCounts.high || 0) === 0 && "Risk profile is manageable with standard precautions. "}
                    Regular monitoring and review of mitigation strategies recommended.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}