import { Routes } from '@angular/router';
import { LandingComponent } from './components/landing/landing.component';
import { QuizConfigComponent } from './components/quiz-config/quiz-config.component';
import { QuizQuestionComponent } from './components/quiz-question/quiz-question.component';
import { QuizResultsComponent } from './components/quiz-results/quiz-results.component';

export const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'configure', component: QuizConfigComponent },
  { path: 'quiz', component: QuizQuestionComponent },
  { path: 'results', component: QuizResultsComponent },
  { path: '**', redirectTo: '' },
];
