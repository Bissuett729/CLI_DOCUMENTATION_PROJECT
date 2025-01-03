import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { firstValueFrom, timeout } from 'rxjs';
import { RequestsService } from '../../../../../shared/services/requests.service';
import { SweetAlert2Service } from '../../../../../shared/services/sweetAlert2.service';
@Component({
  selector: 'app-new-documentation',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-documentation.component.html',
  styleUrl: './new-documentation.component.scss'
})
export class NewDocumentationComponent {

  private readonly _SweetAlert2Service = inject(SweetAlert2Service)
  private readonly _RequestsService = inject(RequestsService)

  readonly dialogRef = inject(MatDialogRef<NewDocumentationComponent>);
  private formBuilder = inject(FormBuilder);

  public createNewDocumentationForm = this.formBuilder.group({
    title: ['', Validators.required],
    icon: ['', Validators.required],
    color: [null, Validators.required],
    link: ''
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async generateNewGroup() {
    try {
      const { title, color, icon, link } = this.createNewDocumentationForm.value
      if (title && color && icon && link ) {
        const data = {
          "label": title.charAt(0).toUpperCase() + title.slice(1),
          "icon": icon,
          "link": link,
          "url": `doc/${title.charAt(0).toLowerCase() + title.slice(1)}`,
          "value": title.charAt(0).toLowerCase() + title.slice(1),
          "colorLabel": color,
          "commands": []
        };
        await firstValueFrom(this._RequestsService.post(`cli-documentation/v1/groups/create`, data).pipe(timeout(10000)));
        this._SweetAlert2Service.show_succesful_message('Nuevo grupo creado con exito')
        this.onNoClick()
      }
    } catch (error) {
      // Verifica si el error tiene una propiedad 'error' y esta tiene una propiedad 'message'
      if (error instanceof HttpErrorResponse && error.error?.message) {
        this._SweetAlert2Service.show_error_message(error.error.message);
      } else {
        this._SweetAlert2Service.show_error_message('Ha ocurrido un error desconocido', 'Error');
      }
      console.error(error);
    }
  }
}
