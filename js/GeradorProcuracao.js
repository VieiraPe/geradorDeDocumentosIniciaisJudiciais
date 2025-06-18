
import { GeradorDocumentoBase } from "./GeradorDocumentoBase.js";

export class GeradorProcuracao extends GeradorDocumentoBase {
  constructor(cliente) {
    super("previewDocumentoProcuracao", cliente);
    this.pdfFileName = `PROCURAÇÃO - ${cliente.nome}.pdf`;
  }

  gerarConteudoEspecifico() {
    const outorganteTextElement = this.documentElement.querySelector(
      "#outorganteTextProcuracao"
    );
    if (outorganteTextElement) {
      outorganteTextElement.innerHTML = this.cliente.getClienteQualificao();
    }
  }
}
