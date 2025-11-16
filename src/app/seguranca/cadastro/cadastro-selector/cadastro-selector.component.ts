import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../auth.service';

// Importa os novos formulários
import { PessoaFisicaFormComponent } from '../pessoa-fisica-form/pessoa-fisica-form.component';
import { PessoaJuridicaFormComponent } from '../pessoa-juridica-form/pessoa-juridica-form.component';

// Importa as interfaces Model
import { UsuarioPF } from '../../models/usuario-pf.model';
import { UsuarioPJ } from '../../models/usuario-pj.model';

@Component({
  selector: 'app-cadastro-selector',
  standalone: true,
  // Importa os componentes de formulário PF e PJ
  imports: [CommonModule, RouterLink, PessoaFisicaFormComponent, PessoaJuridicaFormComponent],
  templateUrl: './cadastro-selector.component.html',
  styleUrls: ['./cadastro-selector.component.css']
})
export class CadastroSelectorComponent implements OnInit {

  tipoUsuario: 'pf' | 'pj' = 'pf'; // Começa com Pessoa Física por padrão
  isLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  }

  // Alterna entre os formulários
  alternarTipo(tipo: 'pf' | 'pj') {
    this.tipoUsuario = tipo;
  }

  // Método que recebe os dados (PF ou PJ) dos componentes filhos
  async receberDados(dados: UsuarioPF | UsuarioPJ) {
    if (this.isLoading) return;

    this.isLoading = true;

    try {
      // O método cadastrarUsuario precisa ser criado no AuthService
      await this.authService.cadastrarUsuario(dados, this.tipoUsuario);

      alert('Cadastro realizado com sucesso! Verifique seu e-mail para confirmação.');
      this.router.navigate(['/login']);

    } catch (err: any) {
      console.error('Erro no cadastro (Seletor):', err);
      alert(`Erro ao cadastrar: ${err.message || 'Verifique os dados e tente novamente.'}`);
    } finally {
      this.isLoading = false;
    }
  }
}
