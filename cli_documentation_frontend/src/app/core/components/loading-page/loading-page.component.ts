import { Component, inject } from '@angular/core';
import { SignalsService } from '../../../shared/services/signals.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-page',
  imports: [
    CommonModule
  ],
  templateUrl: './loading-page.component.html',
  styleUrl: './loading-page.component.scss'
})
export class LoadingPageComponent {
  public readonly _signals = inject(SignalsService)
}
