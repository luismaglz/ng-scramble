import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgScrambleText } from './scramble-text.component';

describe('ScrambleTextComponent', () => {
  let component: NgScrambleText;
  let fixture: ComponentFixture<NgScrambleText>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScrambleText],
    }).compileComponents();

    fixture = TestBed.createComponent(NgScrambleText);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
