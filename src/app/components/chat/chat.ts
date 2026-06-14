import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.html',
  styleUrl: './chat.css',
})
export class Chat implements OnInit {

  testCompletado: boolean = false;
  mostrarResultados: boolean = false;
  carrerasOrdenadas: any[] = [];
  mensajes: { remitente: string; texto: string }[] = [
    {
      remitente: 'bot',
      texto:
        '¡Hola! Soy el orientador virtual de la UPIIZ. Puedes preguntarme sobre inscripciones, o dime si quieres iniciar tu test vocacional.',
    },
  ];
  mensajeUsuario: string = '';


  enModoTest: boolean = false;
  preguntaActual: number = 0;
  respuestasUsuario: any[] = [];
  preguntasTest: any[] = [];

  constructor(private chatService: ChatService) {}


  ngOnInit() {
    this.chatService.obtenerPreguntas().subscribe({
      next: (preguntas) => {
        this.preguntasTest = preguntas;
        console.log('¡Se cargaron ' + this.preguntasTest.length + ' preguntas desde Python!');
      },
      error: (err) => console.error('Error al traer preguntas:', err),
    });
  }


  enviarMensaje() {
    if (!this.mensajeUsuario.trim()) return;
    const texto = this.mensajeUsuario;


    if (texto.toLowerCase().includes('test')) {
      this.enModoTest = true;
      this.mensajeUsuario = '';
      return;
    }


    this.mensajes.push({ remitente: 'usuario', texto: texto });
    this.mensajeUsuario = '';

    this.chatService.enviarMensaje(texto).subscribe({
      next: (res) => {
        this.mensajes.push({ remitente: 'bot', texto: res.respuesta });


        if (res.respuesta.includes('¡Perfecto! Vamos a descubrir')) {
          setTimeout(() => (this.enModoTest = true), 1500);
        }
      },
      error: (err) => console.error('Error en el chat:', err),
    });
  }

  responderTest(opcion: any) {
    this.respuestasUsuario.push({
      idPregunta: this.preguntasTest[this.preguntaActual].id,
      inciso: opcion.inciso,
    });

    this.preguntaActual++;

    if (this.preguntaActual >= this.preguntasTest.length) {
      const paqueteTest = { respuestas: this.respuestasUsuario };

      this.chatService.evaluarPerfil(paqueteTest).subscribe({
        next: (resultado) => {
          const puntajes = resultado.puntajesFinales;


          this.carrerasOrdenadas = Object.keys(puntajes)
            .map((clave) => ({ carrera: clave, puntaje: puntajes[clave] }))
            .sort((a, b) => b.puntaje - a.puntaje);


          this.testCompletado = true;
          this.enModoTest = false;
          this.mostrarResultados = true;
        },
        error: (err) => console.error('Error al evaluar el test:', err),
      });
    }
  }
}
