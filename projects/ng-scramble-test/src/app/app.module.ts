import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { NgScramble } from '../../../ng-scramble/src/public-api';
import { AppComponent } from './app.component';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, NgScramble],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
