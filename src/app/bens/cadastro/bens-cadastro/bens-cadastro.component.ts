// src/app/bens/cadastro/bens-cadastro.component.ts (Completo e Corrigido)

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router'; // Importe ActivatedRoute
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { BensService, Bem } from '../../bens.service';
import { switchMap } from 'rxjs/operators'; // Para lidar com Observables
import { Observable } from 'rxjs';

@Component({
  selector: 'app-bens-cadastro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './bens-cadastro.component.html',
  styleUrls: ['./bens-cadastro.component.css']
})
export class BensCadastroComponent implements OnInit {

  formCadastro!: FormGroup;
  categorias: string[] = ['Informática', 'Móveis', 'Equipamentos', 'Veículos', 'Outros'];
  situacoes: string[] = ['Em uso', 'Ocioso', 'Manutenção', 'Descarte Pendente'];
  isEdicao: boolean = false; // Flag para saber se estamos em modo edição

  constructor(
    private bensService: BensService,
    private router: Router,
    private fb: FormBuilder,
    private route: ActivatedRoute // << Injete o ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.iniciarFormulario();
    this.carregarBemParaEdicao(); // << Nova lógica de carregamento
  }

  iniciarFormulario(): void {
    this.formCadastro = this.fb.group({
      // Campos principais e obrigatórios
      codigo: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]],
      descricao: ['', [Validators.required, Validators.maxLength(255)]],
      categoria: ['', Validators.required],
      situacao: ['Em uso', Validators.required],
      localizacao: [''],
      // Campos Adicionais (da planilha)
      responsavel: ['', [Validators.required, Validators.maxLength(100)]],
      numero_patrimonio: ['', [Validators.maxLength(100)]],
      data_aquisicao: [this.getCurrentDateString(), Validators.required],
      valor: [0, [Validators.required, Validators.min(0.01)]],
      // 4 NOVOS CAMPOS
      numero_serie: [''],
      fabricante: [''],
      modelo: [''],
      observacoes: [''],
      foto_url: ['']// Campo opcional para a URL da foto
    });
  }

  carregarBemParaEdicao(): void {
    // Usa switchMap para se inscrever nas mudanças de parâmetro da rota
    this.route.paramMap.pipe(
      switchMap(params => {
        const id = params.get('id');
        if (id) {
          this.isEdicao = true;
          // Chama a função de busca e espera o Observable
          return this.bensService.buscarBemPorId(+id);
        }
        return new Observable<Bem>(); // Retorna um Observable vazio se não houver ID
      })
    ).subscribe({
      next: (bem: Bem) => {
        // Preenche o formulário com os dados do bem
        this.formCadastro.patchValue(bem);
      },
      error: (err) => {
        console.error('Erro ao carregar bem para edição:', err);
        alert('Erro ao carregar os dados. Redirecionando para o cadastro.');
        this.router.navigate(['/bens/cadastro']);
      }
    });
  }

  // Novo método para lidar com o envio (criação ou atualização)
  cadastrarOuAtualizar() {
    if (this.formCadastro.invalid) {
      alert('Preencha os campos obrigatórios.');
      this.formCadastro.markAllAsTouched();
      return;
    }

    // Pega os dados do formulário
    const dados: Omit<Bem, 'id'> = this.formCadastro.value;

    if (this.isEdicao) {
      // Lógica de Atualização (PUT)
      const id = +this.route.snapshot.paramMap.get('id')!;
      this.bensService.atualizarBem(id, dados as Bem).subscribe({ // Chama novo método no serviço
        next: () => {
          alert('Bem atualizado com sucesso!');
          this.router.navigate(['/bens']);
        },
        error: (err: any) => alert('Erro ao atualizar bem.')
      });
    } else {
      // Lógica de Criação (POST)
      this.bensService.cadastrarBem(dados).subscribe({
        next: () => {
          alert('Bem cadastrado com sucesso!');
          this.router.navigate(['/bens']);
        },
        error: (err) => alert('Erro ao cadastrar bem.')
      });
    }
  }

  // (Omitido: getCurrentDateString, que já está no código)

  getCurrentDateString(): string {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
