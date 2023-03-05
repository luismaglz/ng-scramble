<h1 align="center">
   <b>
        NG Scramble
    </b>
</h1>

<p align="center">Angular component for transitioning between strings with a scramble effect</p>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Features](#features)
- [Installing](#installing)
  - [Package manager](#package-manager)
- [Example](#example)
- [Inputs](#inputs)
- [License](#license)

## Features

- Transition between different strings using a scramble effect
- Three different scramble and unscramble strategies (Randomized, left to right, right to left)
- Transition speed adjustment
- Text display duration adjustment
- Specify characters to use during scramble
- Option to padd the provided strings so they all scramble to the same length

## Installing

### Package manager

Using npm:

```bash
npm install ng-scramble
```

Using yarn:

```bash
yarn add ng-scramble
```

Once the package is installed, you can import the library using `import` or `require` approach:

```js
import { ScrambleTextComponent } from "ng-scramble";
```

It is configured as a standalone component so it can either be imported into a module or a component imports

```js
@Component({
  selector: 'app-component',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [CommonModule, NgScramble],
})
```

To render it in the template

```html
<ng-scramble [content]="textArray" [consistentSize]="true|false"></ng-scramble>
```

## Example

```html
<ng-scramble
  [content]="textArray"
  [consistentSize]="true"
  [scrambleMethod]="'LEFT-TO-RIGHT'"
  [unscrambleMethod]="'LEFT-TO-RIGHT'"
  [characterSet]="'ABCDEF'"
  [cycleInterval]="10"
  [displayCycles]="250"
  [textSelection]="'RANDOM'"
></ng-scramble>
```

[Live Example](https://stackblitz.com/edit/angular-vhojwt?file=src%2Fmain.ts)

## Inputs

- content
  - description: Array of strings to cycle through by scrambling
  - type: string[]
- consistentSize
  - description: Whether to pad every string in the array to match the longest string found so the scramble always returns to the same size. It uses the character '\u00A0' for the padding
  - type: boolean
  - default: false
- scrambleMethod
  - description: Method to use to scramble the text
  - type: string
  - values: 'LEFT-TO-RIGHT' | 'RIGHT-TO-LEFT' | 'RANDOM'
  - default: 'RANDOM'
- unscrambleMethod
  - description: Method to use to unscramble the text
  - type: string
  - values: 'LEFT-TO-RIGHT' | 'RIGHT-TO-LEFT' | 'RANDOM'
  - default: 'RANDOM'
- characterSet
  - description: Character set in the form of a string to use for scrambling the text. It will take the string provided and perform a split('') to turn it into an array
  - default: '123456789qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM'
- cycleInterval
  - description: Number in ms to define the interval at which the main loop is run. Every loop execution will either unscramble a single character, show the unscrambled text or scramble a sigle character
  - type: number
  - default: 10
- displayCycles
  - description: Defines how many loop cycles to display the unscrambled text for
  - type: number
  - default: 250
- textSelection
  - description: Defines how to select the next string in the arary of the content provided.
  - type: string
  - values:
    - 'ORDER' will use the array order to select the next string and loop back to the beginning
    - 'RANDOM' will use a random selection
- padDirection
  - description: Whether to pad the text right, center or left, this only works if consistentSize is set to true
  - values: 'LEFT' | 'RIGHT' | 'CENTER'
  - default: 'LEFT'
- timesToRescamble
  - description: Number of times to reshuffle each character in the scrambled text
  - type: number
  - default: 0
- loop
  - description:  Whether to continuosly loop through the text, currently it only works with textSelection 'ORDER'
  - type: boolean
  - default: true

## License

[MIT](LICENSE)
