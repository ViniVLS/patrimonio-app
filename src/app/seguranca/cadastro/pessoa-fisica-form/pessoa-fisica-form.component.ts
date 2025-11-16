// src/app/seguranca/cadastro/pessoa-fisica-form/pessoa-fisica-form.component.ts

import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { UsuarioPF } from '../../models/usuario-pf.model'; // Assumindo que você criou a interface
import { Endereco } from '../../models/endereco.model';

@Component({
  selector: 'app-pessoa-fisica-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './pessoa-fisica-form.component.html',
  styleUrls: ['./pessoa-fisica-form.component.css']
})
export class PessoaFisicaFormComponent implements OnInit {

  // Emitter para enviar os dados para o componente pai (Selector)
  @Output() dadosCadastro = new EventEmitter<UsuarioPF>();

  cadastroPFForm!: FormGroup;
  ufs = ['AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR', 'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO'];

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.cadastroPFForm = this.fb.group({
      // DADOS DE ACESSO
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmacaoSenha: ['', Validators.required],
      aceiteTermos: [false, Validators.requiredTrue],

      // PERFIL PF
      nomeCompleto: ['', [Validators.required, Validators.maxLength(255)]],
      cpf: ['', [Validators.required, Validators.pattern(/^\d{3}\.\d{3}\.\d{3}\-\d{2}$/)]],
      dataNascimento: ['', Validators.required],
      telefoneCelular: ['', Validators.required],
      sexo: ['', Validators.required],

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
    if (this.cadastroPFForm.invalid) {
      this.cadastroPFForm.markAllAsTouched();
      return;
    }

    const formValue = this.cadastroPFForm.value;

    // Monta o objeto final conforme a interface UsuarioPF
    const dadosFinais: UsuarioPF = {
        email: formValue.email,
        senha: formValue.senha,
        nomeCompleto: formValue.nomeCompleto,
        cpf: formValue.cpf,
        dataNascimento: formValue.dataNascimento,
        telefoneCelular: formValue.telefoneCelular,
        sexo: formValue.sexo,
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
