// src/app/components/shared/models/quiz.model.ts

// Define available quiz modes
export type QuizMode = 'standard' | 'timed' | 'survival'; // You can add 'review' etc. later

// Interface for Timed Mode specific settings
export interface TimedModeSettings {
  timeLimitSeconds: number; // Total time for the quiz in seconds
  // You could also add perQuestionTimeLimitSeconds: number; if desired
}

// Update QuizConfig to include mode and potential mode-specific settings
export interface QuizConfig {
  difficulty: string;
  numberOfQuestions: number;
  topic: string;
  mode: QuizMode; // New property for the selected quiz mode
  timedModeSettings?: TimedModeSettings; // Optional settings for timed mode
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
  mode: QuizMode; // Store the mode the quiz was played in
  timeTakenSeconds?: number; // Store time taken for timed mode
}