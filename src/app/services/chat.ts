import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private http: HttpClient) {}

  obtenerPreguntas() {
    return this.http.get<any[]>('https://chatbot-upiiz-backend.onrender.com/api/preguntas');
  }

  enviarMensaje(mensaje: string): Observable<any> {
    return this.http.post<any>('https://chatbot-upiiz-backend.onrender.com/api/chat', {
      texto: mensaje,
    });
  }

  evaluarPerfil(paquete: any) {
    return this.http.post<any>('https://chatbot-upiiz-backend.onrender.com/api/evaluar', paquete);
  }
}
