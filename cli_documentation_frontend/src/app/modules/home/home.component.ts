import { Component, inject } from '@angular/core';
import { SignalsService } from '../../shared/services/signals.service';

@Component({
  selector: 'app-home',
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

    public _signals = inject(SignalsService)
  
    ngOnInit(): void {
      localStorage.removeItem('selectedGroup')
      this._signals.setLabelHeader('Bienvenido a la documentación CLI :)')
    }

}
