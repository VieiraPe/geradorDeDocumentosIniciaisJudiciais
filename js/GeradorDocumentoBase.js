// js/GeradorDocumentoBase.js

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

  /**
   * Gera o PDF do documento atual, lidando com múltiplas páginas se o conteúdo for extenso.
   */
  async gerarPDF() {
    if (!this.documentElement) {
      console.error(`Elemento do documento não encontrado para gerar PDF.`);
      return;
    }

    this.documentElement.style.display = "block"; // Garante que esteja visível

    // Considerar um pequeno padding ou offset para evitar cortes bruscos na imagem
    // ou se o CSS do documento já tiver padding.
    const paddingOffset = 5; // Ajuste este valor se ainda vir um corte na borda

    const options = {
      scale: 2, // Aumenta a resolução para melhor qualidade no PDF
      logging: false,
      useCORS: true,
      allowTaint: true,
      letterRendering: true,
      // Para html2canvas, usar offsetWidth/Height é geralmente o mais direto
      width: this.documentElement.offsetWidth,
      height: this.documentElement.offsetHeight + paddingOffset, // Adiciona um pequeno buffer na altura
      windowHeight: this.documentElement.scrollHeight + paddingOffset, // Importante para capturar todo o conteúdo rolável
    };

    try {
      const canvas = await html2canvas(this.documentElement, options);
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jspdf.jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });

      // Dimensões da página A4 em mm
      const pdfPageWidth = pdf.internal.pageSize.getWidth(); // A4 = 210mm
      const pdfPageHeight = pdf.internal.pageSize.getHeight(); // A4 = 297mm

      // Calcular a altura da imagem no PDF, mantendo a proporção da imagem capturada
      const imgHeightScaled = (canvas.height * pdfPageWidth) / canvas.width;
      let heightLeft = imgHeightScaled; // Altura restante da imagem a ser adicionada

      let pageCount = 0; // Contador de páginas adicionadas

      // Adicionar a primeira página
      pdf.addImage(imgData, "PNG", 0, 0, pdfPageWidth, imgHeightScaled);
      heightLeft -= pdfPageHeight; // Subtrai a altura da primeira página

      // Loop para adicionar páginas subsequentes
      // A condição `heightLeft > -1` (ou `heightLeft > 0.01` para flutuantes)
      // é mais segura para evitar páginas em branco, pois verifica se ainda há
      // conteúdo significativo que exceda a altura de uma página.
      while (heightLeft > 0) {
        // Alterado para > 0 para evitar página extra
        pageCount++;
        const currentPosition = -(pdfPageHeight * pageCount); // Deslocamento para cima para a próxima seção da imagem
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
