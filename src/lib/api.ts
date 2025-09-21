import { ComputeRequest, ComputeResult, CircuitData, CADData, CFDData, CodeFile, BOMItem, Risk, TestingMethod, UserManualSection } from '@/types';
import { getContextualCircuitImage, getRandomCircuitImage } from '@/server/mock/circuitImages';
import { generateOctopartBOM, promptToOctopartItems, OctopartBOMRow } from '@/lib/octopart';

// Function to generate context-aware mock data based on prompt
function generateContextualMockData(prompt: string): ComputeResult {
  const lowerPrompt = prompt.toLowerCase();
  const projectType = getProjectType(prompt);
  const keywords = extractKeywords(prompt);
  
  // Generate contextual circuit data with enhanced circuit images
  const circuitImage = getContextualCircuitImage(prompt);
  const circuits: CircuitData = {
    schematic: circuitImage.imageUrl,
    simulation: {
      voltage: generateRealisticVoltage(prompt),
      current: generateRealisticCurrent(prompt),
      time: [0, 1, 2, 3, 4, 5]
    }
  };

  // Generate contextual CAD data with real images
  const cad: CADData = {
    model3D: getCADImage(projectType, keywords),
    stepFileUrl: `/mock-files/${projectType.toLowerCase().replace(/\s+/g, '-')}-model.step`,
    dimensions: generateRealisticDimensions(prompt)
  };

  // Generate contextual CFD data with real images
  const cfd: CFDData = {
    preview: getCFDImage(projectType, keywords),
    metrics: generateRealisticCFDMetrics(prompt)
  };

  // Generate contextual code
  const workingCode: CodeFile[] = generateContextualCode(prompt);

  // Generate contextual BOM with Octopart integration
  const bom: BOMItem[] = generateContextualBOM(prompt);

  // Generate contextual risks
  const risks: Risk[] = generateContextualRisks(prompt);

  // Generate contextual testing
  const testing: TestingMethod[] = generateContextualTesting(prompt);

  // Generate contextual manual
  const userManual: UserManualSection[] = generateContextualManual(prompt);

  return {
    circuits,
    cad,
    cfd,
    workingCode,
    bom,
    risks,
    testing,
    userManual
  };
}

function extractKeywords(prompt: string): string[] {
  const keywords: string[] = [];
  const lowerPrompt = prompt.toLowerCase();
  
  // Technology keywords
  if (lowerPrompt.includes('arduino')) keywords.push('arduino');
  if (lowerPrompt.includes('raspberry pi') || lowerPrompt.includes('rpi')) keywords.push('raspberry-pi');
  if (lowerPrompt.includes('esp32') || lowerPrompt.includes('esp8266')) keywords.push('esp32');
  if (lowerPrompt.includes('bluetooth')) keywords.push('bluetooth');
  if (lowerPrompt.includes('wifi')) keywords.push('wifi');
  if (lowerPrompt.includes('iot')) keywords.push('iot');
  
  // Application keywords
  if (lowerPrompt.includes('monitoring')) keywords.push('monitoring');
  if (lowerPrompt.includes('control')) keywords.push('control');
  if (lowerPrompt.includes('automation')) keywords.push('automation');
  if (lowerPrompt.includes('sensor')) keywords.push('sensor');
  if (lowerPrompt.includes('actuator')) keywords.push('actuator');
  
  return keywords;
}

function getProjectType(prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  // More specific detection based on common engineering projects
  if (lowerPrompt.includes('temperature') && (lowerPrompt.includes('monitor') || lowerPrompt.includes('sensor'))) return 'Temperature Monitoring';
  if (lowerPrompt.includes('drone') || lowerPrompt.includes('quadcopter') || lowerPrompt.includes('uav')) return 'Drone System';
  if (lowerPrompt.includes('robot') && lowerPrompt.includes('arm')) return 'Robotic Arm';
  if (lowerPrompt.includes('robot') || lowerPrompt.includes('robotic')) return 'Robotic System';
  if (lowerPrompt.includes('solar') && (lowerPrompt.includes('panel') || lowerPrompt.includes('charge'))) return 'Solar Power System';
  if (lowerPrompt.includes('water') && lowerPrompt.includes('quality')) return 'Water Quality Monitor';
  if (lowerPrompt.includes('smart home') || lowerPrompt.includes('home automation')) return 'Smart Home System';
  if (lowerPrompt.includes('motor') && lowerPrompt.includes('control')) return 'Motor Control System';
  if (lowerPrompt.includes('led') || lowerPrompt.includes('lighting')) return 'LED Control System';
  if (lowerPrompt.includes('security') || lowerPrompt.includes('alarm')) return 'Security System';
  if (lowerPrompt.includes('weather') || lowerPrompt.includes('climate')) return 'Weather Station';
  if (lowerPrompt.includes('irrigation') || lowerPrompt.includes('watering')) return 'Irrigation System';
  
  return 'Engineering System';
}

