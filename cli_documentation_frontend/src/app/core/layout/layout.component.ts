import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
// Core components
import { HeaderComponent } from '../components/header/header.component';
import { SidebarComponent } from '../components/sidebar/sidebar.component';
import { LoadingPageComponent } from '../components/loading-page/loading-page.component';
// Signals
import { SignalsService } from '../../shared/services/signals.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-layout',
  imports: [
    CommonModule,
    RouterModule,
    HeaderComponent,
    SidebarComponent,
    LoadingPageComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent {

  public _signals = inject(SignalsService)

}
