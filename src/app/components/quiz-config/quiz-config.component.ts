// src/app/components/quiz-config/quiz-config.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatOptionModule } from '@angular/material/core'; // Ensure MatOptionModule is imported
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini/gemini.service';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
// Import the updated QuizConfig, QuizMode, TimedModeSettings
import { QuizConfig, QuizMode, TimedModeSettings } from '../shared/models/quiz.model';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-quiz-config',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule, // Make sure this is here!
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './quiz-config.component.html',
  styleUrls: ['./quiz-config.component.scss'],
})
export class QuizConfigComponent {
  difficultyLevels = ['easy', 'medium', 'hard'];
  numberOfQuestionsOptions = [5, 10, 15, 20];
  quizModes: QuizMode[] = ['standard', 'timed', 'survival']; // Available modes
  timeLimitOptions = [1, 2, 5, 10]; // Time limits in minutes

  quizConfig: QuizConfig = {
    difficulty: 'medium',
    numberOfQuestions: 10,
    topic: '',
    mode: 'standard', // Default mode
    timedModeSettings: { timeLimitSeconds: 300 }, // Default for timed mode (5 minutes)
  };
  isLoading = false;

  constructor(
    private geminiService: GeminiService,
    private quizDataService: QuizDataService,
    private router: Router
  ) {}

  onModeChange(): void {
    // Reset timedModeSettings if mode changes from 'timed' to something else
    if (this.quizConfig.mode !== 'timed') {
      this.quizConfig.timedModeSettings = undefined;
    } else if (!this.quizConfig.timedModeSettings) {
      // If switching TO timed mode and settings are not initialized, set a default
      this.quizConfig.timedModeSettings = { timeLimitSeconds: 300 }; // 5 minutes default
    }
  }

  async generateQuiz() {
    console.log('Generating quiz with config:', this.quizConfig);
    if (!this.quizConfig.topic) {
      alert('Please enter a topic for the quiz.');
      return;
    }

    this.isLoading = true;
    // Save the full quizConfig, including mode and settings
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
        alert('Could not generate quiz questions. Please try again with a different topic or settings.');
      }
    } catch (error) {
      console.error('Error generating quiz:', error);
      alert('An error occurred while generating the quiz. Please check your API key or network connection.');
    } finally {
      this.isLoading = false;
    }
  }
}