// src/app/app.routes.ts (JÁ ESTÁ CORRETO)
import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { BensComponent } from './bens/bens.component';

import { authGuard } from './seguranca/auth.guard';
import { BensCadastroComponent } from './bens/cadastro/bens-cadastro/bens-cadastro.component';
import { CadastroSelectorComponent } from './seguranca/cadastro/cadastro-selector/cadastro-selector.component';

export const routes: Routes = [
  // Rotas públicas
  { path : 'login', component: LoginComponent },
  { path: 'cadastro-usuario', component: CadastroSelectorComponent },


  // ROTA DE EDIÇÃO: Aceita um ID
  {
    path: 'bens/editar/:id', // << NOVO: Esta rota espera um ID
    component: BensCadastroComponent,
    canActivate: [authGuard]
  },

  // Rota de Cadastro de Bens
  {
    path: 'bens/cadastro',
    component: BensCadastroComponent,
    canActivate: [authGuard] // Apenas usuários logados podem cadastrar
  },

  // Rota principal protegida
  {
    path: 'bens',
    component: BensComponent,
    canActivate: [authGuard]
  },

  // Rota padrão: Tenta ir para 'bens', se falhar, o Guard manda para '/login'
  {
    path: '',
    redirectTo: '/bens',
    pathMatch: 'full'
  },



];
