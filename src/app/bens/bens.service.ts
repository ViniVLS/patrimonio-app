import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { PostgrestSingleResponse } from '@supabase/supabase-js';
import { AuthService } from '../seguranca/auth.service';

// Interface para definir a estrutura do seu objeto 'Bem' (COMPLETA)
export interface Bem {
  id: number;
  codigo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  situacao: string;

  // NOVOS CAMPOS ADICIONADOS DA PLANILHA:
  responsavel: string;
  numero_patrimonio: string;
  data_aquisicao: string;
  valor: number;
  foto_url?: string;

  numero_serie?: string;
  fabricante?: string;
  modelo?: string;
  observacoes?: string;

  // Campos do banco de dados (que o RLS preenche)
  usuario_id?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BensService {

  constructor(private supabaseService: SupabaseService, private authService: AuthService) { }

  /**
   * Lista todos os bens da tabela 'bem', filtrando apenas pelos bens
   * que pertencem ao usuário logado (usando o RLS do Supabase).
   */
  listarBens(): Observable<Bem[]> {

    const userId = this.authService.userId;

    if (!userId) {
      return new Observable<Bem[]>(observer => {
        observer.next([]);
        observer.complete();
      });
    }

    const consulta = this.supabaseService.client
      .from('bem')
      .select('*')
      .eq('usuario_id', userId);

    return from(consulta).pipe(
      map((response: PostgrestSingleResponse<Bem[]>) => {
        if (response.error) {
          console.error('Erro ao buscar bens:', response.error.message);
          throw new Error(response.error.message);
        }
        return response.data || [];
      })
    );
  }

  /**
   * Cadastra um novo bem no Supabase.
   * O Supabase preenche o 'usuario_id' automaticamente (se RLS permitir).
   * @param bem O objeto Bem a ser cadastrado (sem o ID).
   */
  cadastrarBem(bem: Omit<Bem, 'id'>): Observable<Bem> {

    const userId = this.authService.userId; // Obtém o ID do usuário logado

    if (!userId) {
        // O Guard deveria impedir isso, mas é uma segurança adicional
        throw new Error('Usuário não autenticado. Faça login novamente.');
    }

    // 1. Cria um novo objeto com os dados do bem E injeta o usuario_id
    const bemComDono = {
        ...bem,
        usuario_id: userId
    };

    const consulta = this.supabaseService.client
      .from('bem')
      .insert([bemComDono]) // Usa o objeto com o ID injetado
      .select()
      .single();

    return from(consulta).pipe(
      map((response: PostgrestSingleResponse<Bem>) => {
        if (response.error) {
          console.error('Erro ao cadastrar bem:', response.error.message);
          throw new Error(response.error.message);
        }
        return response.data!;
      })
    );
  }

  /**
   * Atualiza um bem existente no Supabase.
   * O RLS do Supabase garante que o usuário só possa atualizar seus próprios bens.
   * @param id O ID do bem a ser atualizado.
   * @param bem Os dados atualizados do bem (exceto o ID).
   */
  atualizarBem(id: number, bem: Omit<Bem, 'id' | 'usuario_id'>): Observable<Bem> {

    // NOTA: É importante remover o 'usuario_id' e o 'id' dos dados de payload
    // para evitar que o usuário tente atualizar campos sensíveis ou o próprio ID.
    const dadosParaUpdate = bem;

    const consulta = this.supabaseService.client
      .from('bem')
      .update(dadosParaUpdate) // Dados a serem atualizados
      .eq('id', id) // Filtra pelo ID do bem
      .select()
      .single();

    return from(consulta).pipe(
      map((response: PostgrestSingleResponse<Bem>) => {
        if (response.error) {
          console.error('Erro ao atualizar bem:', response.error.message);
          throw new Error(response.error.message);
        }
        if (!response.data) {
          throw new Error('Falha ao obter os dados atualizados.');
        }
        return response.data;
      })
    );
  }


  /**
   * Busca um bem específico pelo ID.
   */
  buscarBemPorId(id: number): Observable<Bem> {
    const userId = this.authService.userId;

    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    // Filtra pelo ID do bem E pelo ID do usuário (para segurança adicional)
    const consulta = this.supabaseService.client
      .from('bem')
      .select('*')
      .eq('id', id)
      .eq('usuario_id', userId)
      .single();

    return from(consulta).pipe(
      map((response: PostgrestSingleResponse<Bem>) => {
        if (response.error) {
          console.error('Erro ao buscar bem:', response.error.message);
          throw new Error(response.error.message);
        }
        if (!response.data) {
          throw new Error('Bem não encontrado.');
        }
        return response.data;
      })
    );
  }


  removerBem(id: number): Observable<void> {

    // NOTA: Não precisamos do userId aqui, pois o Supabase RLS já verifica o dono
    const consulta = this.supabaseService.client
      .from('bem')
      .delete() // Chamada DELETE
      .eq('id', id); // Filtra o item a ser excluído

    // O retorno é um Observable<void> já que a operação é de exclusão.
    return from(consulta).pipe(
      map((response: any) => {
        if (response.error) {
          console.error('Erro ao excluir bem:', response.error.message);
          throw new Error(response.error.message);
        }
        // Retorna void (sucesso)
        return;
      })
    );
  }


}
