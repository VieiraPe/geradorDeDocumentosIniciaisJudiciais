
# Gerador de Documentos Dinâmico

## Descrição

Este projeto é uma aplicação web frontend simples e intuitiva que permite aos Advogados e Escritórios de Advocacia gerar diferentes tipos de documentos (como Procurações, Termos de Gratuidade de Justiça, Declarações e Contratos) preenchendo um formulário com dados do cliente. Os documentos são gerados dinamicamente no navegador e podem ser pré-visualizados e descarregados em formato PDF.


## Funcionalidades
- **Formulário Dinâmico  Recolha de dados do cliente** (nome, nacionalidade, estado civil, profissão, RG, CPF, endereço completo via consulta de CEP).

- **Consulta de CEP:** Integração com a API ViaCEP para preenchimento automático de endereço (logradouro, bairro, cidade, UF) ao inserir o CEP.

- **Máscaras de Entrada:** Campos de CEP, CPF e RG com máscaras de formatação em tempo real.

- **Seleção de Documentos:** Opção para selecionar quais tipos de documentos o utilizador deseja gerar.

- **Pré-visualização em HTML:**  Visualização instantânea dos documentos gerados diretamente na página.

- **Geração de PDF:**  Descarregamento de cada documento gerado como um arquivo PDF individual, com paginação inteligente para lidar com documentos curtos (uma página) e longos (múltiplas páginas, como contratos).

- **Responsividade:** O layout do formulário e dos documentos adapta-se a diferentes tamanhos de tela (desktop, tablet, mobile).



### Como Usar
- **Descarregar/Clonar o Repositório:** Obtenha todos os arquivos do projeto.

- **Abrir index.html:** Simplesmente abra o arquivo index.html no seu navegador web. Não é necessário um servidor local complexo para a parte frontend.

- **Preencher o Formulário:** Insira os dados do cliente nos campos do formulário. O campo CEP preencherá automaticamente o endereço ao ser preenchido e perder o foco ou ao clicar no botão "Buscar".

- **Selecionar Documentos:** Marque os checkboxes dos documentos que deseja gerar.

- **Gerar Documentos:** Clique no botão "Gerar Documentos Selecionados". Os documentos aparecerão abaixo do formulário.

- **Descarregar PDF:** Para cada documento gerado, clique no botão "Download [Nome do Documento] PDF" para guardar o arquivo no seu computador.


### Tecnologias Utilizadas
- **HTML5:** Estrutura da página web.

- **CSS3:** Estilização e responsividade.

- **JavaScript (ES6+):** Lógica interativa do frontend.

- **html2canvas:** Biblioteca JavaScript para converter HTML em um elemento canvas.

- **jspdf:** Biblioteca JavaScript para gerar documentos PDF a partir de conteúdo HTML/canvas.
