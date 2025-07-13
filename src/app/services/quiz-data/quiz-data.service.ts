import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { QuizConfig, QuizQuestion, QuizResult } from '../../components/shared/models/quiz.model';

@Injectable({
  providedIn: 'root',
})
export class QuizDataService {
  private quizQuestionsSource = new BehaviorSubject<QuizQuestion[]>([]);
  currentQuizQuestions = this.quizQuestionsSource.asObservable();

  private currentQuestionIndexSource = new BehaviorSubject<number>(0);
  currentQuestionIndex = this.currentQuestionIndexSource.asObservable();

  private quizResultSource = new BehaviorSubject<QuizResult | null>(null);
  currentQuizResult = this.quizResultSource.asObservable();

  private quizConfigSource = new BehaviorSubject<QuizConfig | null>(null);
  currentQuizConfig = this.quizConfigSource.asObservable();

  constructor() {}

  setQuizQuestions(questions: QuizQuestion[]) {
    const initializedQuestions = questions.map(q => ({
      ...q,
      selectedAnswer: q.selectedAnswer || null, 
      isCorrect: undefined 
    }));
    this.quizQuestionsSource.next(initializedQuestions);
    this.currentQuestionIndexSource.next(0); 
    this.quizResultSource.next(null); 
  }


  getQuizQuestions(): QuizQuestion[] {
    return this.quizQuestionsSource.getValue();
  }

  updateSelectedAnswer(questionIndex: number, selectedAnswer: string) {
    const currentQuestions = this.quizQuestionsSource.value;
    if (currentQuestions[questionIndex]) {
      currentQuestions[questionIndex].selectedAnswer = selectedAnswer;
    
      currentQuestions[questionIndex].isCorrect =
        selectedAnswer === currentQuestions[questionIndex].correctAnswer;
      this.quizQuestionsSource.next([...currentQuestions]); 
    }
  }

  moveToNextQuestion() {
    const currentIndex = this.currentQuestionIndexSource.value;
    const totalQuestions = this.quizQuestionsSource.value.length;
    if (currentIndex < totalQuestions - 1) {
      this.currentQuestionIndexSource.next(currentIndex + 1);
    }
    
  }

  moveToPreviousQuestion() {
    const currentIndex = this.currentQuestionIndexSource.value;
    if (currentIndex > 0) {
      this.currentQuestionIndexSource.next(currentIndex - 1);
    }
  }

  submitQuiz() {
    const questions = this.quizQuestionsSource.value;
    let correctAnswers = 0;

    questions.forEach((q) => {
      if (q.selectedAnswer !== null) {
        q.isCorrect = q.selectedAnswer === q.correctAnswer;
      } else {
        q.isCorrect = false;
      }

      if (q.isCorrect) {
        correctAnswers++;
      }
    });

    const result: QuizResult = {
      totalQuestions: questions.length,
      correctAnswers: correctAnswers,
      score: (correctAnswers / questions.length) * 100,
      questions: questions, 
    };
    this.quizResultSource.next(result);
  }

  setQuizConfig(config: QuizConfig) {
    this.quizConfigSource.next(config);
  }

  resetQuiz() {
    this.quizQuestionsSource.next([]);
    this.currentQuestionIndexSource.next(0);
    this.quizResultSource.next(null);
    this.quizConfigSource.next(null);
  }
}