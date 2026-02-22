import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent {
  features = [
    {
      icon: '⚡',
      title: 'AI-Powered Generation',
      desc: 'Gemini AI creates unique questions on any topic instantly.',
    },
    {
      icon: '🎯',
      title: 'Three Quiz Modes',
      desc: 'Standard, Timed, and Survival — challenge yourself your way.',
    },
    {
      icon: '📊',
      title: 'Difficulty Levels',
      desc: 'Choose Easy, Medium, or Hard to match your knowledge level.',
    },
    {
      icon: '🏆',
      title: 'Detailed Results',
      desc: 'Review every answer with correct solutions highlighted.',
    },
    {
      icon: '⏱️',
      title: 'Race the Clock',
      desc: 'Timed mode adds pressure — can you beat the timer?',
    },
    {
      icon: '💀',
      title: 'Survival Mode',
      desc: 'One wrong answer and it\'s game over. How far can you go?',
    },
  ];

  constructor(private router: Router) {}

  startQuiz() {
    this.router.navigate(['/configure']);
  }
}
