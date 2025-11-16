import { Endereco } from './endereco.model';

export interface UsuarioPF {
  // Campos de Autenticação (para Supabase auth.users)
  email: string;
  senha: string;

  // Campos de Perfil (para a sua tabela pessoa_fisica)
  nomeCompleto: string;
  cpf: string;
  dataNascimento: string; // Formato esperado: YYYY-MM-DD
  telefoneCelular: string;
  sexo: string; // Ex: 'M', 'F', 'O'

  // Endereço (Objeto aninhado)
  endereco: Endereco;

  // Campo de controle
  aceiteTermos: boolean;
}
