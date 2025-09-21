import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BOMItem } from '@/types';
import { Package, Download, ExternalLink, Search, ArrowUpDown } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';

interface BOMProps {
  data?: BOMItem[];
  isLoading: boolean;
  prompt?: string;
}

// Hardcoded dummy BOM data that works regardless of API
const generateDummyBOM = (prompt?: string): BOMItem[] => {
  const lowerPrompt = prompt?.toLowerCase() || '';
  
  const baseBOM: BOMItem[] = [
    { component: 'Power Supply Module', quantity: 1, price: 15.99, supplier: 'Mouser', partNumber: 'PS-5V-2A' },
    { component: 'Resistor 10kΩ (Pack of 10)', quantity: 1, price: 1.50, supplier: 'Digi-Key', partNumber: 'CFR-25JB-52-10K' },
    { component: 'Capacitor 100µF', quantity: 2, price: 0.25, supplier: 'Digi-Key', partNumber: 'ECA-1HM101' },
    { component: 'Jumper Wires (M-M)', quantity: 1, price: 3.95, supplier: 'Adafruit', partNumber: '758' },
    { component: 'Breadboard 830 tie-points', quantity: 1, price: 5.95, supplier: 'Adafruit', partNumber: '64' },
    { component: 'LED Red 5mm', quantity: 5, price: 0.15, supplier: 'SparkFun', partNumber: 'LED-RED-5MM' },
  ];

  // Add microcontroller based on prompt
  if (lowerPrompt.includes('esp32')) {
    baseBOM.unshift({ component: 'ESP32 DevKit V1', quantity: 1, price: 12.99, supplier: 'Espressif', partNumber: 'ESP32-WROOM-32' });
  } else if (lowerPrompt.includes('raspberry')) {
    baseBOM.unshift({ component: 'Raspberry Pi 4B', quantity: 1, price: 75.00, supplier: 'Raspberry Pi Foundation', partNumber: 'RPI4-MODBP-4GB' });
  } else if (lowerPrompt.includes('arduino')) {
    baseBOM.unshift({ component: 'Arduino Uno R3', quantity: 1, price: 23.99, supplier: 'Arduino', partNumber: 'A000066' });
  }

  // Add sensors based on prompt
  if (lowerPrompt.includes('temperature')) {
    baseBOM.push({ component: 'DS18B20 Temperature Sensor', quantity: 1, price: 3.95, supplier: 'Adafruit', partNumber: 'ADA-381' });
  }
  if (lowerPrompt.includes('humidity')) {
    baseBOM.push({ component: 'DHT22 Humidity Sensor', quantity: 1, price: 9.95, supplier: 'Adafruit', partNumber: 'ADA-385' });
  }
  if (lowerPrompt.includes('motor')) {
    baseBOM.push({ component: 'DC Motor 6V', quantity: 1, price: 4.95, supplier: 'SparkFun', partNumber: 'ROB-11696' });
    baseBOM.push({ component: 'L298N Motor Driver', quantity: 1, price: 6.95, supplier: 'SparkFun', partNumber: 'ROB-14451' });
  }
  if (lowerPrompt.includes('led') || lowerPrompt.includes('light')) {
    baseBOM.push({ component: 'WS2812B LED Strip 1m', quantity: 1, price: 12.95, supplier: 'Adafruit', partNumber: 'ADA-1376' });
  }

  return baseBOM;
};

export default function BOM({ data, isLoading, prompt }: BOMProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<keyof BOMItem | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Use provided data or generate dummy data
  const bomData = data && data.length > 0 ? data : generateDummyBOM(prompt);

  // Filter and sort data
  const filteredAndSortedData = useMemo(() => {
    let filtered = bomData.filter(item =>
      item.component.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.partNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortField) {
      filtered.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];
        
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        const aStr = String(aValue).toLowerCase();
        const bStr = String(bValue).toLowerCase();
        
        if (sortDirection === 'asc') {
          return aStr.localeCompare(bStr);
        } else {
          return bStr.localeCompare(aStr);
        }
      });
    }

    return filtered;
  }, [bomData, searchTerm, sortField, sortDirection]);

  const handleSort = (field: keyof BOMItem) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleExportBOM = () => {
    const csvContent = [
      ['MPN', 'Description', 'Qty', 'Price', 'Supplier', 'Total'],
      ...filteredAndSortedData.map(item => [
        item.partNumber,
        item.component,
        item.quantity.toString(),
        `$${item.price.toFixed(2)}`,
        item.supplier,
        `$${(item.quantity * item.price).toFixed(2)}`
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'bill-of-materials.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span>Generating bill of materials...</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-muted rounded w-1/3"></div>
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-12 bg-muted rounded"></div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalCost = filteredAndSortedData.reduce((sum, item) => sum + (item.quantity * item.price), 0);

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
                <Package className="h-5 w-5" />
                <span>Bill of Materials</span>
                <Badge variant="secondary">
                  {filteredAndSortedData.length} items
                </Badge>
              </CardTitle>
              <Button onClick={handleExportBOM} className="flex items-center space-x-2">
                <Download className="h-4 w-4" />
                <span>Export CSV</span>
              </Button>
            </div>
            
            {/* Search */}
            <div className="flex items-center space-x-2 mt-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search components, part numbers, or suppliers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('partNumber')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>MPN</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('component')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Description</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-center cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('quantity')}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>Qty</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-right cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('price')}
                  >
                    <div className="flex items-center justify-end space-x-1">
                      <span>Price</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-muted/50"
                    onClick={() => handleSort('supplier')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Supplier</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedData.map((item, index) => (
                  <motion.tr
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="hover:bg-muted/50"
                  >
                    <TableCell className="font-mono text-sm">{item.partNumber}</TableCell>
                    <TableCell className="font-medium">{item.component}</TableCell>
                    <TableCell className="text-center">{item.quantity}</TableCell>
                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{item.supplier}</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      ${(item.quantity * item.price).toFixed(2)}
                    </TableCell>
                    <TableCell>
                      <Button size="sm" variant="ghost">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </motion.tr>
                ))}
                {/* Total Row */}
                <TableRow className="border-t-2 bg-muted/30 font-semibold">
                  <TableCell colSpan={5} className="text-right">
                    <strong>Total Project Cost:</strong>
                  </TableCell>
                  <TableCell className="text-right text-lg">
                    <strong>${totalCost.toFixed(2)}</strong>
                  </TableCell>
                  <TableCell></TableCell>
                </TableRow>
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
            <CardTitle>Cost Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg text-center">
                <div className="text-sm text-blue-600 font-medium">Total Items</div>
                <div className="text-2xl font-bold text-blue-800">{filteredAndSortedData.length}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-green-600 font-medium">Total Quantity</div>
                <div className="text-2xl font-bold text-green-800">
                  {filteredAndSortedData.reduce((sum, item) => sum + item.quantity, 0)}
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg text-center">
                <div className="text-sm text-purple-600 font-medium">Suppliers</div>
                <div className="text-2xl font-bold text-purple-800">
                  {new Set(filteredAndSortedData.map(item => item.supplier)).size}
                </div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <div className="text-sm text-orange-600 font-medium">Total Cost</div>
                <div className="text-2xl font-bold text-orange-800">
                  ${totalCost.toFixed(2)}
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <div className="text-sm space-y-1">
                <p><strong>Cost Breakdown:</strong></p>
                <p>• Components: ${totalCost.toFixed(2)} (100%)</p>
                <p>• Estimated shipping: ${(totalCost * 0.1).toFixed(2)} (10%)</p>
                <p>• Total project cost: ${(totalCost * 1.1).toFixed(2)}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}