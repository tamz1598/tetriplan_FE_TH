import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartTypeSelectionComponent } from './chart-type-selection.component';

describe('ChartTypeSelectionComponent', () => {
  let component: ChartTypeSelectionComponent;
  let fixture: ComponentFixture<ChartTypeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChartTypeSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
