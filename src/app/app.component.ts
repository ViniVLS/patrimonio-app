// src/app/app.component.ts

import { Component, OnInit } from '@angular/core'; // Usar OnInit é melhor
import { RouterOutlet, Router } from '@angular/router'; // Não precisa mais de RouterLink aqui
import { CommonModule } from '@angular/common';

import { BensService } from './bens/bens.service';
import { AuthService } from './seguranca/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  // CORREÇÃO: Removendo RouterLink daqui, pois ele não é usado no JS
  imports: [RouterOutlet, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit { // Implementar OnInit
  bens: any[] = [];

  constructor(
    private bensService: BensService,
    public authService: AuthService,
    private router: Router
  ) {
    // CORREÇÃO: O construtor deve estar vazio
  }

  ngOnInit() {
    // CORREÇÃO: A lógica de redirecionamento fica no AuthGuard.
    // O AppComponent só carrega os bens SE o Guard permitir e o usuário estiver logado.
    if (this.authService.isLoggedIn()) {
      this.carregarBens();
    }
  }

  carregarBens() {
    this.bensService.listarBens().subscribe({
      next: (dados: any[]) => {
        this.bens = dados;
      },
      error: (error) => {
        console.error('Falha ao carregar bens:', error);
      }
    });
  }
}
