import { Endereco } from './endereco.model';

export interface UsuarioPJ {
  // Campos de Autenticação (para Supabase auth.users)
  email: string;
  senha: string;

  // Campos de Perfil (para a sua tabela pessoa_juridica)
  razaoSocial: string;
  cnpj: string;
  nomeFantasia: string;
  telefoneComercial: string;
  responsavelLegal: string;
  inscricaoEstadual?: string;
  inscricaoMunicipal?: string;

  // Endereço
  endereco: Endereco;

  // Campo de controle
  aceiteTermos: boolean;
}
