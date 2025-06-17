// js/main.js

import { Cliente } from "./Cliente.js";
import { GeradorProcuracao } from "./GeradorProcuracao.js";
import { GeradorDeclaracao } from "./GeradorDeclaracao.js";
import { GeradorContrato } from "./GeradorContrato.js";
import { GeradorGratuidade } from "./GeradorGratuidade.js";

// Mapeia os IDs dos checkboxes para as classes de geradores de documentos
// e também para o sufixo dos IDs dos botões de PDF correspondentes.
// A chave é o ID do checkbox, o valor é um objeto com a classe e o sufixo do ID do botão.
const documentGeneratorsConfig = {
  chkProcuracao: { class: GeradorProcuracao, buttonSuffix: "Procuracao" },
  chkDeclaracao: { class: GeradorDeclaracao, buttonSuffix: "Declaracao" },
  chkContrato: { class: GeradorContrato, buttonSuffix: "Contrato" },
  chkGratuidade: { class: GeradorGratuidade, buttonSuffix: "Gratuidade" },
};

let clienteAtual = null; // Armazena o objeto Cliente atualmente preenchido

// Dimensões padrão de uma folha A4 em milímetros
const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

document.addEventListener("DOMContentLoaded", function () {
  // Esconder todos os documentos e botões PDF inicialmente
  document.querySelectorAll(".documento").forEach((doc) => {
    doc.style.display = "none";
  });
  document.querySelectorAll(".pdf-button").forEach((btn) => {
    btn.style.display = "none";
  });

  // Configurar o formulário principal
  document
    .getElementById("formulario")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      processarGeracaoDocumentos();
    });

  // --- Início das tratativas para o campo CEP ---
  const cepInput = document.getElementById("cepCliente");
  const cepButton = document.getElementById("cepButton"); // Seleciona o botão "Buscar" pelo ID

  // Cria os elementos para o spinner, o checkmark e o ícone de erro
  const cepStatusContainer = document.getElementById("cepStatusContainer");

  const cepSpinner = document.createElement("span");
  cepSpinner.id = "cepSpinner";
  // Removido textContent '⟳' pois o spinner será puramente CSS
  cepSpinner.style.display = "none";
  cepSpinner.style.fontSize = "1.2em";
  cepSpinner.style.verticalAlign = "middle";
  cepSpinner.style.marginRight = "5px";
  // Adiciona uma classe para animação via CSS
  cepSpinner.classList.add("spinner-animation");

  const cepCheckmark = document.createElement("span");
  cepCheckmark.id = "cepCheckmark";
  cepCheckmark.textContent = "✓"; // Símbolo Unicode para checkmark
  cepCheckmark.style.display = "none";
  cepCheckmark.style.color = "green";
  cepCheckmark.style.fontSize = "1.2em";
  cepCheckmark.style.verticalAlign = "middle";

  const cepErrorIcon = document.createElement("span");
  cepErrorIcon.id = "cepErrorIcon";
  cepErrorIcon.textContent = "✕"; // Símbolo Unicode para 'X' (cruz de multiplicação)
  cepErrorIcon.style.display = "none";
  cepErrorIcon.style.color = "red";
  cepErrorIcon.style.fontSize = "1.2em";
  cepErrorIcon.style.verticalAlign = "middle";

  if (cepStatusContainer) {
    cepStatusContainer.appendChild(cepSpinner);
    cepStatusContainer.appendChild(cepCheckmark);
    cepStatusContainer.appendChild(cepErrorIcon); // Adiciona o ícone de erro
  }

  if (cepInput) {
    // 1. Limita o campo a 8 dígitos e aceita apenas números
    cepInput.addEventListener("input", function (event) {
      let value = event.target.value.replace(/\D/g, ""); // Remove tudo que não for dígito
      if (value.length > 8) {
        value = value.substring(0, 8); // Limita a 8 dígitos
      }

      // Aplica a máscara 00000-000 de forma fluida
      let formattedValue = "";
      for (let i = 0; i < value.length; i++) {
        formattedValue += value[i];
        if (i === 4) {
          // Posição para o traço (00000-000)
          formattedValue += "-";
        }
      }
      event.target.value = formattedValue;

      // Oculta todos os ícones de status quando o usuário começa a digitar novamente
      if (cepSpinner) cepSpinner.style.display = "none";
      if (cepCheckmark) cepCheckmark.style.display = "none";
      if (cepErrorIcon) cepErrorIcon.style.display = "none";
    });

    // 2. Chama a consultaCep() quando o campo perde o foco (o usuário termina de digitar)
    cepInput.addEventListener("blur", function () {
      // Garante que a consulta só será feita se houver 8 dígitos
      if (cepInput.value.length === 8) {
        consultaCep();
      }
    });
  }

  // 3. Listener para o botão de consulta de CEP (agora usando o ID do botão)
  if (cepButton) {
    cepButton.addEventListener("click", consultaCep);
  }
  // --- Fim das tratativas para o campo CEP ---

  // --- Início das tratativas para o campo CPF ---
  const cpfInput = document.getElementById("cpfCliente");

  if (cpfInput) {
    cpfInput.addEventListener("input", function (event) {
      let value = event.target.value.replace(/\D/g, ""); // Remove tudo que não for dígito
      if (value.length > 11) {
        value = value.substring(0, 11); // Limita a 11 dígitos
      }

      // Aplica a máscara 000.000.000-00 de forma fluida
      let formattedValue = "";
      for (let i = 0; i < value.length; i++) {
        formattedValue += value[i];
        if (i === 2 || i === 5) {
          formattedValue += ".";
        } else if (i === 8) {
          formattedValue += "-";
        }
      }
      event.target.value = formattedValue;
    });
  }
  // --- Fim das tratativas para o campo CPF ---

  // --- Início das NOVAS tratativas para o campo RG ---
  const rgInput = document.getElementById("rgCliente");

  if (rgInput) {
    rgInput.addEventListener("input", function (event) {
      let value = event.target.value.replace(/\D/g, ""); // Remove tudo que não for dígito
      if (value.length > 9) {
        value = value.substring(0, 9); // Limita a 9 dígitos
      }

      // Aplica a máscara 00.000.000-0 de forma fluida
      let formattedValue = "";
      for (let i = 0; i < value.length; i++) {
        formattedValue += value[i];
        if (i === 1 || i === 4) {
          // Posições para os pontos (00.000.000-0)
          formattedValue += ".";
        } else if (i === 7) {
          // Posição para o traço
          formattedValue += "-";
        }
      }
      event.target.value = formattedValue;
    });
  }
  // --- Fim das NOVAS tratativas para o campo RG ---
});

