import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

// Interfaces criadas anteriormente
import { UsuarioPJ } from '../../models/usuario-pj.model';
import { Endereco }from '../../models/endereco.model';

@Component({
  selector: 'app-pessoa-juridica-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './pessoa-juridica-form.component.html',
  styleUrls: ['./pessoa-juridica-form.component.css']
})
export class PessoaJuridicaFormComponent implements OnInit {

  // Emitter para enviar os dados para o componente pai (Selector)
  @Output() dadosCadastro = new EventEmitter<UsuarioPJ>();

  cadastroPJForm!: FormGroup;
  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cadastroPJForm = this.fb.group({
      // DADOS DE ACESSO
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', Validators.required],
      aceiteTermos: [false, Validators.requiredTrue],

      // PERFIL PJ
      razaoSocial: ['', [Validators.required, Validators.maxLength(255)]],
      cnpj: ['', [Validators.required, Validators.pattern(/^\d{2}\.\d{3}\.\d{3}\/\d{4}\-\d{2}$/)]], // Exemplo de regex CNPJ
      nomeFantasia: [''],
      telefoneComercial: ['', Validators.required],
      responsavelLegal: ['', Validators.required],
      inscricaoEstadual: [''],
      inscricaoMunicipal: [''],

      // ENDEREÇO
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numero: ['', Validators.required],
      bairro: ['', Validators.required],
      cidade: ['', Validators.required],
      uf: ['', Validators.required]
    }, {
      // Validação de senhas customizada
      validators: this.passwordsMatchValidator
    });
  }

  // Função customizada para validar se as senhas são iguais
  passwordsMatchValidator(form: FormGroup) {
    const senha = form.get('senha')?.value;
    const confirmacao = form.get('confirmacaoSenha')?.value;
    return senha === confirmacao ? null : { mismatch: true };
  }

  // Método de envio que monta o objeto final e emite para o container
  enviarDados() {
    if (this.cadastroPJForm.invalid) {
      this.cadastroPJForm.markAllAsTouched();
      alert('Por favor, corrija os erros do formulário antes de prosseguir.');
      return;
    }

    const formValue = this.cadastroPJForm.value;

    // Monta o objeto final conforme a interface UsuarioPJ
    const dadosFinais: UsuarioPJ = {
        email: formValue.email,
        senha: formValue.senha,
        razaoSocial: formValue.razaoSocial,
        cnpj: formValue.cnpj,
        nomeFantasia: formValue.nomeFantasia,
        telefoneComercial: formValue.telefoneComercial,
        responsavelLegal: formValue.responsavelLegal,
        inscricaoEstadual: formValue.inscricaoEstadual,
        inscricaoMunicipal: formValue.inscricaoMunicipal,
        aceiteTermos: formValue.aceiteTermos,
        endereco: {
            cep: formValue.cep,
            logradouro: formValue.logradouro,
            numero: formValue.numero,
            bairro: formValue.bairro,
            cidade: formValue.cidade,
            uf: formValue.uf
        }
    };

    this.dadosCadastro.emit(dadosFinais);
  }
}
