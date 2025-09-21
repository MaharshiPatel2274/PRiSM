// Enhanced circuit images collection with 8 high-quality circuit images
export interface CircuitImage {
  id: string;
  title: string;
  imageUrl: string;
  description: string;
  components: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
}

export const CIRCUIT_IMAGES: CircuitImage[] = [
  {
    id: 'circuit_1',
    title: 'Arduino Temperature Monitor',
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop&auto=format',
    description: 'Basic temperature monitoring circuit with Arduino and DS18B20 sensor',
    components: ['Arduino Uno', 'DS18B20', 'LED', 'Resistors', 'Breadboard'],
    complexity: 'beginner'
  },
  {
    id: 'circuit_2',
    title: 'ESP32 IoT Control Board',
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop&auto=format',
    description: 'WiFi-enabled control system with multiple sensors and actuators',
    components: ['ESP32', 'Relay Module', 'OLED Display', 'Sensors', 'Power Supply'],
    complexity: 'intermediate'
  },
  {
    id: 'circuit_3',
    title: 'Motor Control Circuit',
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop&auto=format',
    description: 'H-bridge motor driver circuit with speed control and direction switching',
    components: ['L298N Driver', 'DC Motors', 'Arduino', 'Potentiometer', 'Power Supply'],
    complexity: 'intermediate'
  },
  {
    id: 'circuit_4',
    title: 'Smart Home Automation Hub',
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop&auto=format',
    description: 'Central control unit for home automation with multiple communication interfaces',
    components: ['Raspberry Pi', 'Relay Array', 'RF Module', 'Ethernet', 'GPIO Expander'],
    complexity: 'advanced'
  },
  {
    id: 'circuit_5',
    title: 'Solar Power Management',
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop&auto=format',
    description: 'MPPT charge controller with battery management and monitoring',
    components: ['MPPT Controller', 'Battery Monitor', 'Solar Panel', 'Buck Converter', 'MCU'],
    complexity: 'advanced'
  },
  {
    id: 'circuit_6',
    title: 'LED Matrix Display Driver',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop&auto=format',
    description: 'Addressable LED matrix with pattern generation and color control',
    components: ['WS2812B LEDs', 'Arduino', 'Level Shifter', 'Power Supply', 'Capacitors'],
    complexity: 'intermediate'
  },
  {
    id: 'circuit_7',
    title: 'Drone Flight Controller',
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop&auto=format',
    description: 'Multi-rotor flight control system with IMU and GPS integration',
    components: ['Flight Controller', 'IMU', 'GPS Module', 'ESCs', 'Radio Receiver'],
    complexity: 'advanced'
  },
  {
    id: 'circuit_8',
    title: 'Data Acquisition System',
    imageUrl: 'https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?w=400&h=300&fit=crop&auto=format',
    description: 'Multi-channel data logger with SD card storage and real-time monitoring',
    components: ['STM32', 'ADC', 'SD Card Module', 'RTC', 'Analog Sensors'],
    complexity: 'advanced'
  }
];

// Function to get random circuit image based on project type and complexity
export function getRandomCircuitImage(projectType?: string, complexity?: 'beginner' | 'intermediate' | 'advanced'): CircuitImage {
  let filteredImages = CIRCUIT_IMAGES;

  // Filter by complexity if specified
  if (complexity) {
    filteredImages = CIRCUIT_IMAGES.filter(img => img.complexity === complexity);
  }

  // Filter by project type keywords if specified
  if (projectType) {
    const lowerType = projectType.toLowerCase();
    const relevantImages = CIRCUIT_IMAGES.filter(img => {
      const searchText = `${img.title} ${img.description} ${img.components.join(' ')}`.toLowerCase();
      
      if (lowerType.includes('temperature') && searchText.includes('temperature')) return true;
      if (lowerType.includes('motor') && searchText.includes('motor')) return true;
      if (lowerType.includes('led') && searchText.includes('led')) return true;
      if (lowerType.includes('solar') && searchText.includes('solar')) return true;
      if (lowerType.includes('drone') && searchText.includes('drone')) return true;
      if (lowerType.includes('smart home') && searchText.includes('home')) return true;
      if (lowerType.includes('iot') && searchText.includes('esp32')) return true;
      if (lowerType.includes('data') && searchText.includes('data')) return true;
      
      return false;
    });

    if (relevantImages.length > 0) {
      filteredImages = relevantImages;
    }
  }

  // Return random image from filtered results
  const randomIndex = Math.floor(Math.random() * filteredImages.length);
  return filteredImages[randomIndex];
}

// Function to get circuit image that changes based on prompt hash
export function getContextualCircuitImage(prompt: string): CircuitImage {
  // Create a simple hash from the prompt to ensure consistent but varied selection
  let hash = 0;
  for (let i = 0; i < prompt.length; i++) {
    const char = prompt.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  // Use hash to select image consistently for the same prompt
  const index = Math.abs(hash) % CIRCUIT_IMAGES.length;
  return CIRCUIT_IMAGES[index];
}

// Get multiple circuit images for variety
export function getMultipleCircuitImages(count: number = 3): CircuitImage[] {
  const shuffled = [...CIRCUIT_IMAGES].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, CIRCUIT_IMAGES.length));
}