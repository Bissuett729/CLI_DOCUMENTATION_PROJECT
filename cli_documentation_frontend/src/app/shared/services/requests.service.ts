import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestsService {

  constructor(private http: HttpClient) {}

  /**
   * Realiza una petición GET para obtener datos de la API.
   * @param {string} endpoint - El endpoint de la API.
   * @returns {Observable<any>} Observable con los datos obtenidos.
  */
  get(endpoint: string): Observable<any> {
    return this.http.get<any>(`${environment.cliDocumentation}/${endpoint}`);
  }

  /**
   * Realiza una petición POST para enviar datos a la API.
   * @param {string} endpoint - El endpoint de la API.
   * @param {any} data - Los datos a enviar.
   * @returns {Observable<any>} Observable con la respuesta de la API.
  */
  post(endpoint: string, data: any): Observable<any> {
    return this.http.post<any>(`${environment.cliDocumentation}/${endpoint}`, data);
  }

  /**
   * Realiza una petición PUT para actualizar datos en la API.
   * @param {string} endpoint - El endpoint de la API.
   * @param {any} data - Los datos a actualizar.
   * @returns {Observable<any>} Observable con la respuesta de la API.
  */
  put(endpoint: string, data: any): Observable<any> {
    return this.http.put<any>(`${environment.cliDocumentation}/${endpoint}`, data);
  }

  /**
   * Realiza una petición DELETE para eliminar un recurso en la API.
   * @param {string} endpoint - El endpoint de la API.
   * @returns {Observable<any>} Observable con la respuesta de la API.
  */
  delete(endpoint: string, data?: any): Observable<any> {
    return this.http.delete<any>(`${environment.cliDocumentation}/${endpoint}`, data);
  }
}