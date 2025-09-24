import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { BensComponent } from './bens/bens.component';
import { CadastroUsuarioComponent } from './cadastro-usuario/cadastro-usuario.component';

export const routes: Routes = [
  { path : 'login', component: LoginComponent},
  { path: 'bens', component: BensComponent }, // Agora, a rota principal exibe o BensComponent
  { path: 'cadastro-usuario', component: CadastroUsuarioComponent },
  { path: '', component: LoginComponent } // Rota padrão redireciona para login,
];
