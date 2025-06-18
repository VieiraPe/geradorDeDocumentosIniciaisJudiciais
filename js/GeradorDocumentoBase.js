import { Cliente } from "./Cliente.js";

export class GeradorDocumentoBase {
  constructor(documentId, cliente) {
    if (new.target === GeradorDocumentoBase) {
      throw new TypeError(
        "GeradorDocumentoBase é uma classe abstrata e não pode ser instanciada diretamente."
      );
    }
    this.documentElement = document.getElementById(documentId);
    this.cliente = cliente;
    this.pdfFileName = "documento.pdf";
  }

  gerarConteudoEspecifico() {
    throw new Error(
      "O método 'gerarConteudoEspecifico()' deve ser implementado pelas classes filhas."
    );
  }

  gerarDocumentoHTML() {
    if (!this.documentElement) {
      console.error(
        `Elemento com ID '${this.documentElement.id}' não encontrado.`
      );
      return null;
    }

    const anoAtualElement =
      this.documentElement.querySelector("[data-ano-atual]");
    if (anoAtualElement) {
      anoAtualElement.textContent = new Date().getFullYear();
    }

    this.gerarConteudoEspecifico();
    this.documentElement.style.display = "block";
    return this.documentElement;
  }

  async gerarPDF() {
    if (!this.documentElement) {
      console.error(`Elemento do documento não encontrado para gerar PDF.`);
      return;
    }

    this.documentElement.style.display = "block";

    const paddingOffset = 5;

    const options = {
      scale: 2,
      logging: false,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      width: this.documentElement.offsetWidth,
      height: this.documentElement.offsetHeight + paddingOffset,
      windowHeight: this.documentElement.scrollHeight + paddingOffset,
    };

    try {
      const canvas = await html2canvas(this.documentElement, options);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      const pdfPageWidth = pdf.internal.pageSize.getWidth();
      const pdfPageHeight = pdf.internal.pageSize.getHeight();

      const imgHeightScaled = (canvas.height * pdfPageWidth) / canvas.width;
      let heightLeft = imgHeightScaled;

      let pageCount = 0;

      pdf.addImage(imgData, "PNG", 0, 0, pdfPageWidth, imgHeightScaled);
      heightLeft -= pdfPageHeight;

      while (heightLeft > 0) {
        pageCount++;
        const currentPosition = -(pdfPageHeight * pageCount);
        pdf.addPage();
        pdf.addImage(
          imgData,
          "PNG",
          0,
          currentPosition,
          pdfPageWidth,
          imgHeightScaled
        );
        heightLeft -= pdfPageHeight;
      }

      pdf.save(this.pdfFileName);
    } catch (error) {
      console.error("Erro ao gerar PDF:", error);
    }
  }
}
