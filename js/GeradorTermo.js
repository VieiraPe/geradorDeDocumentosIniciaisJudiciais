import { GeradorDocumentoBase } from "./GeradorDocumentoBase.js";

export class GeradorTermo extends GeradorDocumentoBase {
  constructor(cliente) {
    super("previewDocumentoTermo", cliente);
    this.pdfFileName = `TERMO - ${this.cliente.nome}.pdf`;
  }

  gerarConteudoEspecifico() {
    const corpoTermoElement = this.documentElement.querySelector("#corpoTermo");
    if (corpoTermoElement) {
      corpoTermoElement.innerHTML = `
        ${this.cliente.getClienteQualificao()}

        <br><br>
        para hipossuficiência, <b>DECLARO</b> para os devidos fins e legais efeitos de direito e de prova junto ao juízo cível, e a quem por competente distribuição couber, o julgamento da lide, que não tenho como arcar com as despesas, ônus e/ou custas processuais, ou seja afirmo em detrimento de minha própria <strong>SUBSISTÊNCIA</strong>, com o fim de obter o benefício, para o processamento da ação, sendo a presente firmada com base nos artigos n° 1060/50 com as novas alterações incorporadas pela lei 7510/86 estando nas exatas condições sob as penas da lei, para dar entrada na presente demanda. <strong>Fica claro então que não está sendo cobrado antecipadamente honorários advocatícios</strong> do declarante e/ou autor proposta perante este acima, sendo os honorários de contrato condicionado ao sucesso da demanda, independente dos de sucumbência.
      `;
    }
  }
}
