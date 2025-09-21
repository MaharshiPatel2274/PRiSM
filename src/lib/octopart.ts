// Octopart API integration using the provided credentials
export interface OctopartItem {
  role: string;
  query: string;
  qty: number;
  mustHave?: string[];
  niceToHave?: string[];
}

export interface OctopartBOMRow {
  role: string;
  mpn: string;
  manufacturer: string;
  desc: string;
  qty: number;
  sellers: {
    name: string;
    sku: string;
    stock: number;
    moq?: number;
    priceBreaks: { qty: number; price: number; currency: string }[];
  }[];
  best?: {
    supplier: string;
    unitPrice: number;
    currency: string;
    packQty: number;
    subtotal: number;
  };
  alternates?: { mpn: string; manufacturer: string }[];
}

export interface OctopartResponse {
  rows: OctopartBOMRow[];
  total: number;
  currency: string;
  count: number;
  note?: string;
}

interface PartSpec {
  attribute?: {
    shortname?: string;
    name?: string;
  };
  displayValue?: string;
}

interface PriceBreak {
  quantity: number;
  price: string;
  currency: string;
}

interface Offer {
  sku?: string;
  moq?: number;
  inventoryLevel?: number;
  prices?: PriceBreak[];
  orderMultiple?: number;
}

interface Seller {
  name: string;
  offers?: Offer[];
}

interface SimilarPart {
  mpn: string;
  manufacturer?: {
    name?: string;
  };
}

interface Part {
  mpn: string;
  manufacturer?: {
    name?: string;
  };
  shortDescription?: string;
  bestDatasheet?: {
    url?: string;
  };
  specs?: PartSpec[];
  sellers?: Seller[];
  similar?: SimilarPart[];
}

interface SearchResult {
  part?: Part;
}

interface SearchResponse {
  data?: {
    supSearch?: {
      results?: SearchResult[];
    };
  };
}

// Octopart credentials
const OCTOPART_CONFIG = {
  clientId: 'd30670fb-14c3-4523-9f36-fc122a4294eb',
  clientSecret: 'jxQ33TQf2fNVMK_9MNQgb_U7QyF1IBwF05k-',
  accessToken: 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjA5NzI5QTkyRDU0RDlERjIyRDQzMENBMjNDNkI4QjJFIiwidHlwIjoiYXQrand0In0.eyJuYmYiOjE3NTg0MzQyMDEsImV4cCI6MTc1ODUyMDYwMSwiaXNzIjoiaHR0cHM6Ly9pZGVudGl0eS5uZXhhci5jb20iLCJjbGllbnRfaWQiOiJkMzA2NzBmYi0xNGMzLTQ1MjMtOWYzNi1mYzEyMmE0Mjk0ZWIiLCJzdWIiOiI1MzcxRTk3Qi1GN0UzLTRFNEMtOThCOC1GNjEwQUY1NkFGQjIiLCJhdXRoX3RpbWUiOjE3NTg0MzM5NDAsImlkcCI6ImxvY2FsIiwicHJpdmF0ZV9jbGFpbXNfaWQiOiJlNmE3MjdlOS1lM2U3LTRlYzQtYTE1OC01ZWEzMmI4NWE2NDEiLCJwcml2YXRlX2NsYWltc19zZWNyZXQiOiJSRlYwcDZuZm5qYlMxbUFNY2NuZ09YUFRNN2c3ZDVoci9HVzNEWXN1eit3PSIsImp0aSI6IkQzMjFGQTlFQ0FDMDAxM0Y2M0MyOUE3NkExN0RENzRGIiwic2lkIjoiQTE2RDA0RkU0MzcyRDJGQTQ4QUUxNTZDMTVCMzVFRkQiLCJpYXQiOjE3NTg0MzQyMDEsInNjb3BlIjpbIm9wZW5pZCIsInVzZXIuYWNjZXNzIiwicHJvZmlsZSIsImVtYWlsIiwidXNlci5kZXRhaWxzIiwiZGVzaWduLmRvbWFpbiIsInN1cHBseS5kb21haW4iXSwiYW1yIjpbInB3ZCJdfQ.AizKcpyOv4NBrtzaGntjEnVb2dFSYTqHDzGwV5A4c3YWQ09WxHdLLXlJvO-XufS1xkbDQIVbxunS9v1NrlfSxA03lLkreJ6hm65uLOgiwPCm_o3Qydp8WijYXF739Ig_4FZoe_4-Xo1NjbYN3UzX_FLaFoRm1xLNWuZef4mnV1ML8G2QHGj_nM1nliXmDtRF2dGttf-_I7Pe-GQBoaSo3wCDwNkzygi6DHs5_P73yckEGlUA5TC35ReI9e6Y__FrqOQalv-vx4ymqOdbR91Fnya2GqrwHfgys5xkaR1ZqfGbSE11YRGDh2YHPT8WJ_Nvye3tmpv1KLmO-2jOcu33IA'
};

