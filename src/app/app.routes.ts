// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { QuizConfigComponent } from './components/quiz-config/quiz-config.component';
import { QuizQuestionComponent } from './components/quiz-question/quiz-question.component';
import { QuizResultsComponent } from './components/quiz-results/quiz-results.component';

export const routes: Routes = [
  { path: '', component: QuizConfigComponent }, // This is your default route!
  { path: 'quiz', component: QuizQuestionComponent },
  { path: 'results', component: QuizResultsComponent },
  { path: '**', redirectTo: '' }, // Redirect any unknown routes to the default
];