// src/app/bens/bens.component.ts (Completo e Corrigido)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BensService } from './bens.service';
import { AuthService } from '../seguranca/auth.service';
import { Router, RouterLink} from '@angular/router'; // Importe o Router aqui

@Component({
  selector: 'app-bens',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './bens.component.html',
  styleUrl: './bens.component.css'
})
export class BensComponent implements OnInit {

  bens: any[] = [];
  nomeUsuario: string = 'Usuário'; // Novo atributo para o nome
  dashboard: { total: number, emUso: number, ocioso: number } = { total: 0, emUso: 0, ocioso: 0 };

  // Use um índice para numerar os bens
  indiceBens: number = 0;

  constructor(
    private bensService: BensService,
    public authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.carregarNomeUsuario();
    this.carregarBens();
  }

  carregarNomeUsuario() {
    // Obtém o nome do usuário (assumindo que o nome está no email antes do @ para simplicidade)
    const email = this.authService.session?.user.email;
    if (email) {
      this.nomeUsuario = email.split('@')[0];
    }
  }

  carregarBens() {
    this.bensService.listarBens().subscribe({
      next: (dados) => {
        this.bens = dados;
        this.calcularDashboard(); // Chama o cálculo após carregar os dados
      },
      error: (error) => {
        console.error('Falha ao carregar bens:', error);
      }
    });
  }

  // Implementa a lógica do dashboard no front-end
  calcularDashboard() {
    this.dashboard.total = this.bens.length;
    this.dashboard.emUso = this.bens.filter(b => b.situacao === 'Em uso').length;
    this.dashboard.ocioso = this.bens.filter(b => b.situacao === 'Ocioso').length;
    // Adicione a contagem de inventariados/não inventariados se necessário
  }

  // Métodos de ação (para futuras implementações de edição/exclusão)
 editarBem(id: number) {
    // Redireciona para a rota de edição com o ID do bem
    this.router.navigate(['/bens/editar', id]);
  }

 //Metodo de excluir bem
 excluirBem(id: number) {
    if (confirm(`Tem certeza que deseja excluir o bem ID ${id}?`)) {

        // 1. Chama o serviço de exclusão
        this.bensService.removerBem(id).subscribe({
            next: () => {
                alert(`Bem ID ${id} excluído com sucesso!`);

                // 2. Recarrega a lista para remover o item da tela
                this.carregarBens();
            },
            error: (error) => {
                // 3. Lida com o erro (pode ser erro de RLS - tentando deletar bem que não é dele)
                console.error('Falha ao excluir bem:', error);
                alert(`Erro ao excluir bem. Verifique se você tem permissão.`);
            }
        });
    }
}
}
