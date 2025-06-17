// js/GeradorDeclaracao.js

import { GeradorDocumentoBase } from "./GeradorDocumentoBase.js";

export class GeradorDeclaracao extends GeradorDocumentoBase {
  constructor(cliente) {
    // O ID do elemento HTML da declaração
    super("previewDocumentoDeclaracao", cliente);
    this.pdfFileName = `DECLARAÇÃO - ${cliente.nome}.pdf`;
  }

  gerarConteudoEspecifico() {
    // Seleciona o elemento específico DENTRO do contêiner da declaração
    const corpoDeclaracaoElement =
      this.documentElement.querySelector("#corpoDeclaracao");
    if (corpoDeclaracaoElement) {
      corpoDeclaracaoElement.innerHTML = `
      <br>
        ${this.cliente.getClienteQualificao()}
        <br><br> <br>
        <b>Declaro</b>, perante ao juízo de direito em que tramita <b>ação de indenização para os devidos fins de direito e a quem competir que estou ciente de que serão propostas ações, sendo minha a responsabilidade civil e criminal em caso de falsa declaração com fim de alterar a realidade dos fatos.</b>
        <br><br> <br>

        <b>DECLARO</b> ainda para todos fins de direito e sob as penas da lei que <b>sou ISENTO (A) DE IMPOSTO DE RENDA.</b>

      `;
    }
  }
}
