import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuizConfigComponent } from './quiz-config.component';

describe('QuizConfigComponent', () => {
  let component: QuizConfigComponent;
  let fixture: ComponentFixture<QuizConfigComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuizConfigComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(QuizConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
