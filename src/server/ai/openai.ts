import OpenAI from 'openai';

const client = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY!
});

const MODEL = process.env.OPENAI_MODEL || 'gpt-4o-mini';

export async function runNlp(prompt: string) {
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.2,
    messages: [
      { role: 'system', content: 'You are an embedded systems and circuits assistant. Provide detailed, technical responses about engineering projects.' },
      { role: 'user', content: prompt }
    ]
  });
  return res.choices[0]?.message?.content ?? '';
}

export async function generateRiskAnalysis(prompt: string) {
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [
      { 
        role: 'system', 
        content: 'You are a risk analysis expert for engineering projects. Analyze the given project and provide a detailed risk assessment in JSON format with risks array containing objects with: id, description, severity (low/medium/high/critical), mitigation, and probability (0-1).' 
      },
      { role: 'user', content: `Analyze risks for this engineering project: ${prompt}` }
    ]
  });
  
  try {
    const content = res.choices[0]?.message?.content ?? '{}';
    return JSON.parse(content);
  } catch {
    // Fallback if JSON parsing fails
    return {
      risks: [
        {
          id: '1',
          description: 'Component failure during operation',
          severity: 'medium',
          mitigation: 'Use redundant components and regular testing',
          probability: 0.2
        }
      ]
    };
  }
}

export async function generateTestingMethods(prompt: string) {
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [
      { 
        role: 'system', 
        content: 'You are a testing expert for engineering projects. Generate comprehensive testing methods in JSON format with testing array containing objects with: id, title, procedure (array of steps), expectedResults, and equipment (array).' 
      },
      { role: 'user', content: `Generate testing methods for this engineering project: ${prompt}` }
    ]
  });
  
  try {
    const content = res.choices[0]?.message?.content ?? '{}';
    return JSON.parse(content);
  } catch {
    // Fallback if JSON parsing fails
    return {
      testing: [
        {
          id: '1',
          title: 'Functional Test',
          procedure: ['Connect components', 'Power on system', 'Verify operation'],
          expectedResults: 'System operates within specifications',
          equipment: ['Multimeter', 'Oscilloscope']
        }
      ]
    };
  }
}

export async function generateUserManual(prompt: string) {
  const res = await client.chat.completions.create({
    model: MODEL,
    temperature: 0.3,
    messages: [
      { 
        role: 'system', 
        content: 'You are a technical writer creating user manuals for engineering projects. Generate a comprehensive user manual in JSON format with sections array containing objects with: title and content.' 
      },
      { role: 'user', content: `Generate a user manual for this engineering project: ${prompt}` }
    ]
  });
  
  try {
    const content = res.choices[0]?.message?.content ?? '{}';
    return JSON.parse(content);
  } catch {
    // Fallback if JSON parsing fails
    return {
      sections: [
        {
          title: 'Introduction',
          content: 'Welcome to your engineering system. This manual will guide you through setup and operation.'
        },
        {
          title: 'Installation',
          content: '1. Unpack components\n2. Connect according to schematic\n3. Power on system'
        }
      ]
    };
  }
}