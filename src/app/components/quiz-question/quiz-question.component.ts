// src/app/components/quiz-question/quiz-question.component.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
import { QuizConfig, QuizQuestion, QuizMode, TimedModeSettings, QuizResult } from '../shared/models/quiz.model';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    FormsModule,
    MatProgressBarModule
  ],
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.scss'],
})
export class QuizQuestionComponent implements OnInit, OnDestroy {
  questions: QuizQuestion[] = [];
  currentQuestion: QuizQuestion | null = null;
  currentQuestionIndex: number = 0;
  selectedOption: string | null = null;

  quizMode: QuizMode = 'standard';
  initialTimeLimit: number = 0;
  timeRemaining: number = 0;
  private timerSubscription: Subscription | undefined;
  private quizStartTime: number | undefined;

  constructor(
    private quizDataService: QuizDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizDataService.currentQuizConfig.subscribe(config => {
      if (config) {
        this.quizMode = config.mode;
        if (this.quizMode === 'timed' && config.timedModeSettings) {
          this.initialTimeLimit = config.timedModeSettings.timeLimitSeconds;
          this.timeRemaining = this.initialTimeLimit;
          this.startTimer();
          this.quizStartTime = Date.now();
        }
      } else {
        this.router.navigate(['/']);
      }
    });

    this.quizDataService.currentQuizQuestions.subscribe((questions) => {
      this.questions = questions;
      this.loadCurrentQuestion();
    });

    this.quizDataService.currentQuestionIndex.subscribe((index) => {
      this.currentQuestionIndex = index;
      this.loadCurrentQuestion();
    });
  }

  ngOnDestroy(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }
  }

  loadCurrentQuestion() {
    if (this.questions.length === 0) {
      this.router.navigate(['/']);
      return;
    }

    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.selectedOption = this.currentQuestion.selectedAnswer;
    } else {
      this.submitQuizAndNavigate();
    }
  }

  onOptionChange(option: string) {
    this.selectedOption = option;
    this.quizDataService.updateSelectedAnswer(this.currentQuestionIndex, option);
    if (this.quizMode === 'survival' && this.currentQuestion) {
      const isCorrect = (option === this.currentQuestion.correctAnswer);
      if (!isCorrect) {
        this.submitQuizAndNavigate();
      }
    }
  }

  goToNextOrSubmit() {
    if (this.quizMode === 'survival' && this.currentQuestion && !this.currentQuestion.isCorrect) {
        this.submitQuizAndNavigate();
        return;
    }

    if (this.isLastQuestion) {
      this.submitQuizAndNavigate();
    } else {
      this.quizDataService.moveToNextQuestion();
    }
  }

  goToPreviousQuestion() {
    this.quizDataService.moveToPreviousQuestion();
  }

  get isLastQuestion(): boolean {
    return this.currentQuestionIndex === this.questions.length - 1;
  }

  startTimer(): void {
    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.timerSubscription = interval(1000).subscribe(() => {
      this.timeRemaining--;
      if (this.timeRemaining <= 0) {
        this.timeRemaining = 0;
        this.submitQuizAndNavigate();
      }
    });
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');
    return `${formattedMinutes}:${formattedSeconds}`;
  }

  submitQuizAndNavigate(): void {
    let timeTaken: number | undefined;
    if (this.quizMode === 'timed' && this.quizStartTime !== undefined) {
      timeTaken = Math.floor((Date.now() - this.quizStartTime) / 1000);
    }

    if (this.timerSubscription) {
      this.timerSubscription.unsubscribe();
    }

    this.quizDataService.submitQuiz(timeTaken);
    this.router.navigate(['/results']);
  }
}