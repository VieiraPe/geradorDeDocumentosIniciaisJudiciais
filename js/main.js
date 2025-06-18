import { Cliente } from "./Cliente.js";
import { GeradorProcuracao } from "./GeradorProcuracao.js";
import { GeradorDeclaracao } from "./GeradorDeclaracao.js";
import { GeradorContrato } from "./GeradorContrato.js";
import { GeradorGratuidade } from "./GeradorGratuidade.js";

const documentGeneratorsConfig = {
  chkProcuracao: { class: GeradorProcuracao, buttonSuffix: "Procuracao" },
  chkDeclaracao: { class: GeradorDeclaracao, buttonSuffix: "Declaracao" },
  chkContrato: { class: GeradorContrato, buttonSuffix: "Contrato" },
  chkGratuidade: { class: GeradorGratuidade, buttonSuffix: "Gratuidade" },
};

let clienteAtual = null;

const A4_WIDTH_MM = 210;
const A4_HEIGHT_MM = 297;

document.addEventListener("DOMContentLoaded", function () {
  document.querySelectorAll(".documento").forEach((doc) => {
    doc.style.display = "none";
  });
  document.querySelectorAll(".pdf-button").forEach((btn) => {
    btn.style.display = "none";
  });

  document
    .getElementById("formulario")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      processarGeracaoDocumentos();
    });

  const cepInput = document.getElementById("cepCliente");
  const cepButton = document.getElementById("cepButton");

  const cepStatusContainer = document.getElementById("cepStatusContainer");

  const cepSpinner = document.createElement("span");
  cepSpinner.id = "cepSpinner";
  cepSpinner.style.display = "none";
  cepSpinner.style.fontSize = "1.2em";
  cepSpinner.style.verticalAlign = "middle";
  cepSpinner.style.marginRight = "5px";
  cepSpinner.classList.add("spinner-animation");

  const cepCheckmark = document.createElement("span");
  cepCheckmark.id = "cepCheckmark";
  cepCheckmark.textContent = "✓";
  cepCheckmark.style.display = "none";
  cepCheckmark.style.color = "green";
  cepCheckmark.style.fontSize = "1.2em";
  cepCheckmark.style.verticalAlign = "middle";

  const cepErrorIcon = document.createElement("span");
  cepErrorIcon.id = "cepErrorIcon";
  cepErrorIcon.textContent = "✕";
  cepErrorIcon.style.display = "none";
  cepErrorIcon.style.color = "red";
  cepErrorIcon.style.fontSize = "1.2em";
  cepErrorIcon.style.verticalAlign = "middle";

  if (cepStatusContainer) {
    cepStatusContainer.appendChild(cepSpinner);
    cepStatusContainer.appendChild(cepCheckmark);
    cepStatusContainer.appendChild(cepErrorIcon);
  }

  if (cepInput) {
    cepInput.addEventListener("input", function (event) {
      let value = event.target.value.replace(/\D/g, "");
      if (value.length > 8) {
        value = value.substring(0, 8);
      }

      let formattedValue = "";
      for (let i = 0; i < value.length; i++) {
        formattedValue += value[i];
        if (i === 4) {
          formattedValue += "-";
        }
      }
      event.target.value = formattedValue;

      if (cepSpinner) cepSpinner.style.display = "none";
      if (cepCheckmark) cepCheckmark.style.display = "none";
      if (cepErrorIcon) cepErrorIcon.style.display = "none";
    });

    cepInput.addEventListener("blur", function () {
      if (cepInput.value.length === 8) {
        consultaCep();
      }
    });
  }

  if (cepButton) {
    cepButton.addEventListener("click", consultaCep);
  }

  const cpfInput = document.getElementById("cpfCliente");

  if (cpfInput) {
    cpfInput.addEventListener("input", function (event) {
      let value = event.target.value.replace(/\D/g, "");
      if (value.length > 11) {
        value = value.substring(0, 11);
      }

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

  const rgInput = document.getElementById("rgCliente");

  if (rgInput) {
    rgInput.addEventListener("input", function (event) {
      let value = event.target.value.replace(/\D/g, "");
      if (value.length > 9) {
        value = value.substring(0, 9);
      }

      let formattedValue = "";
      for (let i = 0; i < value.length; i++) {
        formattedValue += value[i];
        if (i === 1 || i === 4) {
          formattedValue += ".";
        } else if (i === 7) {
          formattedValue += "-";
        }
      }
      event.target.value = formattedValue;
    });
  }
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
    cepInput.disabled = false;
    if (cepButton) cepButton.disabled = false;
    if (cepSpinner) cepSpinner.style.display = "none"; // Esconde o spinner
  }
}

async function generatePdfForElement(element, filename) {
  const computedStyle = window.getComputedStyle(element);
  const originalStyle = {
    padding: element.style.padding,
    margin: element.style.margin,
    border: element.style.border,
    display: element.style.display,
    width: element.style.width,
    height: element.style.height,
    overflow: element.style.overflow,
    position: element.style.position,
    left: element.style.left,
    top: element.style.top,
  };

  element.style.left = "0px";
  element.style.top = "0px";
  element.style.display = "block";
  element.style.overflow = "hidden";

  const dpi = 96;
  const mmPerInch = 25.4;
  const pxWidth = A4_WIDTH_MM * (dpi / mmPerInch);
  element.style.width = `${pxWidth}px`;
  element.style.height = "auto";

  const scale = 2;
  const canvas = await html2canvas(element, {
    scale: scale,
    useCORS: true,
    windowWidth: element.offsetWidth,
    windowHeight: element.offsetHeight,
    logging: false,
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

  const imgData = canvas.toDataURL("image/jpeg", 1.0);
  const pdf = new window.jspdf.jsPDF("p", "mm", "a4");

  const pdfWidth = pdf.internal.pageSize.getWidth();
  const pdfHeight = pdf.internal.pageSize.getHeight();

  const imgHeightOnPdf = (canvas.height * pdfWidth) / canvas.width;

  const numPages = Math.ceil((imgHeightOnPdf - 0.1) / pdfHeight);

  let currentYOffset = 0;

  for (let i = 0; i < numPages; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    pdf.addImage(imgData, "JPEG", 0, -currentYOffset, pdfWidth, imgHeightOnPdf);

    currentYOffset += pdfHeight;
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
