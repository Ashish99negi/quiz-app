export interface QuizConfig {
  difficulty: string;
  numberOfQuestions: number;
  topic: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect?: boolean;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  questions: QuizQuestion[];
}