// src/app/app.component.ts

import { Component, AfterViewInit } from '@angular/core';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

// CORREÇÃO FINAL: O caminho deve ser para a subpasta 'bens'
import { BensService } from './bens/bens.service';
import { AuthService } from './seguranca/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {
  bens: any[] = [];

  constructor(
    private bensService: BensService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngAfterViewInit() {
    // Garante que o Angular terminou de montar a view antes de verificar a sessão
    if (!this.authService.isLoggedIn()) {
      // Se não estiver logado, redireciona imediatamente para a tela de login
      this.router.navigate(['/login']);
    } else {
      // Se estiver logado, carrega os bens
      this.carregarBens();
    }
  }

  // MÉTODO PARA CARREGAR OS BENS (para teste)
  carregarBens() {
    this.bensService.listarBens().subscribe({
      next: (dados) => {
        this.bens = dados;
        console.log('Bens carregados:', this.bens);
      },
      error: (error) => {
        console.error('Falha ao carregar bens:', error);
      }
    });
  }
}
