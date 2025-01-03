import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

import { environment } from '../../../environments/environment';
@Injectable()
export class SocketCliDocumentation extends Socket {
  constructor( ) { super( { url: environment.cliDocumentation } ) }
};

@Injectable( { providedIn: 'root' } )
export class WebsocketService {
  constructor(public readonly socketCliDocumentation:  SocketCliDocumentation) {
    this.handleSocketConn( socketCliDocumentation,  'CLI Documentation' );
  };

  public handleSocketConn( socket: Socket, where: string ): void {
    socket.on( 'connect', (  ) =>   console.log( 'Connected to ' + where ) );
    socket.on( 'disconnect', ( ) => console.log( 'Disconnected from ' + where ) );
  };

  public emit( event: string, socket: Socket, payload?: any, callback?: Function ): void {
    socket.emit(event, payload, callback);
  };

  public listen( event: string, socket: Socket ): any {
    return socket.fromEvent( event );
  };

}
