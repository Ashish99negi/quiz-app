import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatRadioModule } from '@angular/material/radio';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { QuizDataService } from '../../services/quiz-data/quiz-data.service';
import { QuizQuestion } from '../shared/models/quiz.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quiz-question',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatRadioModule,
    MatButtonModule,
    FormsModule
  ],
  templateUrl: './quiz-question.component.html',
  styleUrls: ['./quiz-question.component.scss'],
})
export class QuizQuestionComponent implements OnInit {
  questions: QuizQuestion[] = [];
  currentQuestion: QuizQuestion | null = null;
  currentQuestionIndex: number = 0;
  selectedOption: string | null = null;

  constructor(
    private quizDataService: QuizDataService,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.quizDataService.currentQuizQuestions.subscribe((questions) => {
      this.questions = questions;

      this.loadCurrentQuestion();
    });


    this.quizDataService.currentQuestionIndex.subscribe((index) => {
      this.currentQuestionIndex = index;
      this.loadCurrentQuestion();
    });
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

      this.quizDataService.submitQuiz();
      this.router.navigate(['/results']);
    }
  }

  onOptionChange(option: string) {
    this.selectedOption = option;
    this.quizDataService.updateSelectedAnswer(this.currentQuestionIndex, option);
  }


  goToNextOrSubmit() {

    if (this.isLastQuestion) {
      this.quizDataService.submitQuiz();
      this.router.navigate(['/results']);
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
}