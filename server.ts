import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import crypto from 'crypto';

const app = express();
const PORT = 3000;

app.use(express.json());

// Load fixed AI tools database
const databasePath = path.join(process.cwd(), 'ai_tools_database.json');
let toolsDatabase: any[] = [];
try {
  const rawData = fs.readFileSync(databasePath, 'utf-8');
  toolsDatabase = JSON.parse(rawData);
  console.log(`Loaded ${toolsDatabase.length} AI tools from database.`);
} catch (err) {
  console.error('Failed to load ai_tools_database.json:', err);
}

// Durable User Store setup
const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const authFilePath = path.join(dataDir, 'auth_store.json');

interface StoredUser {
  id: string;
  email: string;
  passwordHash: string;
  salt: string;
  name: string;
  createdAt: string;
}

interface Session {
  token: string;
  userId: string;
  createdAt: number;
}

interface UserHistory {
  userId: string;
  searches: any[];
}

interface AuthStore {
  users: StoredUser[];
  sessions: Session[];
  histories: UserHistory[];
}

function loadAuthStore(): AuthStore {
  try {
    if (fs.existsSync(authFilePath)) {
      const data = fs.readFileSync(authFilePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Error reading auth store:', e);
  }
  // Initialize with default demo user
  const demoSalt = crypto.randomBytes(16).toString('hex');
  const demoHash = crypto.pbkdf2Sync('demo1234', demoSalt, 1000, 64, 'sha512').toString('hex');
  const initialStore: AuthStore = {
    users: [
      {
        id: 'usr_demo_001',
        email: 'demo@aifinder.io',
        passwordHash: demoHash,
        salt: demoSalt,
        name: 'Demo Architect',
        createdAt: new Date().toISOString()
      }
    ],
    sessions: [],
    histories: []
  };
  saveAuthStore(initialStore);
  return initialStore;
}

function saveAuthStore(store: AuthStore) {
  try {
    fs.writeFileSync(authFilePath, JSON.stringify(store, null, 2), 'utf-8');
  } catch (e) {
    console.error('Error writing auth store:', e);
  }
}

let authStore = loadAuthStore();

function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is not set');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// -------------------------------------------------------------
// Authentication Endpoints
// -------------------------------------------------------------

// Sign up
app.post('/api/auth/signup', (req, res) => {
  const { email, password, name } = req.body;

  if (!email || typeof email !== 'string') {
    return res.status(400).json({ error: 'Email is required.' });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  // Password validation
  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Password is required.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  authStore = loadAuthStore();
  const normalizedEmail = email.trim().toLowerCase();
  const existingUser = authStore.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (existingUser) {
    return res.status(409).json({ error: 'An account with this email already exists. Please log in instead.' });
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const newUser: StoredUser = {
    id: 'usr_' + crypto.randomUUID(),
    email: normalizedEmail,
    passwordHash,
    salt,
    name: (name && typeof name === 'string' && name.trim()) ? name.trim() : normalizedEmail.split('@')[0],
    createdAt: new Date().toISOString()
  };

  authStore.users.push(newUser);

  // Generate session token
  const token = 'tok_' + crypto.randomBytes(32).toString('hex');
  authStore.sessions.push({
    token,
    userId: newUser.id,
    createdAt: Date.now()
  });

  saveAuthStore(authStore);

  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      createdAt: newUser.createdAt
    }
  });
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== 'string' || !email.trim()) {
    return res.status(400).json({ error: 'Please provide your email address.' });
  }

  if (!password || typeof password !== 'string') {
    return res.status(400).json({ error: 'Please provide your password.' });
  }

  authStore = loadAuthStore();
  const normalizedEmail = email.trim().toLowerCase();
  const user = authStore.users.find(u => u.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return res.status(404).json({ error: 'No account found with this email address.' });
  }

  const computedHash = hashPassword(password, user.salt);
  if (computedHash !== user.passwordHash) {
    return res.status(401).json({ error: 'Incorrect password. Please try again.' });
  }

  const token = 'tok_' + crypto.randomBytes(32).toString('hex');
  authStore.sessions.push({
    token,
    userId: user.id,
    createdAt: Date.now()
  });

  saveAuthStore(authStore);

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
  });
});

