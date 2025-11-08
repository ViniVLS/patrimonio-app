import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { from, Observable, of } from 'rxjs'; // Adicione 'from', 'of'
import { switchMap, tap } from 'rxjs/operators'; // Adicione 'switchMap'

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Se a sessão já estiver carregada (carregamento rápido), prossiga
  if (authService.isLoggedIn()) {
    return true;
  }

  // Senão, inicializa a sessão (chamada assíncrona) e espera o resultado
  return from(authService.initializeSession()).pipe(
    switchMap(() => {
      if (authService.isLoggedIn()) {
        return of(true);
      } else {
        return of(router.parseUrl('/login'));
      }
    })
  );
};
