import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  Subscription,
  combineLatest,
  interval,
  map,
  switchMap,
  takeUntil,
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
  @Input() set consistentSize(consitent: boolean) {
    this._consitentSize.next(consitent);
  }

  protected _consitentSize: BehaviorSubject<boolean> = new BehaviorSubject(
    false
  );

  /**
   * Number of times to reshuffle each character in the scrambled text
   */
  @Input() timesToRescamble: number | undefined;

  /**
   * Whether to pad the text right, center or left, this only works if consistentSize is set to true
   */
  @Input() padDirection: 'LEFT' | 'RIGHT' | 'CENTER' = 'LEFT';

  /**
   * Whether to continuosly loop through the text, currently it only works with textSelection 'ORDER'
   */
  @Input() loop: boolean = true;

  /**
   * Array of strings to cycle through by scrambling
   */
  @Input() set content(items: string[]) {
    if (items) {
      this._valueArray.next(items);
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
  @Input() characterSet: string =
    '123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';

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

  // Keeps track of the cycles to display the text once unscrambled
  protected textDisplayCount: number = 0;

  // Split characters to use to scramble the text
  protected scrambleCharacters: string[] = this.characterSet.split('');

  // Main scramble sumbscription
  protected subscription: Subscription | undefined;

  // Behavior subject containing all the strings to transition between
  protected _valueArray: BehaviorSubject<string[]> = new BehaviorSubject<
    string[]
  >([]);

  // Original text being scrambled / unscrambled
  protected activeText: string = '';

  // Text with the scramble / unscramble modifications
  protected scrambledText: string = '';

  // Status for the loop to transition between scramble, showing or unscrambling
  protected status: 'UNSCRAMBLING' | 'SCRAMBLING' | 'RESHUFFLE' | 'SHOWING' =
    'UNSCRAMBLING';

  protected end$: Subject<void> = new Subject<void>();

  protected activeIndex: number = 0;
  protected reScrambleCount: number = 0;
  protected reScrambleOriginal: string = '';

  protected previousScramble: string = '';

  protected scrambler$: Observable<string> = this.interval$.pipe(
    takeUntil(this.end$),
    switchMap((intervalValue) =>
      combineLatest([
        this._valueArray,
        interval(intervalValue).pipe(takeUntil(this.end$)),
        this._consitentSize,
      ]).pipe(
        map(([textArray, , consistentSize]) => {
          if (consistentSize) {
            return this.scrambleLoop(padText(textArray, this.padDirection));
          } else {
            return this.scrambleLoop(textArray);
          }
        })
      )
    )
  );

  /**
   * Main scramble loop
   */
  scrambleLoop(contentArray: string[]): string {
    if (!this.activeText) {
      this.selectNewText(contentArray);
    }

    switch (this.status) {
      case 'UNSCRAMBLING': {
        this.scrambledText = this.unscramble();
        if (this.scrambledText === this.activeText) {
          this.status = 'SHOWING';
        }
        break;
      }
      case 'SHOWING': {
        if (
          this.loop === false &&
          contentArray.indexOf(this.activeText) === contentArray.length - 1
        ) {
          this.end$.next();
          break;
        }
        this.textDisplayCount++;
        if (this.textDisplayCount > this.displayCycles) {
          this.status = 'SCRAMBLING';
        }
        break;
      }
      case 'SCRAMBLING': {
        if (isTextFullyScrambled(this.scrambledText, this.activeText)) {
          if (this.timesToRescamble) {
            this.status = 'RESHUFFLE';
            this.reScrambleOriginal = this.scrambledText;
          } else {
            this.selectNewText(contentArray);
            this.status = 'UNSCRAMBLING';
          }
          break;
        }
        this.scrambledText = this.scramble(this.activeText);
        break;
      }
      case 'RESHUFFLE': {
        if (this.reScrambleCount === this.timesToRescamble) {
          this.status = 'UNSCRAMBLING';
          this.reScrambleCount = 0;
          this.selectNewText(contentArray);
          break;
        } else {
          this.scrambledText = this.scramble(this.reScrambleOriginal);
        }

        if (isTextFullyScrambled(this.scrambledText, this.reScrambleOriginal)) {
          this.reScrambleCount++;
          this.reScrambleOriginal = this.scrambledText;
        }

        break;
      }
    }

    return this.scrambledText;
  }

  /**
   * Scramble strategy selector
   */
  scramble(originalText: string): string {
    switch (this.scrambleMethod) {
      case 'LEFT-TO-RIGHT':
        return scrambleLeftToRight(
          originalText,
          this.scrambledText,
          this.scrambleCharacters
        );
      case 'RIGHT-TO-LEFT':
        return scrambleRightToLeft(
          originalText,
          this.scrambledText,
          this.scrambleCharacters
        );
      case 'RANDOM':
      default:
        return scrambleRandom(
          this.scrambledText,
          originalText,
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
      this.activeText = textArray[this.activeIndex];
      if (!textArray[this.activeIndex + 1]) {
        this.activeIndex = 0;
      } else {
        this.activeIndex++;
      }
    }
    this.scrambledText = scrambleText(this.activeText, this.scrambleCharacters);
    this.textDisplayCount = 0;
  }
}
