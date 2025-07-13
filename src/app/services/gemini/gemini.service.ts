import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { QuizQuestion } from '../../components/shared/models/quiz.model';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private apiKey = environment.geminiApiKey;
  private apiUrl = environment.geminiApiUrl;

  constructor(private http: HttpClient) {}

  async generateQuizQuestions(
    topic: string,
    difficulty: string,
    numberOfQuestions: number
  ): Promise<QuizQuestion[]> {
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
      },
      {
        "question": "Which planet is known as the Red Planet?",
        "options": ["Earth", "Mars", "Jupiter", "Venus"],
        "correctAnswer": "Mars"
      }
    ]
    `;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    const body = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topP: 0.95,
        topK: 40,
        maxOutputTokens: 1024,
      },
  
    };

    try {
   
      const fullApiUrl = `${this.apiUrl}?key=${this.apiKey}`;

     
      const response: any = await lastValueFrom(
        this.http.post(fullApiUrl, body, { headers })
      );

      let text = response.candidates[0].content.parts[0].text;

    
      text = text.replace(/```json\n|\n```/g, '').trim();

      console.log('Gemini raw response:', text);

     
      const parsedQuestions: QuizQuestion[] = JSON.parse(text);
      return parsedQuestions.map(q => ({
        ...q,
        selectedAnswer: null, 
        isCorrect: undefined 
      }));
    } catch (error) {
      console.error('Error generating quiz questions:', error);

      alert('An error occurred while generating the quiz. Please check your API key, network, or the AI service status.');
      return [];
    }
  }
}