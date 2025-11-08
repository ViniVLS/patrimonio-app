// src/app/seguranca/auth.service.ts
import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthSession } from '@supabase/supabase-js';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _session: AuthSession | null = null;
  private readonly SESSION_KEY = 'supabase_session';
  private _initialized = false;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {

  }

  // Método privado para inicialização interna
  public async initializeSession(): Promise<void> {
    if (this._initialized || !isPlatformBrowser(this.platformId)) return;

    try {
      const { data } = await this.supabaseService.client.auth.getSession();
      if (data.session) {
        this._session = data.session;
        this.saveSession(data.session);
      }
      this._initialized = true;
    } catch (error) {
      console.error('Erro ao inicializar sessão:', error);
      this._initialized = true; // Marca como inicializado mesmo com erro
    }
  }

  async login(email: string, senha: string): Promise<void> {
    const { data, error } = await this.supabaseService.client.auth.signInWithPassword({
      email: email,
      password: senha,
    });

    if (error) {
      console.error('Falha no login Supabase:', error.message);
      throw new Error('Falha no login. Verifique suas credenciais.');
    }

    if (data.session) {
      this._session = data.session;
      this.saveSession(data.session);
    }
  }

  get session(): AuthSession | null {
    return this._session;
  }

  isLoggedIn(): boolean {
    return !!this._session;
  }

  async logout(): Promise<void> {
    await this.supabaseService.client.auth.signOut();
    this._session = null;
    this.removeSession();
    this.router.navigate(['/login']);
  }

  private saveSession(session: AuthSession) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  private removeSession() {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }
}
