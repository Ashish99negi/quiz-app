import { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

console.log('API key is defined:', !!process.env['GEMINI_API_KEY']);
const apiKey = process.env['GEMINI_API_KEY'] as string;
const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export default async function (request: VercelRequest, response: VercelResponse) {
    console.log('Serverless function has started.');
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { topic, difficulty, numberOfQuestions } = request.body;

    if (!topic || !difficulty || !numberOfQuestions) {
      return response.status(400).json({ message: 'Missing required parameters' });
    }

    const prompt = `Generate a ${difficulty} level quiz with ${numberOfQuestions} multiple-choice questions on the topic of "${topic}".
    For each question, provide:
    1. The question text.
    2. An array of 4 options.
    3. The exact correct answer from the options.

    Format the output as a JSON array of objects, where each object has 'question', 'options' (array), and 'correctAnswer' (string).
    Example:
    [
      {
        "question": "What is the capital of France?",
        "options": ["Berlin", "Madrid", "Paris", "Rome"],
        "correctAnswer": "Paris"
      }
    ]
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();

    const parsedQuestions = JSON.parse(cleanedText);
    return response.status(200).json(parsedQuestions);

  } catch (error) {
    console.error('API call failed:', error);
    return response.status(500).json({ message: 'Failed to generate quiz questions', error: (error as Error).message });
  }
}