function getCircuitImage(projectType: string, keywords: string[]): string {
  // Use the enhanced circuit image system
  const circuitImage = getRandomCircuitImage(projectType);
  return circuitImage.imageUrl;
}

function getCADImage(projectType: string, keywords: string[]): string {
  const baseUrl = 'https://images.unsplash.com/';
  
  if (projectType.includes('Temperature')) {
    return baseUrl + 'photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop'; // Electronic device 3D model
  }
  if (projectType.includes('Drone')) {
    return baseUrl + 'photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop'; // Drone 3D view
  }
  if (projectType.includes('Robotic Arm')) {
    return baseUrl + 'photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop'; // Robotic arm
  }
  if (projectType.includes('Solar')) {
    return baseUrl + 'photo-1509391366360-2e959784a276?w=400&h=300&fit=crop'; // Solar panel 3D
  }
  if (projectType.includes('Smart Home')) {
    return baseUrl + 'photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop'; // Smart device 3D
  }
  
  // Default 3D engineering model
  return baseUrl + 'photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop';
}

function getCFDImage(projectType: string, keywords: string[]): string {
  const baseUrl = 'https://images.unsplash.com/';
  
  if (projectType.includes('Temperature')) {
    return baseUrl + 'photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop'; // Heat simulation
  }
  if (projectType.includes('Drone')) {
    return baseUrl + 'photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop'; // Aerodynamic simulation
  }
  if (projectType.includes('Solar')) {
    return baseUrl + 'photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop'; // Thermal analysis
  }
  
  // Default CFD simulation
  return baseUrl + 'photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop';
}

