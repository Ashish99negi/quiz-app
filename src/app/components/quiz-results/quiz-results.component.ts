// src/app/components/quiz-results/quiz-results.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
import { QuizResult, QuizQuestion } from '../shared/models/quiz.model';
import { Router } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar'; // Assuming you have this for header
import { MatIconModule } from '@angular/material/icon'; // Assuming you have this for header

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatToolbarModule, // Add if using in header
    MatIconModule // Add if using icons
  ],
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.scss'],
})
export class QuizResultsComponent implements OnInit {
  quizResult: QuizResult | null = null;

  constructor(
    private quizDataService: QuizDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizDataService.currentQuizResult.subscribe((result) => {
      this.quizResult = result;
      if (!this.quizResult) {
        this.router.navigate(['/']);
      }
    });
  }

  getOptionClass(question: QuizQuestion, option: string): string {
    if (question.selectedAnswer === option && question.isCorrect) {
      return 'correct-answer-selected';
    } else if (question.selectedAnswer === option && !question.isCorrect) {
      return 'wrong-answer-selected';
    } else if (option === question.correctAnswer) {
      return 'correct-answer';
    }
    return '';
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  startNewQuiz() {
    this.quizDataService.resetQuiz(); // Call resetQuiz to clear state
    this.router.navigate(['/']);
  }
}