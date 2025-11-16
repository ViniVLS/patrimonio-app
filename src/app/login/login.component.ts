import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../seguranca/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email = 'user-a@teste.com';
  senha = '123456';

  constructor(
    private authService: AuthService, private router: Router
  ) { }

  async fazerLogin() {
    try {
      await this.authService.login(this.email, this.senha);
      console.log('Login bem-sucedido');
      this.router.navigate(['/bens']);// Redireciona para a página de bens após o login
      alert('Login Efetuado.');
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      alert('Falha no login. Verifique suas credenciais.');
    }
  }
}
