import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SweetAlert2Service } from '../../../../shared/services/sweetAlert2.service';
import { RequestsService } from '../../../../shared/services/requests.service';
import { HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, timeout } from 'rxjs';

@Component({
  selector: 'app-new-command',
  imports: [
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './new-command.component.html',
  styleUrl: './new-command.component.scss'
})
export class NewCommandComponent implements OnInit {

  private readonly _SweetAlert2Service = inject(SweetAlert2Service)
  private readonly _RequestsService = inject(RequestsService)
  readonly dialogRef = inject(MatDialogRef<NewCommandComponent>);
  readonly dataGroup = inject<any>(MAT_DIALOG_DATA);
  private formBuilder = inject(FormBuilder);

  public createNewCommandForm = this.formBuilder.group({
    newCommand: ['', Validators.required],
    description: ['', Validators.required],
    example: '',
  });

  onNoClick(): void {
    this.dialogRef.close();
  }

  public async generateNewCommand() {
    try {
      const { newCommand, description, example } = this.createNewCommandForm.value
      if (newCommand && description && example ) {
        const data = {
          "groupId": this.dataGroup.idGroup,
          "command": newCommand,
          "description": description,
          "includeExample": example !== '',
          "example": example
        }
        console.log('data:', data);
        
        const resp = await firstValueFrom(this._RequestsService.post(`cli-documentation/v1/commands/create`, data).pipe(timeout(10000)));
        this._SweetAlert2Service.show_succesful_message('Nuevo comando creado con exito :)')
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

  ngOnInit(): void {
    console.log('dataGroup:', this.dataGroup);
  }
}
