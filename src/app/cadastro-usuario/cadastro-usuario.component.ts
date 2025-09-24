import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../seguranca/auth.service';

@Component({
  selector: 'app-cadastro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cadastro-usuario.component.html',
  styleUrl: './cadastro-usuario.component.css'
})
export class CadastroUsuarioComponent {
  usuario = {
    nome: '',
    email: '',
    senha: ''
  };

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  cadastrar() {
    // Lógica para chamar a API de cadastro
    console.log('Dados do usuário para cadastro:', this.usuario);
    // Aqui você chamaria o serviço de cadastro no backend
    // this.authService.cadastrarUsuario(this.usuario).subscribe(...)
  }
}
