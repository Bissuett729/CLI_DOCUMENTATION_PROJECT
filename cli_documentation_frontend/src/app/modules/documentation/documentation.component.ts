import { Component, effect, inject, OnDestroy } from '@angular/core';
import { SignalsService } from '../../shared/services/signals.service';
import { MatDialog } from '@angular/material/dialog';
import { NewCommandComponent } from './modals/new-command/new-command.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { firstValueFrom, Subscription, timeout } from 'rxjs';
import { WebsocketService } from '../../shared/services/gateway.service';
import { RequestsService } from '../../shared/services/requests.service';
import { SweetAlert2Service } from '../../shared/services/sweetAlert2.service';
import { HttpErrorResponse } from '@angular/common/http';

export interface commandsData {_id: string, type: string, command: string, description: string, includeExample: boolean, example: string}
export interface navMenus {_id: string, label: string, icon: string, url: string, value: string, link: string, colorLabel: string, commands: commandsData[]}

@Component({
  selector: 'app-documentation',
  imports: [
    MatTooltipModule
  ],
  templateUrl: './documentation.component.html',
  styleUrl: './documentation.component.scss'
})
export class DocumentationComponent implements OnDestroy {
  public _signals = inject(SignalsService)
  private readonly dialog = inject(MatDialog)
  private readonly _RequestsService = inject(RequestsService)
  private readonly _WebsocketService = inject(WebsocketService)
  private readonly _SweetAlert2Service = inject(SweetAlert2Service)

  private $SocketCreateCommand: Subscription | null = null;
  private $SocketDeleteOneCommand: Subscription | null = null;

  public navMenu: navMenus | null = {_id: '0', label: 'Home', icon: 'home-3-line', url: 'home', value: 'home', link: '', colorLabel: '#FF6B4A', commands: []}

  public commandsData: commandsData[] = []

  constructor() {
    this.socketCreateCommand()
    this.socketDeleteOneCommand()
    effect(() => {
      this.navMenu = this._signals.groupData$()
      console.log('navMenu:', this.navMenu);
      if (this.navMenu) {
        this.getCommandsByIdGroup(this.navMenu?._id)
      }
    });
  }

  private async getCommandsByIdGroup(groupId: string) {
    try {
      this.commandsData = [];
      const resp = await firstValueFrom(this._RequestsService.get(`cli-documentation/v1/commands/getByGroupId/${groupId}`).pipe(timeout(10000)));
      console.log('resp commands:', resp);
      this.commandsData = resp;
      console.log('commandsData:', this.commandsData);
    } catch (error) {
      // Verifica si el error tiene una propiedad 'error' y esta tiene una propiedad 'message'
      if (error instanceof HttpErrorResponse && error.error?.message) {
        this._SweetAlert2Service.show_error_message(error.error.message, 'Sin comandos');
      } else {
        this._SweetAlert2Service.show_error_message('Ha ocurrido un error desconocido', 'Error');
      }
      console.error(error);
    }
  }

  public getGradient(color: string): string {
    const colorWithOpacity = this.addOpacity(color, 0.87);
    return `linear-gradient(to right, ${color}, ${colorWithOpacity})`;
  }

  private addOpacity(color: string, opacity: number): string {
    const opacityHex = Math.floor(opacity * 255).toString(16).padStart(2, '0');
    return `${color}${opacityHex}`;
  }

  public openCreatenewCommandModal(): void {
    const dialogRef = this.dialog.open(NewCommandComponent, {
      data: {idGroup: this.navMenu?._id, type: this.navMenu?.value},
      minWidth: '40vw',
      maxHeight: '90vh',
      disableClose: true,
      closeOnNavigation: true
    });
    dialogRef.afterClosed().subscribe();
  }

  public copyCommandToClipboard(commandText: string): void {
    // Crear un elemento textarea temporal
    const textarea = document.createElement('textarea');
    // Asignar el valor del texto del comando al textarea
    textarea.value = commandText;
    // Añadir el textarea al body del documento
    document.body.appendChild(textarea);
    // Seleccionar el contenido del textarea
    textarea.select();
    // Ejecutar el comando para copiar al portapapeles
    const successful = document.execCommand('copy');
    // Eliminar el textarea temporal
    document.body.removeChild(textarea);
    
    // Mostrar mensaje dependiendo del resultado
    if (successful) {
      this._SweetAlert2Service.show_succesful_message('Comando copiado al portapapeles');
    } else {
      this._SweetAlert2Service.show_error_message('No se pudo copiar el comando', 'Error');
    }
  }

  public async deleteCommandById(_id: string): Promise<void> {
    try {
      // Solicitar confirmación con SweetAlert2
      const sweetAction = await this._SweetAlert2Service.confirm_action('Se eliminará el comando, ¿estás seguro?');
      
      // Si no se confirma la acción, salir de la función
      if (!sweetAction.isConfirmed) {
        return;
      }

      const data = {
        "commandIds": [
          _id
        ]
      }

      // Realizar la solicitud para eliminar el comando
      await firstValueFrom(
        this._RequestsService.delete(`cli-documentation/v1/commands/delete`, data).pipe(timeout(10000))
      );

      // Mostrar mensaje de éxito
      this._SweetAlert2Service.show_succesful_message('Comando eliminado exitosamente');
    } catch (error) {
      // Manejo de errores HTTP
      if (error instanceof HttpErrorResponse && error.error?.message) {
        this._SweetAlert2Service.show_error_message(error.error.message, 'No se encontró el comando');
      } else {
        // Manejo de errores genéricos
        this._SweetAlert2Service.show_error_message('Ha ocurrido un error desconocido', 'Error');
      }
      console.error(error);
    }
  }


  ngOnDestroy(): void {
    this.$SocketCreateCommand?.unsubscribe();
    this.$SocketDeleteOneCommand?.unsubscribe();
  }

  //  ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ SOCKETS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
   public socketCreateCommand() {
    this.$SocketCreateCommand = this._WebsocketService.listen('CLI_DOC_SOCKET_COMMAND_CREATE', this._WebsocketService.socketCliDocumentation).subscribe((socketResp: any) => {
      console.log('socketCreateCommand - socketResp', socketResp); 
      if (socketResp?.data?.command.groupId === this.navMenu?._id) {
        if(!this.commandsData?.find(command => command._id === socketResp?.data?.command._id)) {
          this.commandsData?.push(socketResp?.data?.command)
        }
      }
    });
  }

  public socketDeleteOneCommand(): void {
    this.$SocketDeleteOneCommand = this._WebsocketService.listen('CLI_DOC_SOCKET_COMMAND_DELETE', this._WebsocketService.socketCliDocumentation).subscribe((socketResp: any) => {
      console.log('socketDeleteOneCommand - socketResp', socketResp);
      // Buscar el índice del comando que coincide con el ID recibido por el socket
      const commandIndex = this.commandsData?.findIndex((command: commandsData) => command._id === socketResp._id);
      // Si se encuentra, eliminarlo del arreglo
      if (commandIndex !== undefined && commandIndex > -1) {
        this.commandsData?.splice(commandIndex, 1);
      }
    });
  }
  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑

}