const TOKEN_ENDPOINT = 'https://identity.nexar.com/connect/token';
const GQL_ENDPOINT = 'https://api.nexar.com/graphql';

// GraphQL query for searching parts
const SEARCH_QUERY = `
query Search($q: String!, $limit: Int!, $country: String!, $currency: String!) {
  supSearch(q: $q, limit: $limit, country: $country) {
    results {
      part {
        mpn
        manufacturer { name }
        shortDescription
        bestDatasheet { url }
        specs { attribute { shortname name } displayValue }
        sellers(authorizedOnly: true) {
          name
          offers(country: $country, currency: $currency) {
            sku
            moq
            inventoryLevel
            prices { quantity price currency }
            orderMultiple
          }
        }
        similar {
          mpn
          manufacturer { name }
        }
      }
    }
  }
}
`;

// Get fresh access token
async function getAccessToken(): Promise<string> {
  try {
    const response = await fetch(TOKEN_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: OCTOPART_CONFIG.clientId,
        client_secret: OCTOPART_CONFIG.clientSecret,
        grant_type: 'client_credentials',
        scope: 'nexar.products',
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to get access token');
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.warn('Failed to get fresh token, using provided token:', error);
    return OCTOPART_CONFIG.accessToken;
  }
}

// Score parts based on requirements
function scoreMatch(specs: PartSpec[] = [], mustHave: string[] = [], niceToHave: string[] = []): number {
  const text = specs
    .map((s) => `${s.attribute?.shortname || ''}:${s.displayValue || ''}`.toLowerCase())
    .join('|');
  
  let score = 0;
  for (const must of mustHave) {
    if (text.includes(must.toLowerCase())) score += 5;
  }
  for (const nice of niceToHave) {
    if (text.includes(nice.toLowerCase())) score += 1;
  }
  return score;
}

// Find best pricing offer
function pickBestOffer(qtyPerBuild: number, sellers: Seller[] = []) {
  let best: {
    supplier: string;
    unitPrice: number;
    currency: string;
    packQty: number;
    subtotal: number;
  } | null = null;

  for (const seller of sellers) {
    for (const offer of seller.offers || []) {
      const stock = offer.inventoryLevel || 0;
      const moq = offer.moq || 1;
      const packQty = Math.max(moq, qtyPerBuild);
      
      if (stock < packQty) continue;
      
      for (const priceBreak of offer.prices || []) {
        if (packQty >= priceBreak.quantity) {
          const unitPrice = Number(priceBreak.price);
          const subtotal = unitPrice * packQty;
          
          if (!best || unitPrice < best.unitPrice) {
            best = {
              supplier: seller.name,
              unitPrice,
              currency: priceBreak.currency,
              packQty,
              subtotal,
            };
          }
        }
      }
    }
  }

  return best ?? undefined;
}

// Main function to generate BOM using Octopart
export async function generateOctopartBOM(
  items: OctopartItem[],
  country: string = 'US',
  currency: string = 'USD'
): Promise<OctopartResponse> {
  try {
    const token = await getAccessToken();
    const rows: OctopartBOMRow[] = [];

    for (const item of items) {
      try {
        const response = await fetch(GQL_ENDPOINT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: SEARCH_QUERY,
            variables: {
              q: item.query,
              limit: 10,
              country,
              currency,
            },
          }),
        });

        if (response.status === 429) {
          throw new Error('Rate limited');
        }

        const data: SearchResponse = await response.json();
        const candidates = data?.data?.supSearch?.results || [];

        // Sort by relevance score
        candidates.sort((a, b) => {
          const scoreA = scoreMatch(a.part?.specs, item.mustHave, item.niceToHave);
          const scoreB = scoreMatch(b.part?.specs, item.mustHave, item.niceToHave);
          return scoreB - scoreA;
        });

        const topPart = candidates[0]?.part;
        if (!topPart) {
          rows.push({
            role: item.role,
            mpn: 'NOT_FOUND',
            manufacturer: '',
            desc: `No match for "${item.query}"`,
            qty: item.qty,
            sellers: [],
          });
          continue;
        }

        const sellers = (topPart.sellers || []).map((s) => ({
          name: s.name,
          sku: s.offers?.[0]?.sku || '',
          stock: s.offers?.[0]?.inventoryLevel || 0,
          moq: s.offers?.[0]?.moq ?? undefined,
          priceBreaks: (s.offers?.[0]?.prices || []).map((p) => ({
            qty: p.quantity,
            price: Number(p.price),
            currency: p.currency,
          })),
        }));

        const best = pickBestOffer(item.qty, topPart.sellers);

        rows.push({
          role: item.role,
          mpn: topPart.mpn,
          manufacturer: topPart.manufacturer?.name || '',
          desc: topPart.shortDescription || '',
          qty: item.qty,
          sellers,
          best,
          alternates: (topPart.similar || [])
            .slice(0, 3)
            .map((x) => ({
              mpn: x.mpn,
              manufacturer: x.manufacturer?.name || '',
            })),
        });
      } catch (error) {
        console.error(`Error searching for ${item.query}:`, error);
        rows.push({
          role: item.role,
          mpn: 'ERROR',
          manufacturer: '',
          desc: `Error searching for "${item.query}"`,
          qty: item.qty,
          sellers: [],
        });
      }
    }

    const total = rows.reduce((sum, row) => sum + (row.best?.subtotal || 0), 0);

    return {
      rows,
      total,
      currency,
      count: rows.length,
    };
  } catch (error) {
    console.error('Octopart BOM generation failed:', error);
    throw error;
  }
}

