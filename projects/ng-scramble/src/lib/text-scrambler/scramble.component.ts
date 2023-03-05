import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subscription,
  combineLatest,
  interval,
  map,
  switchMap,
} from 'rxjs';
import { isTextFullyScrambled } from './utilities/is-text-fully-scrambled';
import { padText } from './utilities/pad-text';
import { pickRandomListItem } from './utilities/pick-random-list-item';
import { scrambleLeftToRight } from './utilities/scramble-left-to-right';
import { scrambleRandom } from './utilities/scramble-random';
import { scrambleRightToLeft } from './utilities/scramble-right-to-left';
import { scrambleText } from './utilities/scramble-text';
import { unscrambleLeftToRight } from './utilities/unscramble-left-to-right';
import { unscrambleRandom } from './utilities/unscramble-random';
import { unscrambleRightToLeft } from './utilities/unscramble-right-to-left';

@Component({
  selector: 'ng-scramble',
  templateUrl: './scramble.component.html',
  styleUrls: ['./scramble.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class NgScramble {
  /**
   * Whether to pad every string in the array to match the longest string found so
   * the scramble always returns to the same size.
   * It uses the character '\u00A0' for the padding
   * type boolean
   * default false
   */
  @Input() consistentSize: boolean = false;

  /**
   * Array of strings to cycle through by scrambling
   */
  @Input() set content(items: string[]) {
    if (items) {
      this._text$.next(items);
    }
  }

  /**
   * Method to use to scramble the text
   * type 'LEFT-TO-RIGHT' | 'RIGHT-TO-LEFT' | 'RANDOM'
   * default: 'RANDOM'
   */
  @Input() scrambleMethod: 'LEFT-TO-RIGHT' | 'RIGHT-TO-LEFT' | 'RANDOM' =
    'RANDOM';

  /**
   * Method to use to unscramble the text
   * type 'LEFT-TO-RIGHT' | 'RIGHT-TO-LEFT' | 'RANDOM'
   * default: 'RANDOM'
   */
  @Input() unscrambleMethod: 'LEFT-TO-RIGHT' | 'RIGHT-TO-LEFT' | 'RANDOM' =
    'RANDOM';

  /**
   * Character set in the form of a string to use for scrambling the text.
   * It will take the string provided and perform a split('') to turn it into an array
   * type string
   * default: '123456789!@#$%^&()_+qwertyuiop[]asdfghjkl;zxcvbnmQWERTYUIOP{}ASDFGHJKL:ZXCVBNM<>?'
   */
  @Input() set characterSet(characters: string | string[]) {
    if (
      Array.isArray(characters) &&
      characters.length > 0 &&
      characters.every((c) => c.length === 1)
    ) {
      this.scrambleCharacters = characters;
    } else {
      this.scrambleCharacters = (characters || this._defaultSet).split('');
    }
  }

  /**
   * Number in ms to define the interval at which the main loop is run.
   * Every loop execution will either unscramble a single character, show the unscrambled text or scramble a sigle character
   * type number
   * default: 10
   */
  @Input() set cycleInterval(cycleInterval: number) {
    this.interval$.next(cycleInterval || 10);
  }

  interval$: BehaviorSubject<number> = new BehaviorSubject<number>(10);

  /**
   * Defines how many loop cycles to display the unscrambled text for
   * type number
   * default 250
   */
  @Input() displayCycles: number = 250;

  /**
   * Defines how to select the next string in the arary of the content provided.
   * type 'ORDER' | 'RANDOM'
   * default 'RANDOM'
   */
  @Input() textSelection: 'ORDER' | 'RANDOM' = 'RANDOM';

  protected _defaultSet: string =
    '123456789!@#$%^&()_+qwertyuiop[]asdfghjkl;zxcvbnmQWERTYUIOP{}ASDFGHJKL:ZXCVBNM<>?';

  // Keeps track of the cycles to display the text once unscrambled
  protected textDisplayCount: number = 0;

  // Split characters to use to scramble the text
  protected scrambleCharacters: string[] = this._defaultSet.split('');

  // Main scramble sumbscription
  protected subscription: Subscription | undefined;

  // Behavior subject containing all the strings to transition between
  protected _text$: BehaviorSubject<string[]> = new BehaviorSubject<string[]>(
    []
  );

  protected texts$: Observable<string[]> = this._text$.pipe(
    map((text) => {
      if (this.consistentSize) {
        return padText(text);
      }
      return text;
    })
  );

  // Original text being scrambled / unscrambled
  protected activeText: string = '';

  // Text with the scramble / unscramble modifications
  protected scrambledText: string = '';

  // Status for the loop to transition between scramble, showing or unscrambling
  protected status: 'UNSCRAMBLING' | 'SCRAMBLING' | 'SHOWING' = 'UNSCRAMBLING';

  protected scrambler$: Observable<string> = this.interval$.pipe(
    switchMap((intervalValue) =>
      combineLatest([this.texts$, interval(intervalValue)]).pipe(
        map(([quotes]) => this.scrambleLoop(quotes))
      )
    )
  );

  /**
   * Main scramble loop
   */
  scrambleLoop(quotes: string[]): string {
    if (!this.activeText) {
      this.selectNewText(quotes);
    }

    if (this.status === 'UNSCRAMBLING') {
      this.scrambledText = this.unscramble();
      if (this.scrambledText === this.activeText) {
        this.status = 'SHOWING';
      }
    } else if (this.status === 'SHOWING') {
      this.textDisplayCount++;
      if (this.textDisplayCount > this.displayCycles) {
        this.status = 'SCRAMBLING';
      }
    } else {
      this.scrambledText = this.scramble();

      if (isTextFullyScrambled(this.scrambledText, this.activeText)) {
        this.selectNewText(quotes);
        this.status = 'UNSCRAMBLING';
      }
    }

    return this.scrambledText;
  }

  /**
   * Scramble strategy selector
   */
  scramble(): string {
    switch (this.scrambleMethod) {
      case 'LEFT-TO-RIGHT':
        return scrambleLeftToRight(
          this.activeText,
          this.scrambledText,
          this.scrambleCharacters
        );
      case 'RIGHT-TO-LEFT':
        return scrambleRightToLeft(
          this.activeText,
          this.scrambledText,
          this.scrambleCharacters
        );
      case 'RANDOM':
      default:
        return scrambleRandom(
          this.scrambledText,
          this.activeText,
          this.scrambleCharacters
        );
    }
  }

  /**
   * Unscramble strategy selector
   */
  unscramble(): string {
    switch (this.unscrambleMethod) {
      case 'LEFT-TO-RIGHT':
        return unscrambleLeftToRight(this.scrambledText, this.activeText);
      case 'RIGHT-TO-LEFT':
        return unscrambleRightToLeft(this.scrambledText, this.activeText);
      case 'RANDOM':
      default:
        return unscrambleRandom(this.scrambledText, this.activeText);
    }
  }

  /**
   * Select a new piece of text to scramble
   */
  selectNewText(textArray: string[]): void {
    if (this.textSelection === 'RANDOM') {
      this.activeText = pickRandomListItem(textArray);
    }

    if (this.textSelection === 'ORDER') {
      if (!this.activeText) {
        this.activeText = textArray[0];
      } else {
        const currentIndex = this.content.findIndex(
          (t) => t === this.activeText
        );
        this.activeText =
          textArray[currentIndex + 1] !== undefined
            ? textArray[currentIndex + 1]
            : textArray[0];
      }
    }
    this.scrambledText = scrambleText(this.activeText, this.scrambleCharacters);
    this.textDisplayCount = 0;
  }
}