/**
 * Função assíncrona para consultar o CEP e preencher os campos de endereço.
 */
async function consultaCep() {
  const cepInput = document.getElementById("cepCliente");
  const cepButton = document.getElementById("cepButton");
  const cepSpinner = document.getElementById("cepSpinner");
  const cepCheckmark = document.getElementById("cepCheckmark");
  const cepErrorIcon = document.getElementById("cepErrorIcon");

  const cep = cepInput.value.replace(/\D/g, "");

  if (cep.length !== 8) {
    return;
  }

  // Feedback visual e desabilitação durante a busca
  cepInput.disabled = true;
  if (cepButton) cepButton.disabled = true;
  if (cepSpinner) cepSpinner.style.display = "inline-block"; // Exibe o spinner
  if (cepCheckmark) cepCheckmark.style.display = "none";
  if (cepErrorIcon) cepErrorIcon.style.display = "none";

  try {
    const url = `https://viacep.com.br/ws/${cep}/json/`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.erro) {
      if (cepErrorIcon) cepErrorIcon.style.display = "inline-block"; // Exibe o ícone de erro
      // Limpa os campos se o CEP não for encontrado
      document.getElementById("enderecoCliente").value = "";
      document.getElementById("bairroCliente").value = "";
      document.getElementById("cidadeCliente").value = "";
      document.getElementById("ufCliente").value = "";
      document.getElementById("numeroCliente").value = "";
      return;
    }

    document.getElementById("enderecoCliente").value = data.logradouro || "";
    document.getElementById("bairroCliente").value = data.bairro || "";
    document.getElementById("cidadeCliente").value = data.localidade || "";
    document.getElementById("ufCliente").value = data.uf || "";

    if (cepCheckmark) cepCheckmark.style.display = "inline-block"; // Exibe o checkmark no sucesso
  } catch (error) {
    console.error("Erro ao consultar CEP:", error);
    alert(
      "Ocorreu um erro ao consultar o CEP. Por favor, tente novamente mais tarde."
    );
    if (cepErrorIcon) cepErrorIcon.style.display = "inline-block"; // Exibe o ícone de erro em caso de falha de rede
  } finally {
    // Habilitação e remoção do feedback visual
    cepInput.disabled = false;
    if (cepButton) cepButton.disabled = false;
    if (cepSpinner) cepSpinner.style.display = "none"; // Esconde o spinner
  }
}

