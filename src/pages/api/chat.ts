import { NextApiRequest, NextApiResponse } from 'next';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end();
  
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  // Debug: Cek apakah API Key ada
  if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: 'API Key missing in configuration' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(message);
    const response = await result.response;
    res.status(200).json({ reply: response.text() });
  } catch (error: any) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ error: error.message || 'Failed to communicate with AI' });
  }
}
