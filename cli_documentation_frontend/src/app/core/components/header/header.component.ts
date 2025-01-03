import { Component, inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SignalsService } from '../../../shared/services/signals.service';
import { MatTooltipModule } from '@angular/material/tooltip'
import { MatDialog } from '@angular/material/dialog';
import { NewDocumentationComponent } from './modals/new-documentation/new-documentation.component';
@Component({
  selector: 'app-header',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  public _signals = inject(SignalsService)
  private readonly dialog = inject(MatDialog)

  public openCreateNewDocumentationModal(): void {
    const dialogRef = this.dialog.open(NewDocumentationComponent, {
      data: 'git',
      minWidth: '40vw',
      maxHeight: '90vh',
      disableClose: true,
      closeOnNavigation: true
    });
    dialogRef.afterClosed().subscribe();
  }

}