/**
 * Função para gerar PDF de um elemento HTML.
 * Gerencia a paginação para documentos de múltiplas páginas (como contratos).
 * @param {HTMLElement} element O elemento HTML a ser convertido em PDF.
 * @param {string} filename O nome do arquivo PDF.
 */
async function generatePdfForElement(element, filename) {
  // Salva o estilo computado atual do elemento antes de qualquer modificação
  const computedStyle = window.getComputedStyle(element);
  const originalStyle = {
    padding: element.style.padding,
    margin: element.style.margin,
    border: element.style.border,
    display: element.style.display,
    width: element.style.width,
    height: element.style.height,
    overflow: element.style.overflow,
    position: element.style.position, // Salva a posição
    left: element.style.left, // Salva o left
    top: element.style.top, // Salva o top
  };

  // Aplica estilos temporários para garantir que html2canvas capture o elemento corretamente
  // Estes estilos são o mínimo necessário para garantir uma boa captura,
  // sem interferir com o design existente (padding, margin, border devem vir do CSS).
  element.style.position = "relative"; // Importante para html2canvas capturar corretamente
  element.style.left = "0px";
  element.style.top = "0px";
  element.style.display = "block"; // Garante que o elemento esteja visível
  element.style.overflow = "hidden"; // Esconde overflow para evitar barras de rolagem na captura

  // Define a largura do elemento para corresponder à largura do PDF (em pixels) para renderização consistente
  // A4_WIDTH_MM * (pixels per mm), assumindo 96 DPI por padrão no navegador para conversão
  const dpi = 96; // DPI padrão para navegadores
  const mmPerInch = 25.4; // milímetros por polegada
  const pxWidth = A4_WIDTH_MM * (dpi / mmPerInch);
  element.style.width = `${pxWidth}px`;
  element.style.height = "auto"; // Garante que a altura se ajuste ao conteúdo

  const scale = 2; // Escala para maior qualidade na captura
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    // Captura a largura e altura computadas do elemento para renderização mais fiel
    windowWidth: element.offsetWidth,
    windowHeight: element.offsetHeight,
    logging: false, // Desabilita logs extensos do html2canvas no console
    // Adiciona um pequeno atraso para renderização de fontes ou outros elementos dinâmicos
    // remove este valor se não for necessário e estiver causando lentidão
    // foreignObjectRendering: true // Pode ser útil para SVG ou HTML complexo dentro do SVG (experimental)
  });

  // Restaura os estilos originais do elemento após a captura do canvas
  element.style.padding = originalStyle.padding;
  element.style.margin = originalStyle.margin;
  element.style.border = originalStyle.border;
  element.style.display = originalStyle.display;
  element.style.width = originalStyle.width;
  element.style.height = originalStyle.height;
  element.style.overflow = originalStyle.overflow;
  element.style.position = originalStyle.position;
  element.style.left = originalStyle.left;
  element.style.top = originalStyle.top;

  const imgData = canvas.toDataURL("image/jpeg", 1.0); // Imagem de alta qualidade JPEG
  const pdf = new window.jspdf.jsPDF("p", "mm", "a4"); // PDF em A4 retrato

  const pdfWidth = pdf.internal.pageSize.getWidth(); // Largura da página PDF em mm
  const pdfHeight = pdf.internal.pageSize.getHeight(); // Altura da página PDF em mm

  // Calcula a altura da imagem quando escalada para a largura do PDF, mantendo proporção
  const imgHeightOnPdf = (canvas.height * pdfWidth) / canvas.width;

  // Calcular o número exato de páginas necessárias
  // Usamos uma pequena tolerância (0.1mm) para corrigir imprecisões de ponto flutuante
  // e evitar uma página em branco extra quando o conteúdo é apenas milimetricamente maior.
  const numPages = Math.ceil((imgHeightOnPdf - 0.1) / pdfHeight);

  let currentYOffset = 0; // Deslocamento Y na imagem para a próxima "fatia"

  // Adiciona cada "fatia" da imagem como uma página no PDF
  for (let i = 0; i < numPages; i++) {
    // Adiciona uma nova página se não for a primeira
    if (i > 0) {
      pdf.addPage();
    }

    // Adiciona a imagem à página. O 'position' negativo "rola" a imagem para cima
    // para exibir a próxima parte do conteúdo na nova página.
    pdf.addImage(imgData, "JPEG", 0, -currentYOffset, pdfWidth, imgHeightOnPdf);

    currentYOffset += pdfHeight; // Atualiza o deslocamento para a próxima fatia
  }

  pdf.save(filename);
}

