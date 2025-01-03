import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface commandsData {_id: string, type: string, command: string, description: string, includeExample: boolean, example: string}
export interface navMenus {_id: string, label: string, icon: string, url: string, value: string, link: string, colorLabel: string, commands: commandsData[]}

@Injectable({
  providedIn: 'root'
})
export class SignalsService {

  public themeDark$ = signal<boolean>(false)
  public openSidebarLeft$ = signal<boolean>(true)
  public loadingPage$ = signal<boolean>(true)
  public labelHeader$ = signal<string>('Bienvenido a la documentación CLI :)')

  // private groupDataSubject = new BehaviorSubject<navMenus | null>(null) 
  public groupData$ = signal<navMenus | null>(null)

  constructor() {
    this.checkMediaQuery();
    window.addEventListener('resize', this.checkMediaQuery.bind(this));
  }

  public setThemeDark(state: boolean) {
    this.themeDark$.set(state)
    localStorage.setItem('isThemeDark', state ? 'yes' : 'no')
    if(state) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      window.matchMedia('(prefers-color-scheme: dark)')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      window.matchMedia('(prefers-color-scheme: light)')
    }
  }

  private checkMediaQuery() {
    const mediaQuery = window.matchMedia('(min-width: 768px)');
    this.setSidebarLeft(mediaQuery.matches);
  }

  public setLoadingPage(state: boolean) {
    this.loadingPage$.set(state)
  }

  public setSidebarLeft(state: boolean) {
    this.openSidebarLeft$.set(state)
  }

  public setLabelHeader(label: string) {
    this.labelHeader$.set(label)
  }

  public setGroupData(data: navMenus) {
    this.groupData$.set(data)
  }
}
