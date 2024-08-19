import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AIRecommendTasksComponent } from './airecommend-tasks.component';

describe('AIRecommendTasksComponent', () => {
  let component: AIRecommendTasksComponent;
  let fixture: ComponentFixture<AIRecommendTasksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AIRecommendTasksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AIRecommendTasksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
