import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { SupabaseService } from '../supabase/supabase.service';
import { AuthSession } from '@supabase/supabase-js';

// Importe as interfaces Model
import { UsuarioPF } from './models/usuario-pf.model';
import { UsuarioPJ } from './models/usuario-pj.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _session: AuthSession | null = null;
  private readonly SESSION_KEY = 'supabase_session';
  private _initialized = false;
  private readonly IS_BROWSER: boolean;

  constructor(
    private supabaseService: SupabaseService,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.IS_BROWSER = isPlatformBrowser(this.platformId);
  }

  // Método privado para inicialização interna
  public async initializeSession(): Promise<void> {
    if (this._initialized || !this.IS_BROWSER) return;

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

  //
  // ▼▼▼▼▼ MÉTODO CORRIGIDO (Onde estava o erro) ▼▼▼▼▼
  //
  /**
   * Cadastra um novo usuário (PF ou PJ) em duas etapas:
   * 1. Cria a autenticação (auth.users)
   * 2. Salva o perfil (pessoa_fisica ou pessoa_juridica)
   */
  async cadastrarUsuario(dados: UsuarioPF | UsuarioPJ, tipo: 'pf' | 'pj'): Promise<void> {

    // 1. TENTATIVA DE AUTENTICAÇÃO (Cria registro em auth.users)
    const { data: authData, error: authError } = await this.supabaseService.client.auth.signUp({
      email: dados.email,
      password: dados.senha,
      options: {
        // Salva o nome (PF) ou Razão Social (PJ) nos metadados do usuário
        data: {
          full_name: (tipo === 'pf' ? (dados as UsuarioPF).nomeCompleto : (dados as UsuarioPJ).razaoSocial)
        }
      }
    });

    if (authError) {
      throw new Error(`Erro de autenticação: ${authError.message}`);
    }

    const userId = authData.user?.id;
    if (!userId) {
        throw new Error('Usuário autenticado, mas ID não encontrado.');
    }

    // 2. INSERÇÃO DOS DADOS DO PERFIL (Pessoa Física ou Jurídica)
    let profileData: any = {};
    let tableName: string;

    if (tipo === 'pf') {
      const pf = dados as UsuarioPF;
      tableName = 'pessoa_fisica';
      profileData = {
        user_id: userId,
        nome_completo: pf.nomeCompleto,
        cpf: pf.cpf,
        data_nascimento: pf.dataNascimento,
        telefone_celular: pf.telefoneCelular,
        sexo: pf.sexo,
        cep: pf.endereco.cep,
        logradouro: pf.endereco.logradouro,
        numero: pf.endereco.numero,
        bairro: pf.endereco.bairro,
        cidade: pf.endereco.cidade,
        uf: pf.endereco.uf,
      };
    } else { // tipo === 'pj'
      const pj = dados as UsuarioPJ;
      tableName = 'pessoa_juridica';
      profileData = {
        user_id: userId,
        razao_social: pj.razaoSocial,
        cnpj: pj.cnpj,
        nome_fantasia: pj.nomeFantasia,
        telefone_comercial: pj.telefoneComercial,
        responsavel_legal: pj.responsavelLegal,
        inscricao_estadual: pj.inscricaoEstadual,
        inscricao_municipal: pj.inscricaoMunicipal,
        cep: pj.endereco.cep,
        logradouro: pj.endereco.logradouro,
        numero: pj.endereco.numero,
        bairro: pj.endereco.bairro,
        cidade: pj.endereco.cidade,
        uf: pj.endereco.uf,
      };
    }

    // 3. Salvar o perfil no banco de dados
    const { error: profileError } = await this.supabaseService.client
      .from(tableName)
      .insert(profileData);

    if (profileError) {
      // Se a inserção do perfil falhar, o ideal é deletar o usuário recém-criado em auth.users
      // (Isso é um "rollback" manual, mas complexo)
      console.error(`Falha ao salvar perfil (${tableName}):`, profileError.message);
      throw new Error(`Falha ao salvar dados do perfil: ${profileError.message}`);
    }
  }
  // ▲▲▲▲▲ FIM DO MÉTODO CORRIGIDO ▲▲▲▲▲
  //

  get session(): AuthSession | null {
    return this._session;
  }

  // Retorna o UID (User ID) do usuário logado
  get userId(): string | undefined {
    return this._session?.user.id;
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
    if (this.IS_BROWSER) {
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
    }
  }

  private removeSession() {
    if (this.IS_BROWSER) {
      localStorage.removeItem(this.SESSION_KEY);
    }
  }
}
