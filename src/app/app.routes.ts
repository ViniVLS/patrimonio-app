// src/app/app.routes.ts (JÁ ESTÁ CORRETO)
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BensComponent } from './bens/bens.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';
import { authGuard } from './seguranca/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  {
    path: 'bens',
    component: BensComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
