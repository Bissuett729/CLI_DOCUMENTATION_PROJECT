import { Component, inject, OnDestroy } from '@angular/core';
import { SignalsService } from '../../../shared/services/signals.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NewDocumentationComponent } from '../header/modals/new-documentation/new-documentation.component';
import { MatDialog } from '@angular/material/dialog';
import { RequestsService } from '../../../shared/services/requests.service';
import { firstValueFrom, Subscription, timeout } from 'rxjs';
import { WebsocketService } from '../../../shared/services/gateway.service';

export interface commandsData {_id: string, type: string, command: string, description: string, includeExample: boolean, example: string}
export interface navMenus {_id: string, label: string, icon: string, url: string, value: string, link: string, colorLabel: string, commands: commandsData[]}

@Component({
  selector: 'app-sidebar',
  imports: [
    CommonModule,
    RouterModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent implements OnDestroy {
  public _signals = inject(SignalsService)
  private readonly dialog = inject(MatDialog)
  private readonly _RequestsService = inject(RequestsService)
  private readonly _WebsocketService = inject(WebsocketService)

  private $SocketCreateGroup: Subscription | null = null;

  public navMenus: navMenus[] = []

  constructor() {
    this.socketCreateGroup();
    this.getAllGroups()
  }

  private async getAllGroups() {
    try {
      const resp = await firstValueFrom(this._RequestsService.get('cli-documentation/v1/groups/getAll').pipe(timeout(10000)))
      this.navMenus = resp.data

      if(localStorage.getItem('selectedGroup') !== null || localStorage.getItem('selectedGroup') !== '') {
        const selectedGroup = this.navMenus.find(group => group._id === localStorage.getItem('selectedGroup'));
        if (selectedGroup) {
          localStorage.setItem('selectedGroup', selectedGroup._id)
          this._signals.setGroupData(selectedGroup);
          this._signals.setLabelHeader(`Comandos de ${selectedGroup.label}`)
        }
      }
      setTimeout(() => this._signals.setLoadingPage(false), 600);
    } catch (error) {
      console.error(error)
    }
  }

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

  public getCommandsOfGroupSelected(_id: string) {
    // Buscar dentro del arreglo navMenus el objeto que tenga un _id igual al proporcionado
    const selectedGroup = this.navMenus.find(group => group._id === _id);
    // Si encontramos el grupo con ese _id
    console.log('selectedGroup:', selectedGroup);

    if (selectedGroup) {
      localStorage.setItem('selectedGroup', selectedGroup._id)
      this._signals.setGroupData(selectedGroup);
      this._signals.setLabelHeader(`Comandos de ${selectedGroup.label}`)
    }
  }

  ngOnDestroy(): void {
    this.$SocketCreateGroup?.unsubscribe();
  }

  // ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓ SOCKETS ↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓↓
  public socketCreateGroup() {
    this.$SocketCreateGroup = this._WebsocketService.listen('CLI_DOC_SOCKET_GROUP_CREATE', this._WebsocketService.socketCliDocumentation).subscribe((socketResp: any) => {
      // console.log('socketCreateGroup - socketResp', socketResp); 
      if (socketResp?.data?._id) {
        const existsInNavMenus = this.navMenus.some(menu => menu._id === socketResp?.data?._id);
        if (!existsInNavMenus) {
          this.navMenus.push(socketResp?.data)
        }
      }
    });
  }
  // ↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑↑
}
