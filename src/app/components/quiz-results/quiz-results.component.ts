import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
import { QuizResult, QuizQuestion } from '../shared/models/quiz.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-results',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz-results.component.html',
  styleUrls: ['./quiz-results.component.css'],
})
export class QuizResultsComponent implements OnInit {
  quizResult: QuizResult | null = null;
  expandedIndex: number | null = null;

  constructor(
    private quizDataService: QuizDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.quizDataService.currentQuizResult.subscribe((result) => {
      this.quizResult = result;
      if (!this.quizResult) {
        this.router.navigate(['/configure']);
      }
    });
  }

  getOptionClass(question: QuizQuestion, option: string): string {
    if (question.selectedAnswer === option && question.isCorrect) {
      return 'opt-correct-selected';
    } else if (question.selectedAnswer === option && !question.isCorrect) {
      return 'opt-wrong-selected';
    } else if (option === question.correctAnswer) {
      return 'opt-correct';
    }
    return '';
  }

  getOptionIcon(question: QuizQuestion, option: string): string {
    if (question.selectedAnswer === option && question.isCorrect) return '✓';
    if (question.selectedAnswer === option && !question.isCorrect) return '✗';
    if (option === question.correctAnswer) return '✓';
    return '';
  }

  toggleExpand(i: number) {
    this.expandedIndex = this.expandedIndex === i ? null : i;
  }

  get scoreGrade(): { emoji: string; label: string; color: string } {
    const score = this.quizResult?.score ?? 0;
    if (score >= 90) return { emoji: '🏆', label: 'Excellent!', color: '#fbbf24' };
    if (score >= 75) return { emoji: '🌟', label: 'Great Job!', color: '#10b981' };
    if (score >= 50) return { emoji: '👍', label: 'Good Effort!', color: '#8b5cf6' };
    if (score >= 25) return { emoji: '📚', label: 'Keep Studying!', color: '#f59e0b' };
    return { emoji: '💪', label: 'Try Again!', color: '#f87171' };
  }

  get circumference(): number {
    return 2 * Math.PI * 54;
  }

  get dashOffset(): number {
    const score = this.quizResult?.score ?? 0;
    return this.circumference - (score / 100) * this.circumference;
  }

  formatTime(seconds: number): string {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  startNewQuiz() {
    this.quizDataService.resetQuiz();
    this.router.navigate(['/']);
  }
}
