import { Injectable } from '@angular/core';
import { SupabaseService } from '../supabase/supabase.service'; // 1. Importe o SupabaseService
import { from, Observable } from 'rxjs'; // 2. Importe 'from' do rxjs
import { map } from 'rxjs/operators';
import { PostgrestSingleResponse } from '@supabase/supabase-js';

// Interface para definir a estrutura do seu objeto 'Bem' (Opcional, mas boa prática)
export interface Bem {
  id: number;
  codigo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  situacao: string;
  // Adicione os outros campos conforme necessário
}

@Injectable({
  providedIn: 'root'
})
export class BensService {
  // 3. Remova a apiUrl antiga

  // 4. Injete o SupabaseService no construtor
  constructor(private supabaseService: SupabaseService) { }

  /**
   * Lista todos os bens da tabela 'bem'.
   * No futuro, iremos adicionar o filtro por usuário aqui.
   */
  listarBens(): Observable<Bem[]> {

    // 5. Substitua a lógica do HttpClient pela consulta do Supabase
    const consulta = this.supabaseService.client
      .from('bem') // O nome da sua tabela no Supabase
      .select('*'); // Seleciona todas as colunas

    // 6. Converte a Promise do Supabase em um Observable (padrão do Angular)
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
}