// Convert prompt to Octopart items
export function promptToOctopartItems(prompt: string): OctopartItem[] {
  const items: OctopartItem[] = [];
  const lowerPrompt = prompt.toLowerCase();

  // Add microcontroller based on prompt
  if (lowerPrompt.includes('esp32')) {
    items.push({
      role: 'MCU',
      query: 'ESP32-WROOM-32',
      qty: 1,
      mustHave: ['WiFi', 'Bluetooth'],
    });
  } else if (lowerPrompt.includes('arduino')) {
    items.push({
      role: 'MCU',
      query: 'Arduino Uno R3',
      qty: 1,
      mustHave: ['ATmega328P'],
    });
  } else if (lowerPrompt.includes('raspberry pi')) {
    items.push({
      role: 'SBC',
      query: 'Raspberry Pi 4B',
      qty: 1,
      mustHave: ['ARM', '4GB'],
    });
  }

  // Add sensors based on prompt
  if (lowerPrompt.includes('temperature')) {
    items.push({
      role: 'Sensor',
      query: 'DS18B20 temperature sensor',
      qty: 1,
      mustHave: ['1-Wire', 'digital'],
    });
  }

  if (lowerPrompt.includes('humidity')) {
    items.push({
      role: 'Sensor',
      query: 'DHT22 humidity sensor',
      qty: 1,
      mustHave: ['humidity', 'temperature'],
    });
  }

  if (lowerPrompt.includes('pressure')) {
    items.push({
      role: 'Sensor',
      query: 'BMP280 pressure sensor',
      qty: 1,
      mustHave: ['I2C', 'SPI'],
    });
  }

  if (lowerPrompt.includes('motion') || lowerPrompt.includes('accelerometer')) {
    items.push({
      role: 'Sensor',
      query: 'MPU6050 IMU',
      qty: 1,
      mustHave: ['I2C', '6-axis'],
    });
  }

  if (lowerPrompt.includes('distance') || lowerPrompt.includes('ultrasonic')) {
    items.push({
      role: 'Sensor',
      query: 'HC-SR04 ultrasonic sensor',
      qty: 1,
      mustHave: ['ultrasonic', '5V'],
    });
  }

  // Add actuators based on prompt
  if (lowerPrompt.includes('motor') && !lowerPrompt.includes('servo')) {
    items.push({
      role: 'Actuator',
      query: 'DC motor driver L298N',
      qty: 1,
      mustHave: ['H-bridge', '2A'],
    });
  }

  if (lowerPrompt.includes('servo')) {
    items.push({
      role: 'Actuator',
      query: 'SG90 servo motor',
      qty: 1,
      mustHave: ['9g', 'micro'],
    });
  }

  if (lowerPrompt.includes('led') || lowerPrompt.includes('light')) {
    items.push({
      role: 'Display',
      query: 'WS2812B LED strip',
      qty: 1,
      mustHave: ['addressable', '5V'],
    });
  }

  if (lowerPrompt.includes('display') || lowerPrompt.includes('screen')) {
    items.push({
      role: 'Display',
      query: 'SSD1306 OLED display',
      qty: 1,
      mustHave: ['I2C', '128x64'],
    });
  }

  // Add common components
  items.push(
    {
      role: 'Power',
      query: 'AMS1117 3.3V regulator',
      qty: 1,
      mustHave: ['3.3V', 'LDO'],
    },
    {
      role: 'Passive',
      query: '10k ohm resistor 1/4W',
      qty: 10,
      mustHave: ['10K', '1/4W'],
    },
    {
      role: 'Passive',
      query: '100uF electrolytic capacitor',
      qty: 5,
      mustHave: ['100uF', 'electrolytic'],
    },
    {
      role: 'Connector',
      query: 'USB-C connector',
      qty: 1,
      mustHave: ['USB-C', 'receptacle'],
    }
  );

  return items;
}