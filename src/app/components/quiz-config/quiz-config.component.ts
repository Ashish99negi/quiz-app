
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Router } from '@angular/router';
import { GeminiService } from '../../services/gemini/gemini.service';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
import { QuizConfig } from '../shared/models/quiz.model';
import { CommonModule } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';

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
    MatOptionModule,
    MatButtonModule,
    MatProgressBarModule
  ],
  templateUrl: './quiz-config.component.html',
  styleUrls: ['./quiz-config.component.scss'],
})
export class QuizConfigComponent implements OnInit {
  difficultyLevels = ['easy', 'medium', 'hard'];
  numberOfQuestionsOptions = [5, 10, 15, 20];

  quizConfig: QuizConfig = {
    difficulty: 'medium',
    numberOfQuestions: 10,
    topic: '',
  };
  isLoading = false;

  constructor(
    private geminiService: GeminiService,
    private quizDataService: QuizDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    console.log("page loaded")
  }

  async generateQuiz() {
    console.log('Generating quiz with config:', this.quizConfig);
    if (!this.quizConfig.topic) {
      alert('Please enter a topic for the quiz.');
      return;
    }

    this.isLoading = true;
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
      alert('An error occurred while generating the quiz. Please check your network connection.');
    } finally {
      this.isLoading = false;
    }
  }
}