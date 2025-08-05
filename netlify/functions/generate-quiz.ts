import type { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Netlify automatically provides the API key from environment variables.
const apiKey = process.env['GEMINI_API_KEY'];
const genAI = new GoogleGenerativeAI(apiKey as string);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

export const handler: Handler = async (event: any) => {
  // We only accept POST requests.
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
  }

  // Ensure the API key is set before proceeding.
  if (!apiKey) {
    console.error('API key is not set.');
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Server configuration error: API key missing.' }),
    };
  }

  try {
    const { topic, difficulty, numberOfQuestions } = JSON.parse(event.body || '{}');

    if (!topic || !difficulty || !numberOfQuestions) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Missing required parameters' }),
      };
    }

    const prompt = `Generate a ${difficulty} level quiz with ${numberOfQuestions} multiple-choice questions on the topic of "${topic}".
    For each question, provide:
    1. The question text.
    2. An array of 4 options.
    3. The exact correct answer from the options.

    Format the output as a JSON array of objects, where each object has 'question', 'options' (array), and 'correctAnswer' (string).`;

    const result = await model.generateContent(prompt);
    const text = result.response.text();
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();
    const parsedQuestions = JSON.parse(cleanedText);

    return {
      statusCode: 200,
      body: JSON.stringify(parsedQuestions),
    };
  } catch (error) {
    console.error('Netlify function failed:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Failed to generate quiz questions', error: (error as Error).message }),
    };
  }
};