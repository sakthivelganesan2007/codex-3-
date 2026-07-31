import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from './routes/api.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// API Endpoints
app.use('/api', apiRoutes);

// Health Check Endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'online', system: 'NEXORA AI-Native Commerce Engine', timestamp: new Date() });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`⚡ NEXORA MERN Server running on http://localhost:${PORT}`);
  console.log(`🤖 Gemini AI Assistant: ${process.env.GEMINI_API_KEY ? 'Active (Live API Key)' : 'Active (Deterministic Fallback Engine)'}`);
});
