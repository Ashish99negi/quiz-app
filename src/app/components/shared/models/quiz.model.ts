export type QuizMode = 'standard' | 'timed' | 'survival';

export interface TimedModeSettings {
  timeLimitSeconds: number;
}

export interface QuizConfig {
  difficulty: string;
  numberOfQuestions: number;
  topic: string;
  mode: QuizMode;
  timedModeSettings?: TimedModeSettings;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: string;
  selectedAnswer: string | null;
  isCorrect: boolean | undefined;
}

export interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  questions: QuizQuestion[];
  mode: QuizMode;
  timeTakenSeconds?: number;
}