// Demo Login (Instant Access for "Enter App with Demo ID")
app.post('/api/auth/demo', (req, res) => {
  authStore = loadAuthStore();
  let demoUser = authStore.users.find(u => u.email === 'demo@aifinder.io');
  if (!demoUser) {
    const demoSalt = crypto.randomBytes(16).toString('hex');
    demoUser = {
      id: 'usr_demo_001',
      email: 'demo@aifinder.io',
      passwordHash: hashPassword('demo1234', demoSalt),
      salt: demoSalt,
      name: 'Demo Architect',
      createdAt: new Date().toISOString()
    };
    authStore.users.push(demoUser);
  }

  const token = 'tok_' + crypto.randomBytes(32).toString('hex');
  authStore.sessions.push({
    token,
    userId: demoUser.id,
    createdAt: Date.now()
  });
  saveAuthStore(authStore);

  return res.json({
    token,
    user: {
      id: demoUser.id,
      email: demoUser.email,
      name: demoUser.name,
      createdAt: demoUser.createdAt
    }
  });
});

// Current User verification
app.get('/api/auth/me', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization token.' });
  }

  const token = authHeader.substring(7);
  authStore = loadAuthStore();
  const session = authStore.sessions.find(s => s.token === token);
  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid.' });
  }

  const user = authStore.users.find(u => u.id === session.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found.' });
  }

  return res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      createdAt: user.createdAt
    }
  });
});

// Logout
app.post('/api/auth/logout', (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    authStore = loadAuthStore();
    authStore.sessions = authStore.sessions.filter(s => s.token !== token);
    saveAuthStore(authStore);
  }
  return res.json({ success: true });
});

// -------------------------------------------------------------
// Search History Endpoints
// -------------------------------------------------------------
app.get('/api/history', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ history: [] });
  }

  const token = authHeader.substring(7);
  authStore = loadAuthStore();
  const session = authStore.sessions.find(s => s.token === token);
  if (!session) {
    return res.json({ history: [] });
  }

  const userHistory = authStore.histories.find(h => h.userId === session.userId);
  return res.json({ history: userHistory ? userHistory.searches : [] });
});

app.post('/api/history', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ success: false });
  }

  const token = authHeader.substring(7);
  authStore = loadAuthStore();
  const session = authStore.sessions.find(s => s.token === token);
  if (!session) {
    return res.json({ success: false });
  }

  const { searchItem } = req.body;
  if (!searchItem) {
    return res.status(400).json({ error: 'Search item required' });
  }

  let userHistory = authStore.histories.find(h => h.userId === session.userId);
  if (!userHistory) {
    userHistory = { userId: session.userId, searches: [] };
    authStore.histories.push(userHistory);
  }

  // Prepend latest search, limit to 20
  userHistory.searches = [searchItem, ...userHistory.searches.filter(s => s.id !== searchItem.id)].slice(0, 20);
  saveAuthStore(authStore);

  return res.json({ success: true, history: userHistory.searches });
});

app.delete('/api/history', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ success: false });
  }

  const token = authHeader.substring(7);
  authStore = loadAuthStore();
  const session = authStore.sessions.find(s => s.token === token);
  if (!session) {
    return res.json({ success: false });
  }

  let userHistory = authStore.histories.find(h => h.userId === session.userId);
  if (userHistory) {
    userHistory.searches = [];
    saveAuthStore(authStore);
  }

  return res.json({ success: true });
});

// -------------------------------------------------------------
// AI Matching Engine (Gemini API with Exact System Instruction)
// -------------------------------------------------------------

const SYSTEM_INSTRUCTION = `You are a matching engine for an AI tool discovery app. You will receive a user's request and a fixed JSON database of real AI tools. Select the 4 to 6 tools from the database — and ONLY from the database, never invent tools not listed — that best match the user's request. For each selected tool, write one specific sentence explaining why it fits THIS request (not a generic description). Return strictly valid JSON only, in this exact shape, sorted by pricing_tier from Free to Paid: [{"name": "...", "description": "...", "pricing_tier": "...", "reason": "..."}]. Return nothing but the JSON array — no markdown code fences, no explanation, no extra text before or after.`;

const CANDIDATE_MODELS = ['gemini-3.1-flash-lite', 'gemini-3.8-flash'];

