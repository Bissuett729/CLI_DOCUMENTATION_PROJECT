import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
// Signals
import { SignalsService } from './shared/services/signals.service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `<router-outlet></router-outlet>`
})
export class AppComponent {
  private _signals = inject(SignalsService)

  constructor() {
    this._signals.setThemeDark(localStorage.getItem('isThemeDark') === 'yes')
  }
}
