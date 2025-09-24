import { Component } from '@angular/core';
import { BensService } from './bens.service';
import { AuthService } from '../seguranca/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bens',
   standalone: true,
  imports: [CommonModule],
  templateUrl: './bens.component.html',
  styleUrl: './bens.component.css'
})
export class BensComponent {

   bens: any[] = [];
   title = 'patrimonio-app';

  constructor(
    private bensService: BensService,
    public authService: AuthService
  ) {
    if (this.authService.isLoggedIn()) {
      this.carregarBens();

    }}

    carregarBens() {
    this.bensService.listarBens().subscribe({
      next: (dados) => {
        this.bens = dados;
        console.log('Dados do backend:', this.bens);
      },
      error: (error) => {
        console.error('Falha ao carregar bens:', error);
      }
    });
  }
}

