import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'ng-scramble-test';

  quotes: string[] = [
    "Gentlemen, you can't fight in here.",
    'This is the war room.',
    'My mother always used to say',
    'The older you get',
    'the better you get',
    'unless you’re a banana.',
  ];
}
