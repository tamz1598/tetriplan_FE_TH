import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataTypeSelectionComponent } from './data-type-selection.component';

describe('DataTypeSelectionComponent', () => {
  let component: DataTypeSelectionComponent;
  let fixture: ComponentFixture<DataTypeSelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DataTypeSelectionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DataTypeSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
