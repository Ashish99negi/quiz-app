import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function (request: VercelRequest, response: VercelResponse) {
  console.log('Serverless function started for a request.');

  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const apiKey = process.env['GEMINI_API_KEY'] as string;
    const geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

    // --- CRUCIAL CHECK ---
    if (!apiKey || apiKey.trim() === '') {
      console.error('GEMINI_API_KEY environment variable is not set or is empty!');
      return response.status(500).json({ message: 'Server configuration error: API key missing or invalid.' });
    }

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

    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };

    const geminiResponse = await fetch(`${geminiApiUrl}?key=${apiKey}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API returned an error:', geminiResponse.status, errorText);
        return response.status(geminiResponse.status).json({ message: 'Failed to get a successful response from Gemini API.', details: errorText });
    }

    const geminiResult = await geminiResponse.json();
    const text = geminiResult.candidates[0].content.parts[0].text;
    const cleanedText = text.replace(/```json\n|\n```/g, '').trim();

    const parsedQuestions = JSON.parse(cleanedText);
    return response.status(200).json(parsedQuestions);

  } catch (error) {
    console.error('API call failed in the try block:', error);
    return response.status(500).json({ message: 'Failed to generate quiz questions', error: (error as Error).message });
  }
}