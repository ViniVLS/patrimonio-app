// src/app/bens/bens.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BensService } from './bens.service';
import { AuthService } from '../seguranca/auth.service';

@Component({
  selector: 'app-bens',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bens.component.html',
  styleUrl: './bens.component.css'
})
export class BensComponent implements OnInit {

  bens: any[] = [];

  constructor(
    private bensService: BensService,
    public authService: AuthService
  ) {}

  ngOnInit() {
    // Carrega os bens apenas quando o componente estiver inicializado
    this.carregarBens();
  }

  carregarBens() {
    this.bensService.listarBens().subscribe({
      next: (dados) => {
        this.bens = dados;
        console.log('Dados do Supabase:', this.bens);
      },
      error: (error) => {
        console.error('Falha ao carregar bens:', error);
      }
    });
  }
}
