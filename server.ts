import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import { PRODUCTS } from './src/data/products.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());

// Prepare catalog summary for Gemini grounding
const CATALOG_GROUNDING = PRODUCTS.map((p) => ({
  id: p.id,
  name: p.name,
  tagline: p.tagline,
  category: p.category,
  price: p.price,
  ecoScore: p.ecoScore,
  material: p.material,
  materialTag: p.materialTag,
  durability: p.durability,
  reusability: p.reusability,
  isReusable: p.isReusable,
  packaging: p.packaging,
  recyclability: p.recyclability,
  certifications: p.certifications,
}));

// API Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    geminiConfigured: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/products', (req, res) => {
  res.json({
    products: PRODUCTS,
    total: PRODUCTS.length,
    isDemoCatalog: true,
  });
});

app.get('/api/products/:id', (req, res) => {
  const product = PRODUCTS.find((p) => p.id === req.params.id);
  if (!product) {
    res.status(404).json({ error: 'Product not found' });
    return;
  }
  res.json({ product });
});

// Eco Agent Gemini Endpoint
app.post('/api/eco-agent', async (req, res) => {
  try {
    const { messages, userQuery } = req.body;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      res.status(200).json({
        error: 'NO_API_KEY',
        message:
          'GEMINI_API_KEY is not configured in AI Studio Secrets settings. Please add your key in Settings > Secrets to enable live Gemini AI recommendations. The rest of the store remains fully functional!',
        recommendedProductIds: [],
        suggestedQuestions: [
          'Show me kitchen items under ₹1000',
          'What are your highest Eco Score products?',
          'Which items eliminate single-use plastic?',
        ],
      });
      return;
    }

    const ai = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });

    // Build conversation context
    const conversationHistory = Array.isArray(messages)
      ? messages
          .slice(-6)
          .map((m: { role: string; content: string }) => `${m.role === 'user' ? 'Customer' : 'Eco Agent'}: ${m.content}`)
          .join('\n')
      : '';

    const systemInstruction = `You are the "EcoMart Eco Agent", an empathetic, honest, and expert sustainable shopping assistant for EcoMart.
EcoMart's mission & tagline: “Don’t Just Shop. Shop With Purpose.”
All prices are strictly in Indian Rupees (₹).

CRITICAL GROUNDING RULES:
1. You MUST ONLY recommend products that exist in the EcoMart Catalog provided below.
2. NEVER invent fake products, fake prices, or fake eco scores. Every product you recommend MUST have its exact id listed in the "recommendedProductIds" array.
3. If a customer asks for a product under a specific budget (e.g., "water bottle under ₹800"), check catalog items (e.g., id: "insulated-tumbler-750" at ₹749, Eco Score 93).
4. Explain why each recommended product fits the customer's requirements, highlighting:
   - Budget fit
   - Eco Score (out of 100) and why it scored high
   - Material composition (organic, reclaimed, chemical-free)
   - Reusability & single-use plastic reduction
   - Packaging & end-of-life recyclability/compostability
5. When helpful, suggest a cheaper alternative, compare two items, or ask a brief follow-up question.
6. Provide 2-3 natural follow-up suggested questions that the customer could ask next.
7. Keep your tone warm, encouraging, grounded, and concise (2-4 clear paragraphs or bullet points). Avoid marketing hype.

CURRENT ECOMART CATALOG:
${JSON.stringify(CATALOG_GROUNDING, null, 2)}
`;

    const prompt = `${conversationHistory ? `PREVIOUS CONVERSATION:\n${conversationHistory}\n\n` : ''}CUSTOMER QUERY:
${userQuery || 'Hello! How can you help me shop sustainably today?'}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            message: {
              type: Type.STRING,
              description: 'Your conversational, knowledgeable response to the customer with specific product justifications.',
            },
            recommendedProductIds: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: 'Array of exact product IDs from the catalog that match the recommendation. Can be empty if no specific product matches.',
            },
            suggestedQuestions: {
              type: Type.ARRAY,
              items: {
                type: Type.STRING,
              },
              description: '2 to 3 natural follow-up questions the user can click to continue the shopping consultation.',
            },
          },
          required: ['message', 'recommendedProductIds', 'suggestedQuestions'],
        },
      },
    });

    const rawText = response.text || '{}';
    let parsedData: {
      message: string;
      recommendedProductIds: string[];
      suggestedQuestions: string[];
    };

    try {
      parsedData = JSON.parse(rawText);
    } catch {
      parsedData = {
        message: rawText,
        recommendedProductIds: [],
        suggestedQuestions: ['Show me kitchen items', 'What is your best rated item?'],
      };
    }

    // STRICT VALIDATION: Filter recommendedProductIds to only IDs that exist in the real catalog
    const validProductIds = Array.isArray(parsedData.recommendedProductIds)
      ? parsedData.recommendedProductIds.filter((id) => PRODUCTS.some((p) => p.id === id))
      : [];

    res.json({
      message: parsedData.message || 'Here are our sustainable recommendations for you.',
      recommendedProductIds: validProductIds,
      suggestedQuestions: Array.isArray(parsedData.suggestedQuestions)
        ? parsedData.suggestedQuestions.slice(0, 3)
        : [],
    });
  } catch (error: any) {
    console.error('Error calling Gemini Eco Agent:', error);
    res.status(500).json({
      error: 'GEMINI_ERROR',
      message:
        'The Eco Agent encountered an issue reaching Gemini. Please try again in a moment. You can browse our verified catalog in the meantime.',
      recommendedProductIds: [],
      suggestedQuestions: [
        'Show bestsellers with Eco Score 95+',
        'Show zero plastic items',
      ],
    });
  }
});

// Setup Vite or static serving
async function startServer() {
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist/index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`EcoMart server running on http://localhost:${PORT}`);
  });
}

startServer();
