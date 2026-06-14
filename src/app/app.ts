import { Component } from '@angular/core';

import { Chat } from './components/chat/chat';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Chat], 
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class AppComponent {
  title = 'chatbot-frontend';
}