async function callGeminiForMatching(prompt: string, filteredDatabase: any[]): Promise<any[]> {
  const ai = getGeminiClient();
  if (!ai) {
    throw new Error('GEMINI_API_KEY environment variable is not configured.');
  }

  const userContent = `User Request: "${prompt}"\n\nFixed JSON Database of Real AI Tools:\n${JSON.stringify(filteredDatabase, null, 2)}`;

  let lastError: any = null;

  for (const model of CANDIDATE_MODELS) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents: userContent,
        config: {
          systemInstruction: SYSTEM_INSTRUCTION,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                description: { type: Type.STRING },
                pricing_tier: { type: Type.STRING },
                reason: { type: Type.STRING },
              },
              required: ['name', 'description', 'pricing_tier', 'reason'],
            },
          },
        },
      });

      const text = response.text ? response.text.trim() : '';
      if (!text) {
        throw new Error('Empty response received from Gemini API.');
      }

      // Clean any accidental markdown wrap
      const cleaned = text.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/i, '').trim();
      const parsed = JSON.parse(cleaned);

      if (!Array.isArray(parsed)) {
        throw new Error('Gemini response is not a JSON array.');
      }

      return parsed;
    } catch (err: any) {
      lastError = err;
      console.warn(`Model ${model} failed:`, err?.message || err);
      // continue to next candidate model
    }
  }

  throw lastError || new Error('Failed to obtain matches from Gemini API.');
}

app.post('/api/match', async (req, res) => {
  const { prompt, budget, skill } = req.body;

  if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
    return res.status(400).json({ error: 'Please enter what you want to build or create.' });
  }

  const trimmedPrompt = prompt.trim();

  // Apply budget or skill filter to the database if requested
  let databaseToPass = [...toolsDatabase];
  if (budget === 'free_only') {
    databaseToPass = databaseToPass.filter(t => t.pricing_tier === 'Free' || t.pricing_tier === 'Freemium');
  }

  // Attempt 1
  try {
    const rawMatches = await callGeminiForMatching(trimmedPrompt, databaseToPass);
    const enriched = enrichMatchedTools(rawMatches);
    return res.json({
      tools: enriched,
      query: trimmedPrompt,
      total_database_tools: toolsDatabase.length
    });
  } catch (firstError: any) {
    console.warn('First Gemini matching attempt failed, retrying once...', firstError?.message || firstError);
    // Retry once with the same input as mandated
    try {
      const retryMatches = await callGeminiForMatching(trimmedPrompt, databaseToPass);
      const enriched = enrichMatchedTools(retryMatches);
      return res.json({
        tools: enriched,
        query: trimmedPrompt,
        total_database_tools: toolsDatabase.length
      });
    } catch (retryError: any) {
      console.error('Second Gemini matching attempt failed:', retryError?.message || retryError);
      return res.status(502).json({
        error: 'Unable to analyze tools at this time. ' + (retryError?.message || 'Please try again momentarily.')
      });
    }
  }
});

// Helper to cross-reference matched tools with the fixed database to ensure verified URLs & categories
function enrichMatchedTools(matches: any[]): any[] {
  return matches.map(m => {
    // Find matching record in toolsDatabase (case-insensitive name check)
    const exactRecord = toolsDatabase.find(
      t => t.name.toLowerCase() === m.name.toLowerCase() ||
           t.name.toLowerCase().includes(m.name.toLowerCase()) ||
           m.name.toLowerCase().includes(t.name.toLowerCase())
    );

    const pricingTier = exactRecord ? exactRecord.pricing_tier : (m.pricing_tier || 'Freemium');
    const websiteUrl = exactRecord ? exactRecord.website_url : `https://www.google.com/search?q=${encodeURIComponent(m.name + ' AI tool')}`;
    const category = exactRecord ? exactRecord.category : 'AI Assistant';

    return {
      name: exactRecord ? exactRecord.name : m.name,
      description: exactRecord ? exactRecord.description : m.description,
      pricing_tier: pricingTier,
      reason: m.reason || 'Optimal tool suited for your workflow constraints.',
      category,
      website_url: websiteUrl
    };
  });
}

// Get all categories and database metadata
app.get('/api/tools/database', (req, res) => {
  return res.json({
    count: toolsDatabase.length,
    tools: toolsDatabase,
    categories: Array.from(new Set(toolsDatabase.map(t => t.category)))
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    databaseLoaded: toolsDatabase.length,
    hasGeminiKey: !!process.env.GEMINI_API_KEY
  });
});

// -------------------------------------------------------------
// Vite middleware for Dev / Static Files for Production
// -------------------------------------------------------------
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`AIFinder server running on http://0.0.0.0:${PORT}`);
  });
}

start();
