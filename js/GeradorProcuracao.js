// js/GeradorProcuracao.js

import { GeradorDocumentoBase } from "./GeradorDocumentoBase.js";

export class GeradorProcuracao extends GeradorDocumentoBase {
  constructor(cliente) {
    // O ID do elemento HTML da procuração
    super("previewDocumentoProcuracao", cliente);
    this.pdfFileName = `PROCURAÇÃO - ${cliente.nome}.pdf`;
  }

  gerarConteudoEspecifico() {
    // Seleciona o elemento específico DENTRO do contêiner da procuração
    const outorganteTextElement = this.documentElement.querySelector(
      "#outorganteTextProcuracao"
    );
    if (outorganteTextElement) {
      outorganteTextElement.innerHTML = this.cliente.getClienteQualificao();
    }
    // Adicione mais preenchimentos específicos da procuração aqui se houver
  }
}