/**
 * Processa a geração dos documentos selecionados no formulário.
 */
function processarGeracaoDocumentos() {
  // Coleta todos os dados do formulário do cliente
  const nome = document.getElementById("nomeCliente").value;
  const nacionalidade = document.getElementById("nacionalidadeCliente").value;
  const estadoCivil = document.getElementById("estadoCivilCliente").value;
  const profissao = document.getElementById("profissaoCliente").value;
  const rg = document.getElementById("rgCliente").value;
  const expedidor = document.getElementById("expedidaPor").value;
  const cpf = document.getElementById("cpfCliente").value;
  const endereco = document.getElementById("enderecoCliente").value;
  const bairro = document.getElementById("bairroCliente").value;
  const cidade = document.getElementById("cidadeCliente").value;
  const estado = document.getElementById("ufCliente").value;
  const cep = document.getElementById("cepCliente").value;
  const numero = document.getElementById("numeroCliente").value;

  // Cria ou atualiza o objeto Cliente com os dados coletados
  clienteAtual = new Cliente(
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
  );

  // Esconde todos os documentos e botões PDF antes de gerar os novos para evitar duplicidade ou visualização incorreta
  document.querySelectorAll(".documento").forEach((doc) => {
    doc.style.display = "none";
  });
  document.querySelectorAll(".pdf-button").forEach((btn) => {
    btn.style.display = "none";
  });

  let primeiroDocumentoGerado = null;

  // Itera sobre os checkboxes e gera documentos selecionados
  for (const checkboxId in documentGeneratorsConfig) {
    const config = documentGeneratorsConfig[checkboxId];
    const checkbox = document.getElementById(checkboxId);

    if (checkbox && checkbox.checked) {
      const DocumentClass = config.class;
      const gerador = new DocumentClass(clienteAtual);

      // Gera o HTML do documento e o exibe
      const docElement = gerador.gerarDocumentoHTML(); // docElement é o HTMLElement do documento
      if (docElement) {
        const pdfButton = document.getElementById(
          `botaoPDF${config.buttonSuffix}`
        );
        if (pdfButton) {
          pdfButton.style.display = "inline-block";
          // Altera o onclick para chamar a nova função generatePdfForElement
          pdfButton.onclick = () => {
            const filename = `${config.buttonSuffix}.pdf`; // Ex: "Procuracao.pdf"
            generatePdfForElement(docElement, filename);
          };
        }

        if (!primeiroDocumentoGerado) {
          primeiroDocumentoGerado = docElement;
        }
      }
    }
  }

  // Rola a tela suavemente para o primeiro documento gerado, se houver algum
  if (primeiroDocumentoGerado) {
    primeiroDocumentoGerado.scrollIntoView({ behavior: "smooth" });
  } else {
    alert("Nenhum documento selecionado para gerar.");
  }
}
