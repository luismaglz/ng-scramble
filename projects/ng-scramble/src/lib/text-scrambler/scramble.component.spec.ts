import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgScramble } from './scramble.component';

describe('ScrambleTextComponent', () => {
  let component: NgScramble;
  let fixture: ComponentFixture<NgScramble>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NgScramble],
    }).compileComponents();

    fixture = TestBed.createComponent(NgScramble);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
