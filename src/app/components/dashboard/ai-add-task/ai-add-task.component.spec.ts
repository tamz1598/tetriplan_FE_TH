import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AiAddTaskComponent } from './ai-add-task.component';

describe('AiAddTaskComponent', () => {
  let component: AiAddTaskComponent;
  let fixture: ComponentFixture<AiAddTaskComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AiAddTaskComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AiAddTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
