import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
import { QuizQuestion, QuizMode } from '../shared/models/quiz.model';
import { Router } from '@angular/router';
import { Subscription, interval } from 'rxjs';

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    MatProgressBarModule,
  ],
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.css'],
})
export class QuizQuestionComponent implements OnInit, OnDestroy {
  questions: QuizQuestion[] = [];
  currentQuestion: QuizQuestion | null = null;
  currentQuestionIndex: number = 0;
  selectedOption: string | null = null;

  quizMode: QuizMode = 'standard';
  quizTopic: string = '';
  initialTimeLimit: number = 0;
  timeRemaining: number = 0;
  private timerSubscription: Subscription | undefined;
  private quizStartTime: number | undefined;

  optionLabels = ['A', 'B', 'C', 'D', 'E'];

  constructor(
    private quizDataService: QuizDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizDataService.currentQuizConfig.subscribe(config => {
      if (config) {
        this.quizMode = config.mode;
        this.quizTopic = config.topic;
        if (this.quizMode === 'timed' && config.timedModeSettings) {
          this.initialTimeLimit = config.timedModeSettings.timeLimitSeconds;
          this.timeRemaining = this.initialTimeLimit;
          this.startTimer();
          this.quizStartTime = Date.now();
        }
      } else {
        this.router.navigate(['/configure']);
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
      this.router.navigate(['/configure']);
      return;
    }

    if (this.currentQuestionIndex < this.questions.length) {
      this.currentQuestion = this.questions[this.currentQuestionIndex];
      this.selectedOption = this.currentQuestion.selectedAnswer;
    } else {
      this.submitQuizAndNavigate();
    }
  }

  onOptionSelect(option: string) {
    this.selectedOption = option;
    this.quizDataService.updateSelectedAnswer(this.currentQuestionIndex, option);
    if (this.quizMode === 'survival' && this.currentQuestion) {
      if (option !== this.currentQuestion.correctAnswer) {
        setTimeout(() => this.submitQuizAndNavigate(), 600);
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

  get progressPercent(): number {
    if (this.questions.length === 0) return 0;
    return ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
  }

  get timerPercent(): number {
    if (this.initialTimeLimit === 0) return 100;
    return (this.timeRemaining / this.initialTimeLimit) * 100;
  }

  get timerColor(): string {
    if (this.timerPercent > 50) return 'safe';
    if (this.timerPercent > 25) return 'warning';
    return 'danger';
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
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
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