function generateRealisticVoltage(prompt: string): number[] {
  const projectType = getProjectType(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract voltage from prompt if mentioned
  const voltageMatch = lowerPrompt.match(/(\d+\.?\d*)\s*v/);
  const baseVoltage = voltageMatch ? parseFloat(voltageMatch[1]) : getDefaultVoltage(projectType);
  
  // Generate realistic voltage curve
  return [
    0,
    baseVoltage * 0.8,
    baseVoltage,
    baseVoltage * 0.95,
    baseVoltage * 0.85,
    baseVoltage * 0.9
  ];
}

function generateRealisticCurrent(prompt: string): number[] {
  const projectType = getProjectType(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract current from prompt if mentioned
  const currentMatch = lowerPrompt.match(/(\d+\.?\d*)\s*(ma|a|amp)/);
  let baseCurrent = currentMatch ? parseFloat(currentMatch[1]) : getDefaultCurrent(projectType);
  
  // Convert mA to A if needed
  if (currentMatch && currentMatch[2] === 'ma') {
    baseCurrent = baseCurrent / 1000;
  }
  
  // Generate realistic current curve
  return [
    0,
    baseCurrent * 0.6,
    baseCurrent,
    baseCurrent * 0.9,
    baseCurrent * 0.7,
    baseCurrent * 0.8
  ];
}

function getDefaultVoltage(projectType: string): number {
  if (projectType.includes('Temperature')) return 3.3;
  if (projectType.includes('Drone')) return 11.1;
  if (projectType.includes('Solar')) return 18.5;
  if (projectType.includes('Motor')) return 24;
  if (projectType.includes('LED')) return 12;
  return 5;
}

function getDefaultCurrent(projectType: string): number {
  if (projectType.includes('Temperature')) return 0.05;
  if (projectType.includes('Drone')) return 2.5;
  if (projectType.includes('Solar')) return 1.2;
  if (projectType.includes('Motor')) return 5.5;
  if (projectType.includes('LED')) return 0.5;
  return 0.1;
}

function generateRealisticDimensions(prompt: string): { width: number; height: number; depth: number } {
  const projectType = getProjectType(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  // Try to extract dimensions from prompt
  const dimensionMatch = lowerPrompt.match(/(\d+)\s*x\s*(\d+)\s*x?\s*(\d+)?\s*(mm|cm|m)/);
  if (dimensionMatch) {
    const unit = dimensionMatch[4];
    let multiplier = 1;
    if (unit === 'cm') multiplier = 10;
    if (unit === 'm') multiplier = 1000;
    
    return {
      width: parseInt(dimensionMatch[1]) * multiplier,
      height: parseInt(dimensionMatch[2]) * multiplier,
      depth: dimensionMatch[3] ? parseInt(dimensionMatch[3]) * multiplier : 25
    };
  }
  
  // Default dimensions based on project type
  if (projectType.includes('Temperature')) return { width: 80, height: 60, depth: 25 };
  if (projectType.includes('Drone')) return { width: 350, height: 100, depth: 350 };
  if (projectType.includes('Robotic Arm')) return { width: 200, height: 400, depth: 150 };
  if (projectType.includes('Solar')) return { width: 1000, height: 50, depth: 600 };
  if (projectType.includes('Smart Home')) return { width: 120, height: 80, depth: 30 };
  
  return { width: 100, height: 50, depth: 25 };
}

function generateRealisticCFDMetrics(prompt: string): { maxStress: number; maxStrain: number; maxTemperature: number; safetyFactor: number } {
  const projectType = getProjectType(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  // Extract temperature from prompt if mentioned
  const tempMatch = lowerPrompt.match(/(\d+)\s*°?c/);
  const maxTemp = tempMatch ? parseInt(tempMatch[1]) + 20 : getDefaultMaxTemp(projectType);
  
  // Generate realistic metrics based on project type and extracted values
  if (projectType.includes('Temperature')) return { maxStress: 45.2, maxStrain: 0.0008, maxTemperature: maxTemp, safetyFactor: 3.2 };
  if (projectType.includes('Drone')) return { maxStress: 180.5, maxStrain: 0.0025, maxTemperature: 45.8, safetyFactor: 1.8 };
  if (projectType.includes('Robotic')) return { maxStress: 220.3, maxStrain: 0.0035, maxTemperature: 55.2, safetyFactor: 2.1 };
  if (projectType.includes('Solar')) return { maxStress: 95.7, maxStrain: 0.0012, maxTemperature: maxTemp, safetyFactor: 2.8 };
  
  return { maxStress: 150.5, maxStrain: 0.002, maxTemperature: maxTemp, safetyFactor: 2.1 };
}

function getDefaultMaxTemp(projectType: string): number {
  if (projectType.includes('Temperature')) return 65.3;
  if (projectType.includes('Solar')) return 75.4;
  if (projectType.includes('Motor')) return 85.3;
  return 55.0;
}

function generateContextualCode(prompt: string): CodeFile[] {
  const projectType = getProjectType(prompt);
  const keywords = extractKeywords(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  // Determine microcontroller based on prompt
  const microcontroller = keywords.includes('esp32') ? 'ESP32' : 
                         keywords.includes('raspberry-pi') ? 'Raspberry Pi' : 
                         'Arduino';
  
  const mainCode = `#!/usr/bin/env python3
"""
${projectType} Control System
Generated for: ${prompt.substring(0, 100)}${prompt.length > 100 ? '...' : ''}

Hardware: ${microcontroller}
Features: ${keywords.join(', ') || 'Basic control'}
"""

import time
import logging
from datetime import datetime
${keywords.includes('wifi') || keywords.includes('iot') ? 'import network\nimport urequests' : ''}
${keywords.includes('bluetooth') ? 'import bluetooth' : ''}

class ${projectType.replace(/\s+/g, '')}Controller:
    def __init__(self):
        self.status = "initialized"
        self.logger = logging.getLogger(__name__)
        self.start_time = datetime.now()
        ${generateInitializationCode(projectType, keywords)}
        
    def initialize(self):
        """Initialize the ${projectType.toLowerCase()} system."""
        self.logger.info("Initializing ${projectType.toLowerCase()} system...")
        ${generateSetupCode(projectType, keywords)}
        self.status = "ready"
        return True
        
    def ${generateMainFunction(projectType)}(self):
        """${getMainFunctionDescription(projectType)}"""
        self.logger.info("Starting ${projectType.toLowerCase()} operation...")
        self.status = "running"
        ${generateOperationCode(projectType, keywords)}
        
    def stop(self):
        """Stop the ${projectType.toLowerCase()} system."""
        self.logger.info("Stopping ${projectType.toLowerCase()} system...")
        self.status = "stopped"
        
    def get_status(self):
        """Get current system status."""
        return {
            "status": self.status,
            "uptime": (datetime.now() - self.start_time).total_seconds(),
            "timestamp": datetime.now().isoformat(),
            "project_type": "${projectType}",
            "hardware": "${microcontroller}"
        }

if __name__ == "__main__":
    controller = ${projectType.replace(/\s+/g, '')}Controller()
    controller.initialize()
    controller.${generateMainFunction(projectType)}()
    
    # Run demo
    time.sleep(2)
    print(f"System Status: {controller.get_status()}")
    
    controller.stop()
`;

  const configCode = `{
  "project": {
    "name": "${projectType}",
    "type": "${projectType.toLowerCase().replace(/\s+/g, '_')}",
    "version": "1.0.0",
    "description": "${prompt.substring(0, 150)}${prompt.length > 150 ? '...' : ''}",
    "created": "${new Date().toISOString()}"
  },
  "hardware": {
    "microcontroller": "${microcontroller}",
    "sensors": ${JSON.stringify(getRelevantSensors(prompt), null, 4)},
    "actuators": ${JSON.stringify(getRelevantActuators(prompt), null, 4)},
    "communication": "${getCommunicationMethod(keywords)}"
  },
  "settings": {
    "sampling_rate": ${getSamplingRate(projectType)},
    "timeout": 30000,
    "max_retries": 3,
    "debug_mode": true
  },
  "pins": ${JSON.stringify(generatePinConfiguration(projectType), null, 2)}
}`;

  return [
    {
      name: "main.py",
      content: mainCode,
      language: "python"
    },
    {
      name: "config.json",
      content: configCode,
      language: "json"
    }
  ];
}

function generateInitializationCode(projectType: string, keywords: string[]): string {
  let code = 'self.sensors = {}\n        self.actuators = {}';
  
  if (keywords.includes('wifi')) {
    code += '\n        self.wifi_connected = False';
  }
  if (projectType.includes('Temperature')) {
    code += '\n        self.temperature_threshold = 30.0';
  }
  if (projectType.includes('Motor')) {
    code += '\n        self.motor_speed = 0';
  }
  
  return code;
}

function generateSetupCode(projectType: string, keywords: string[]): string {
  let code = '# Initialize hardware components\n        ';
  
  if (keywords.includes('wifi')) {
    code += 'self.setup_wifi()\n        ';
  }
  if (projectType.includes('Temperature')) {
    code += 'self.setup_temperature_sensor()\n        ';
  }
  if (projectType.includes('Motor')) {
    code += 'self.setup_motor_control()\n        ';
  }
  
  return code + 'pass';
}

function generateMainFunction(projectType: string): string {
  if (projectType.includes('Monitor')) return 'start_monitoring';
  if (projectType.includes('Control')) return 'start_control';
  if (projectType.includes('System')) return 'start_system';
  return 'start_operation';
}

function getMainFunctionDescription(projectType: string): string {
  if (projectType.includes('Monitor')) return 'Start monitoring sensors and collecting data';
  if (projectType.includes('Control')) return 'Start control loop for system operation';
  return 'Start main system operation';
}

function generateOperationCode(projectType: string, keywords: string[]): string {
  if (projectType.includes('Temperature')) {
    return 'while self.status == "running":\n            temp = self.read_temperature()\n            if temp > self.temperature_threshold:\n                self.trigger_alert(temp)\n            time.sleep(1)';
  }
  if (projectType.includes('Motor')) {
    return 'self.motor_speed = 100\n        self.set_motor_speed(self.motor_speed)';
  }
  return 'pass  # Main operation logic here';
}

function getRelevantSensors(prompt: string): string[] {
  const sensors: string[] = [];
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('temperature')) sensors.push('DS18B20 Temperature Sensor');
  if (lowerPrompt.includes('humidity')) sensors.push('DHT22 Humidity Sensor');
  if (lowerPrompt.includes('pressure')) sensors.push('BMP280 Pressure Sensor');
  if (lowerPrompt.includes('motion') || lowerPrompt.includes('accelerometer')) sensors.push('MPU6050 IMU');
  if (lowerPrompt.includes('distance') || lowerPrompt.includes('ultrasonic')) sensors.push('HC-SR04 Ultrasonic');
  if (lowerPrompt.includes('light')) sensors.push('LDR Light Sensor');
  if (lowerPrompt.includes('water') || lowerPrompt.includes('ph')) sensors.push('pH Sensor');
  if (lowerPrompt.includes('gas') || lowerPrompt.includes('air')) sensors.push('MQ-135 Air Quality');
  if (lowerPrompt.includes('gps')) sensors.push('NEO-8M GPS Module');
  if (lowerPrompt.includes('camera')) sensors.push('OV2640 Camera Module');
  
  return sensors.length > 0 ? sensors : ['Generic Sensor'];
}

function getRelevantActuators(prompt: string): string[] {
  const actuators: string[] = [];
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('motor')) actuators.push('DC Motor');
  if (lowerPrompt.includes('servo')) actuators.push('SG90 Servo Motor');
  if (lowerPrompt.includes('led')) actuators.push('LED Strip');
  if (lowerPrompt.includes('pump')) actuators.push('Water Pump');
  if (lowerPrompt.includes('relay')) actuators.push('5V Relay Module');
  if (lowerPrompt.includes('buzzer') || lowerPrompt.includes('alarm')) actuators.push('Piezo Buzzer');
  if (lowerPrompt.includes('display')) actuators.push('OLED Display');
  
  return actuators;
}

function getCommunicationMethod(keywords: string[]): string {
  if (keywords.includes('wifi')) return 'WiFi';
  if (keywords.includes('bluetooth')) return 'Bluetooth';
  if (keywords.includes('iot')) return 'WiFi/IoT';
  return 'Serial';
}

function getSamplingRate(projectType: string): number {
  if (projectType.includes('Temperature')) return 1000;
  if (projectType.includes('Drone')) return 100;
  if (projectType.includes('Motor')) return 50;
  return 500;
}

function generatePinConfiguration(projectType: string): Record<string, number> {
  const pins: Record<string, number> = {};
  
  if (projectType.includes('Temperature')) {
    pins['temperature_sensor'] = 2;
    pins['led_indicator'] = 13;
  }
  if (projectType.includes('Motor')) {
    pins['motor_pwm'] = 9;
    pins['motor_dir'] = 8;
  }
  if (projectType.includes('LED')) {
    pins['led_data'] = 6;
  }
  
  return pins;
}

// Enhanced BOM generation with Octopart integration
async function generateContextualBOM(prompt: string): Promise<BOMItem[]> {
  try {
    // Try to use Octopart API for real BOM data
    const octopartItems = promptToOctopartItems(prompt);
    const octopartResult = await generateOctopartBOM(octopartItems);
    
    // Convert Octopart format to our BOM format
    return octopartResult.rows.map((row: OctopartBOMRow) => ({
      component: row.mpn !== 'NOT_FOUND' && row.mpn !== 'ERROR' ? `${row.manufacturer} ${row.mpn}` : row.desc,
      quantity: row.qty,
      price: row.best?.unitPrice || 0,
      supplier: row.best?.supplier || 'Unknown',
      partNumber: row.mpn
    }));
  } catch (error) {
    console.warn('Octopart API failed, using fallback BOM:', error);
    // Fallback to original mock BOM generation
    return generateFallbackBOM(prompt);
  }
}

function generateFallbackBOM(prompt: string): BOMItem[] {
  const projectType = getProjectType(prompt);
  const keywords = extractKeywords(prompt);
  const baseBOM: BOMItem[] = [];
  
  // Add microcontroller based on project complexity and keywords
  if (keywords.includes('esp32')) {
    baseBOM.push({ component: 'ESP32 DevKit V1', quantity: 1, price: 12.99, supplier: 'Espressif', partNumber: 'ESP32-WROOM-32' });
  } else if (keywords.includes('raspberry-pi')) {
    baseBOM.push({ component: 'Raspberry Pi 4B', quantity: 1, price: 75.00, supplier: 'Raspberry Pi Foundation', partNumber: 'RPI4-MODBP-4GB' });
  } else {
    baseBOM.push({ component: 'Arduino Uno R3', quantity: 1, price: 23.99, supplier: 'Arduino', partNumber: 'A000066' });
  }
  
  // Add sensors based on prompt
  const sensors = getRelevantSensors(prompt);
  sensors.forEach(sensor => {
    const price = getSensorPrice(sensor);
    baseBOM.push({
      component: sensor,
      quantity: 1,
      price: price,
      supplier: 'Adafruit',
      partNumber: `ADA-${Math.floor(Math.random() * 9000) + 1000}`
    });
  });
  
  // Add actuators based on prompt
  const actuators = getRelevantActuators(prompt);
  actuators.forEach(actuator => {
    const price = getActuatorPrice(actuator);
    baseBOM.push({
      component: actuator,
      quantity: 1,
      price: price,
      supplier: 'SparkFun',
      partNumber: `SEN-${Math.floor(Math.random() * 9000) + 1000}`
    });
  });
  
  // Add common components
  baseBOM.push(
    { component: 'Resistor 10kΩ (Pack of 10)', quantity: 1, price: 1.50, supplier: 'Mouser', partNumber: 'CFR-25JB-52-10K' },
    { component: 'Capacitor 100µF', quantity: 2, price: 0.25, supplier: 'Digi-Key', partNumber: 'ECA-1HM101' },
    { component: 'Jumper Wires (M-M)', quantity: 1, price: 3.95, supplier: 'Adafruit', partNumber: '758' },
    { component: 'Breadboard 830 tie-points', quantity: 1, price: 5.95, supplier: 'Adafruit', partNumber: '64' }
  );
  
  return baseBOM;
}

function getSensorPrice(sensor: string): number {
  const prices: Record<string, number> = {
    'DS18B20 Temperature Sensor': 3.95,
    'DHT22 Humidity Sensor': 9.95,
    'BMP280 Pressure Sensor': 9.95,
    'MPU6050 IMU': 6.95,
    'HC-SR04 Ultrasonic': 3.95,
    'LDR Light Sensor': 0.95,
    'pH Sensor': 24.95,
    'MQ-135 Air Quality': 5.95,
    'NEO-8M GPS Module': 19.95,
    'OV2640 Camera Module': 12.95
  };
  return prices[sensor] || 7.95;
}

function getActuatorPrice(actuator: string): number {
  const prices: Record<string, number> = {
    'DC Motor': 4.95,
    'SG90 Servo Motor': 2.95,
    'LED Strip': 12.95,
    'Water Pump': 8.95,
    '5V Relay Module': 3.95,
    'Piezo Buzzer': 1.50,
    'OLED Display': 14.95
  };
  return prices[actuator] || 5.95;
}

function generateContextualRisks(prompt: string): Risk[] {
  const projectType = getProjectType(prompt);
  const lowerPrompt = prompt.toLowerCase();
  const risks: Risk[] = [];
  
  // Add project-specific risks based on actual prompt content
  if (projectType.includes('Temperature')) {
    risks.push({
      id: '1',
      description: 'Sensor calibration drift affecting accuracy over time',
      severity: 'medium',
      mitigation: 'Implement periodic calibration checks and sensor redundancy',
      probability: 0.3
    });
    
    if (lowerPrompt.includes('alert') || lowerPrompt.includes('alarm')) {
      risks.push({
        id: '2',
        description: 'False alarms due to sensor noise or interference',
        severity: 'low',
        mitigation: 'Add signal filtering and confirmation delays',
        probability: 0.25
      });
    }
  }
  
  if (projectType.includes('Drone')) {
    risks.push({
      id: '1',
      description: 'Loss of communication during flight operation',
      severity: 'critical',
      mitigation: 'Implement fail-safe return-to-home functionality',
      probability: 0.15
    });
    
    risks.push({
      id: '2',
      description: 'Battery failure or unexpected power loss',
      severity: 'high',
      mitigation: 'Use battery monitoring and low-voltage landing protocols',
      probability: 0.2
    });
  }
  
  if (projectType.includes('Solar')) {
    risks.push({
      id: '1',
      description: 'Weather-related performance degradation',
      severity: 'medium',
      mitigation: 'Design weatherproof enclosure and implement weather monitoring',
      probability: 0.4
    });
  }
  
  if (lowerPrompt.includes('water') || lowerPrompt.includes('outdoor')) {
    risks.push({
      id: '3',
      description: 'Water damage to electronic components',
      severity: 'high',
      mitigation: 'Use IP65+ rated enclosures and waterproof connectors',
      probability: 0.3
    });
  }
  
  // Add common risks
  risks.push(
    {
      id: '4',
      description: 'Power supply voltage fluctuation or instability',
      severity: 'medium',
      mitigation: 'Implement voltage regulation and power filtering',
      probability: 0.2
    },
    {
      id: '5',
      description: 'EMI interference affecting sensor readings',
      severity: 'low',
      mitigation: 'Add proper shielding and grounding techniques',
      probability: 0.15
    }
  );
  
  return risks;
}

function generateContextualTesting(prompt: string): TestingMethod[] {
  const projectType = getProjectType(prompt);
  const lowerPrompt = prompt.toLowerCase();
  
  const tests: TestingMethod[] = [
    {
      id: '1',
      title: `${projectType} Functional Verification`,
      procedure: [
        'Connect all components according to the provided schematic',
        'Power on the system and verify proper initialization sequence',
        'Test primary functionality as specified in requirements',
        'Verify all sensor readings are within expected ranges',
        'Test communication interfaces and data logging capabilities',
        'Validate user interface and control mechanisms'
      ],
      expectedResults: `System initializes properly and all ${projectType.toLowerCase()} functions operate within design specifications`,
      equipment: ['Digital Multimeter', 'Oscilloscope', 'Power Supply', 'Logic Analyzer']
    }
  ];
  
  // Add specific tests based on project type
  if (projectType.includes('Temperature')) {
    tests.push({
      id: '2',
      title: 'Temperature Calibration Test',
      procedure: [
        'Use calibrated reference thermometer',
        'Test at multiple temperature points (0°C, 25°C, 50°C)',
        'Compare sensor readings with reference values',
        'Adjust calibration parameters if needed',
        'Verify alert thresholds trigger correctly'
      ],
      expectedResults: 'Temperature readings accurate within ±0.5°C across operating range',
      equipment: ['Calibrated Thermometer', 'Temperature Chamber', 'Ice Bath']
    });
  }
  
  if (projectType.includes('Motor')) {
    tests.push({
      id: '2',
      title: 'Motor Control Performance Test',
      procedure: [
        'Test motor startup and shutdown sequences',
        'Verify speed control accuracy at different setpoints',
        'Test emergency stop functionality',
        'Measure current consumption under various loads',
        'Verify protection circuits activate correctly'
      ],
      expectedResults: 'Motor responds accurately to control signals with <2% speed error',
      equipment: ['Tachometer', 'Current Probe', 'Variable Load', 'Safety Barriers']
    });
  }
  
  // Environmental testing
  tests.push({
    id: '3',
    title: 'Environmental Stress Testing',
    procedure: [
      'Set system to operational mode',
      'Expose to temperature variations (-10°C to 60°C)',
      'Test humidity resistance (up to 85% RH)',
      'Verify operation under vibration conditions',
      'Monitor for performance degradation or failures',
      'Test recovery after environmental stress'
    ],
    expectedResults: 'System maintains functionality across all environmental conditions',
    equipment: ['Environmental Chamber', 'Vibration Table', 'Data Logger', 'Humidity Generator']
  });
  
  return tests;
}

function generateContextualManual(prompt: string): UserManualSection[] {
  const projectType = getProjectType(prompt);
  const keywords = extractKeywords(prompt);
  
  return [
    {
      title: 'Introduction',
      content: `Welcome to your ${projectType}!\n\nThis system was specifically designed based on your requirements: "${prompt}"\n\nThis comprehensive manual will guide you through setup, operation, troubleshooting, and maintenance procedures. Please read all sections carefully before operating the system.`,
      images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=200&fit=crop']
    },
    {
      title: 'System Overview',
      content: `Your ${projectType} includes the following key components:\n\n• ${keywords.includes('esp32') ? 'ESP32' : keywords.includes('raspberry-pi') ? 'Raspberry Pi' : 'Arduino'} microcontroller for processing and control\n• Sensor array for data collection and monitoring\n• ${getCommunicationMethod(keywords)} communication interface\n• Power management and regulation system\n• User interface for monitoring and configuration\n• Safety and protection circuits\n\nThe system is designed to ${getSystemPurpose(projectType, prompt)}.`,
      images: ['https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=300&h=200&fit=crop']
    },
    {
      title: 'Installation & Setup',
      content: `Follow these steps to install your ${projectType}:\n\n1. **Unpacking**: Carefully unpack all components and verify against the included BOM\n2. **Location**: Choose an appropriate installation location considering environmental factors\n3. **Mounting**: Secure the main unit using the provided mounting hardware\n4. **Connections**: Connect all sensors and actuators according to the wiring diagram\n5. **Power**: Connect the power adapter (verify voltage: ${getDefaultVoltage(projectType)}V)\n6. **Software**: Install any required software on your computer or mobile device\n7. **Configuration**: Run the initial setup wizard to configure system parameters\n8. **Testing**: Perform initial system test to verify proper operation\n\n⚠️ **Safety Note**: Ensure power is disconnected during installation.`,
      images: ['https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=300&h=200&fit=crop']
    },
    {
      title: 'Operation',
      content: `To operate your ${projectType}:\n\n**Startup Procedure:**\n1. Power on the system using the main switch\n2. Wait for initialization sequence (LED indicators will show status)\n3. The system will automatically begin ${getOperationMode(projectType)}\n4. ${keywords.includes('wifi') ? 'Connect to the web interface using the displayed IP address' : 'Monitor status via the display panel'}\n\n**Normal Operation:**\n• The system operates autonomously once configured\n• Monitor real-time data and system status regularly\n• Configure alerts and thresholds as needed for your application\n• ${getSpecificOperationInstructions(projectType)}\n\n**Shutdown Procedure:**\n1. Save any important data or configurations\n2. Use the proper shutdown sequence (do not just disconnect power)\n3. Wait for all indicators to turn off before disconnecting power`,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop']
    },
    {
      title: 'Troubleshooting',
      content: `Common issues and solutions:\n\n**System Won't Start:**\n• Check power connections and verify voltage\n• Ensure all fuses are intact\n• Verify power adapter specifications\n\n**No Sensor Readings:**\n• Check sensor connections and wiring\n• Verify sensor power supply\n• Run sensor calibration procedure\n\n**Communication Errors:**\n• ${keywords.includes('wifi') ? 'Check WiFi network settings and password' : 'Verify serial cable connections'}\n• Restart communication interface\n• Check for interference sources\n\n**Erratic Behavior:**\n• Restart system using proper shutdown/startup procedure\n• Check for electromagnetic interference\n• Verify all connections are secure\n• Update firmware if available\n\n**${getProjectSpecificTroubleshooting(projectType)}**\n\n**Technical Support:**\nFor additional assistance, contact technical support with:\n• System serial number\n• Detailed description of the issue\n• Any error messages displayed\n• Recent changes to the system`
    }
  ];
}

function getSystemPurpose(projectType: string, prompt: string): string {
  const lowerPrompt = prompt.toLowerCase();
  
  if (lowerPrompt.includes('monitor')) return 'continuously monitor and log data from connected sensors';
  if (lowerPrompt.includes('control')) return 'provide automated control based on sensor inputs and user settings';
  if (lowerPrompt.includes('alert') || lowerPrompt.includes('alarm')) return 'monitor conditions and provide alerts when thresholds are exceeded';
  
  return 'automate and optimize system operation based on your specific requirements';
}

function getOperationMode(projectType: string): string {
  if (projectType.includes('Monitor')) return 'monitoring and data collection';
  if (projectType.includes('Control')) return 'automated control operations';
  return 'normal operation mode';
}

function getSpecificOperationInstructions(projectType: string): string {
  if (projectType.includes('Temperature')) return 'Set temperature thresholds and alert preferences in the configuration menu';
  if (projectType.includes('Motor')) return 'Use the speed control interface to adjust motor parameters';
  if (projectType.includes('Solar')) return 'Monitor power generation and battery status regularly';
  return 'Refer to the configuration section for system-specific settings';
}

function getProjectSpecificTroubleshooting(projectType: string): string {
  if (projectType.includes('Temperature')) {
    return '**Temperature Reading Issues:**\n• Verify sensor is not in direct sunlight or heat source\n• Check for proper thermal contact\n• Allow time for thermal equilibrium';
  }
  if (projectType.includes('Motor')) {
    return '**Motor Control Issues:**\n• Check motor power supply and connections\n• Verify motor driver is not overheating\n• Test with reduced load first';
  }
  if (projectType.includes('Solar')) {
    return '**Solar System Issues:**\n• Check panel connections and orientation\n• Verify battery voltage and condition\n• Clean solar panels if performance is reduced';
  }
  return '';
}

// Simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const computeAPI = {
  async compute(request: ComputeRequest): Promise<ComputeResult> {
    // Simulate processing time
    await delay(2000 + Math.random() * 3000);
    
    // Generate contextual mock data based on the prompt
    return generateContextualMockData(request.prompt);
  }
};

// Individual API services (mocked with contextual data)
export const fluxAPI = {
  async generateCircuit(prompt: string): Promise<CircuitData> {
    await delay(1500);
    return generateContextualMockData(prompt).circuits!;
  }
};

export const zooAPI = {
  async generateCAD(prompt: string): Promise<CADData> {
    await delay(2000);
    return generateContextualMockData(prompt).cad!;
  }
};

export const simScaleAPI = {
  async runCFD(prompt: string): Promise<CFDData> {
    await delay(3000);
    return generateContextualMockData(prompt).cfd!;
  }
};

export const codegenAPI = {
  async generateCode(prompt: string): Promise<CodeFile[]> {
    await delay(1800);
    return generateContextualMockData(prompt).workingCode!;
  }
};

// Enhanced Octopart API integration
export const octopartAPI = {
  async generateBOM(prompt: string): Promise<BOMItem[]> {
    await delay(1200);
    return await generateContextualBOM(prompt);
  }
};

export const geminiAPI = {
  async generateRisks(prompt: string): Promise<Risk[]> {
    await delay(1000);
    return generateContextualMockData(prompt).risks!;
  },
  
  async generateTesting(prompt: string): Promise<TestingMethod[]> {
    await delay(1500);
    return generateContextualMockData(prompt).testing!;
  },
  
  async generateManual(prompt: string): Promise<UserManualSection[]> {
    await delay(2000);
    return generateContextualMockData(prompt).userManual!;
  }
};