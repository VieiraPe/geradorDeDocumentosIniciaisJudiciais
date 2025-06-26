export class Cliente {
  constructor(
    nome,
    nacionalidade,
    estadoCivil,
    profissao,
    rg,
    expedidor,
    cpf,
    endereco,
    bairro,
    cidade,
    estado,
    cep,
    numero
  ) {
    this.nome = nome;
    this.nacionalidade = nacionalidade;
    this.estadoCivil = estadoCivil;
    this.profissao = profissao;
    this.rg = rg;
    this.expedidor = expedidor;
    this.cpf = cpf;
    this.endereco = endereco;
    this.bairro = bairro;
    this.cidade = cidade;
    this.estado = estado;
    this.cep = cep;
    this.numero = numero;
  }

  formatarCPF() {
    if (this.cpf && this.cpf.length === 11) {
      return this.cpf.replace((/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4"));
    }
    return this.cpf;
  }

  getClienteQualificao() {
    return `<strong>${this.nome.toUpperCase()}</strong>, ${
      this.nacionalidade
    }, ${this.estadoCivil}, ${this.profissao}, inscrito no RG nº ${
      this.rg
    } expedido pelo ${
      this.expedidor
    } e CPF nº ${this.formatarCPF()}, residente na ${this.endereco}, nº ${
      this.numero
    }, ${this.bairro}, ${this.cidade} - ${this.estado}, CEP: ${this.cep}.`;
  }
}
