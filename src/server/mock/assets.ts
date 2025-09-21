export type DummyCad = { 
  id: string; 
  title: string; 
  previewUrl: string; 
  stepUrl?: string; 
  notes?: string;
  dimensions?: { width: number; height: number; depth: number };
};

export type DummyCircuit = { 
  id: string; 
  title: string; 
  imageUrl: string; 
  diagramJsonUrl?: string;
  simulation?: {
    voltage: number[];
    current: number[];
    time: number[];
  };
};

export const DUMMY_CAD: DummyCad[] = [
  { 
    id: 'cad1', 
    title: 'Temperature Sensor Mount', 
    previewUrl: 'https://images.unsplash.com/photo-1581092918056-0c4c3acd3789?w=400&h=300&fit=crop', 
    stepUrl: '/mock/cad/sensor-mount.step',
    dimensions: { width: 80, height: 60, depth: 25 }
  },
  { 
    id: 'cad2', 
    title: 'Electronics Enclosure', 
    previewUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 
    stepUrl: '/mock/cad/enclosure-small.step',
    dimensions: { width: 120, height: 80, depth: 30 }
  },
  { 
    id: 'cad3', 
    title: 'Mounting Bracket', 
    previewUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    dimensions: { width: 100, height: 50, depth: 15 }
  },
  { 
    id: 'cad4', 
    title: 'Drone Frame Hub', 
    previewUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
    dimensions: { width: 350, height: 100, depth: 350 }
  },
  { 
    id: 'cad5', 
    title: 'Camera Mount Tray', 
    previewUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    dimensions: { width: 150, height: 40, depth: 100 }
  },
  { 
    id: 'cad6', 
    title: 'Adjustable Clamp', 
    previewUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
    dimensions: { width: 200, height: 60, depth: 80 }
  },
  { 
    id: 'cad7', 
    title: 'Heatsink Plate', 
    previewUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    dimensions: { width: 60, height: 40, depth: 10 }
  },
];

export const DUMMY_CIRCUITS: DummyCircuit[] = [
  { 
    id: 'ckt1', 
    title: 'Arduino + LDR + LED Control', 
    imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop', 
    diagramJsonUrl: '/mock/circuits/ldr-led.diagram.json',
    simulation: {
      voltage: [0, 3.3, 5, 3.3, 0, 3.3],
      current: [0, 0.05, 0.08, 0.06, 0.03, 0.05],
      time: [0, 1, 2, 3, 4, 5]
    }
  },
  { 
    id: 'ckt2', 
    title: 'Arduino + Button + Buzzer', 
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    simulation: {
      voltage: [0, 5, 5.2, 4.8, 5, 5],
      current: [0, 0.02, 0.025, 0.018, 0.02, 0.02],
      time: [0, 1, 2, 3, 4, 5]
    }
  },
  { 
    id: 'ckt3', 
    title: 'Arduino + DHT22 Temperature', 
    imageUrl: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=400&h=300&fit=crop',
    simulation: {
      voltage: [0, 3.3, 3.5, 3.2, 3.3, 3.3],
      current: [0, 0.001, 0.0015, 0.0012, 0.001, 0.001],
      time: [0, 1, 2, 3, 4, 5]
    }
  },
  { 
    id: 'ckt4', 
    title: 'Arduino + Ultrasonic + Servo', 
    imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
    simulation: {
      voltage: [0, 5, 6, 5.5, 4.8, 5],
      current: [0, 0.5, 0.8, 0.6, 0.4, 0.5],
      time: [0, 1, 2, 3, 4, 5]
    }
  },
  { 
    id: 'ckt5', 
    title: 'Arduino + OLED I2C Display', 
    imageUrl: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&h=300&fit=crop',
    simulation: {
      voltage: [0, 3.3, 3.3, 3.3, 3.3, 3.3],
      current: [0, 0.02, 0.025, 0.022, 0.02, 0.02],
      time: [0, 1, 2, 3, 4, 5]
    }
  },
  { 
    id: 'ckt6', 
    title: 'ESP32 + NeoPixel Strip', 
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop',
    simulation: {
      voltage: [0, 3.3, 3.3, 3.3, 3.3, 3.3],
      current: [0, 0.1, 0.5, 0.3, 0.2, 0.1],
      time: [0, 1, 2, 3, 4, 5]
    }
  },
  { 
    id: 'ckt7', 
    title: 'Arduino + Relay + AC Load', 
    imageUrl: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=400&h=300&fit=crop',
    simulation: {
      voltage: [0, 5, 5, 5, 5, 5],
      current: [0, 0.07, 0.07, 0.07, 0.07, 0.07],
      time: [0, 1, 2, 3, 4, 5]
    }
  },
];