import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini/gemini.service';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
import { QuizConfig, QuizMode } from '../shared/models/quiz.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatProgressBarModule,
  ],
  templateUrl: './quiz-config.component.html',
  styleUrls: ['./quiz-config.component.css'],
})
export class QuizConfigComponent {
  difficultyLevels = [
    { value: 'easy', label: 'Easy', icon: '🌱', desc: 'Beginner friendly' },
    { value: 'medium', label: 'Medium', icon: '🔥', desc: 'Some challenge' },
    { value: 'hard', label: 'Hard', icon: '💀', desc: 'Expert level' },
  ];

  numberOfQuestionsOptions = [5, 10, 15, 20];

  quizModes = [
    { value: 'standard' as QuizMode, label: 'Standard', icon: '📝', desc: 'Answer at your own pace' },
    { value: 'timed' as QuizMode, label: 'Timed', icon: '⏱️', desc: 'Race against the clock' },
    { value: 'survival' as QuizMode, label: 'Survival', icon: '💀', desc: 'One wrong = game over' },
  ];

  timeLimitOptions = [1, 2, 5, 10];

  quizConfig: QuizConfig = {
    difficulty: 'medium',
    numberOfQuestions: 10,
    topic: '',
    mode: 'standard',
    timedModeSettings: { timeLimitSeconds: 300 },
  };

  isLoading = false;
  errorMessage = '';

  constructor(
    private geminiService: GeminiService,
    private quizDataService: QuizDataService,
    private router: Router
  ) {}

  onModeChange(mode: QuizMode): void {
    this.quizConfig.mode = mode;
    if (mode !== 'timed') {
      this.quizConfig.timedModeSettings = undefined;
    } else if (!this.quizConfig.timedModeSettings) {
      this.quizConfig.timedModeSettings = { timeLimitSeconds: 300 };
    }
  }

  setDifficulty(level: string) {
    this.quizConfig.difficulty = level;
  }

  setNumberOfQuestions(n: number) {
    this.quizConfig.numberOfQuestions = n;
  }

  setTimeLimit(minutes: number) {
    if (this.quizConfig.timedModeSettings) {
      this.quizConfig.timedModeSettings.timeLimitSeconds = minutes * 60;
    }
  }

  getTimeLimitMinutes(): number {
    return this.quizConfig.timedModeSettings
      ? this.quizConfig.timedModeSettings.timeLimitSeconds / 60
      : 5;
  }

  goBack() {
    this.router.navigate(['/']);
  }

  async generateQuiz() {
    if (!this.quizConfig.topic.trim()) {
      this.errorMessage = 'Please enter a topic for the quiz.';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.quizDataService.setQuizConfig(this.quizConfig);

    try {
      const questions = await this.geminiService.generateQuizQuestions(
        this.quizConfig.topic,
        this.quizConfig.difficulty,
        this.quizConfig.numberOfQuestions
      );
      if (questions && questions.length > 0) {
        this.quizDataService.setQuizQuestions(questions);
        this.router.navigate(['/quiz']);
      } else {
        this.errorMessage = 'Could not generate questions. Try a different topic or settings.';
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      this.errorMessage = 'An error occurred. Please check your connection and try again.';
    } finally {
      this.isLoading = false;
    }
  }
}
