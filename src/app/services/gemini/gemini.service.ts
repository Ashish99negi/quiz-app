// src/app/services/gemini/gemini.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { QuizQuestion } from '../../components/shared/models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  private apiUrl = '/.netlify/functions/generate-quiz';

  constructor(private http: HttpClient) {}

  async generateQuizQuestions(
    topic: string,
    difficulty: string,
    numberOfQuestions: number
  ): Promise<QuizQuestion[]> {
    const payload = { topic, difficulty, numberOfQuestions };

    try {
      const response: QuizQuestion[] = await firstValueFrom(
        this.http.post<QuizQuestion[]>(this.apiUrl, payload)
      );
      return response.map(q => ({
        ...q,
        selectedAnswer: null,
        isCorrect: undefined
      }));
    } catch (error) {
      console.error('Error generating quiz questions:', error);
      return [];
    }
  }
}