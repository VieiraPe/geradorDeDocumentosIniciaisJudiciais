// js/GeradorContrato.js

import { GeradorDocumentoBase } from "./GeradorDocumentoBase.js";

export class GeradorContrato extends GeradorDocumentoBase {
  constructor(cliente) {
    // O ID do elemento HTML do contrato
    super("previewDocumentoContrato", cliente);
    this.pdfFileName = `CONTRATO - ${cliente.nome.toUpperCase()}.pdf`;
  }

  gerarConteudoEspecifico() {
    // Seleciona o elemento específico DENTRO do contêiner do contrato
    const corpoContratoElement =
      this.documentElement.querySelector("#corpoContrato");
    if (corpoContratoElement) {
      corpoContratoElement.innerHTML = `
          <u>Contratante:</u>         
          <strong>${this.cliente.nome.toUpperCase()}</strong>, ${
        this.cliente.nacionalidade
      }, ${this.cliente.estadoCivil}, ${
        this.cliente.profissao
      }, inscrito no RG nº ${this.cliente.rg} expedido pelo ${
        this.cliente.expedidor
      } e CPF nº ${this.cliente.formatarCPF()}, residente na ${
        this.cliente.endereco
      }, ${this.cliente.bairro}, ${this.cliente.cidade} - ${
        this.cliente.estado
      }, CEP: ${this.cliente.cep}.
      <br>
      <br>
      
      <u>Contratado:</u>
            <strong>REGINALDO FRANCISCO DA SILVA</strong>,brasileiro, solteiro, advogado inscrito na OAB/RJ 179612, com escritório na Condomínio Centro Comercial Barra Plaza - Av. Ayrton Senna, 1850, loja 118, Barra da Tijuca - CEP 22.275-003 - llmadvocacia@bol.com.br , telefones: 21 9 6435-6715 / 9 8165 – 5990.
            <br><br>
            <u>Cláusula 01ª:</u> O presente contrato tem por objetivo promover a distribuição de <b>ação judicial ou procedimento ADM</b> competente contra quem de direito, através desta propositura, <b>abrindo mão da defensoria pública em prol da experiência na especialidade do advogado contratado </b>que visa o recebimento de verbas e indenizações cabíveis por descumprimento, mediante as seguintes cláusulas:
            <br><br>
            <u>Parágrafo primeiro:</u> Os <b>contratados</b> ajustam com o <b>contratante</b> presta-lhe seus serviços profissionais na defesa dos seus direitos, conforme procurações que lhe foram outorgadas.
            <br><br>
            <u>Parágrafo segundo:</u> Ditos serviços serão exercidos pessoalmente pelo advogado <b>contratado</b> ou através de profissionais de sua confiança, devidamente habilitados, mediante substabelecimento que venha a conferir.
            <br><br>
            <u>Parágrafo terceiro:</u> Fica a critério dos <b>contratados e de seus prepostos</b> as escolhas dos procedimentos adequados da defesa dos direitos mencionados na <b>cláusula primeira.</b>
            <br><br>
            <u>Cláusula 02ª:</u> Considerando as características das obrigações em epígrafe ora assumidas pelos <b>contratados,</b> os serviços profissionais ajustados serão remunerados da seguinte forma: 35% sobre o valor total bruto dos direitos que vierem a ser reconhecidos, sentenciados ou homologados ao <b>contratante,</b> ou acordo judicial ou extra, além de gastos operacionais tais como assistente técnico, contador, honorários de sucumbência e etc.
            <br><br>
            Bem como também sobre ou adicionando e incluindo os atrasados caso sejam concedidos, ou seja sobre o proveito econômico do processo já estes liquidados a vista de uma vez)com vencimento na data do recebimento de cada benefício e retroativos ou Precatório após a implantação do mesmo.
            <br><br>
            O proveito econômico, sobre o qual incide os honorários advocatícios, é o valor bruto composto por todas as parcelas vencidas e parcelas vincendas, juros e atualização monetária calculadas até a data do trânsito em julgado, sem dedução de benefícios previdenciários já recebidos, sejam decorrentes do presente processo ou outros processos administrativos ou judiciais. Desta forma, proveito econômico não se confunde com o valor líquido recebido por meio de RPV ou Precatório, incluindo as parcelas do seguros desemprego.
            <br><br>
            <u>Parágrafo primeiro:</u> Todas as despesas extrajudiciais que não possam ser suportadas pelo <b>contratante</b> serão pagas pelo <b>contratado,</b> inclusive com profissionais e técnicos, devendo o reembolso se efetuar quando do término do feito, salvo na hipótese de rescisão de contrato por parte do <b>contratante</b> sem justo motivo, caso em que serão devidas na sua totalidade e exigíveis de imediato, corrigida monetariamente pelos índices oficiais.
            <br><br>
            <u>Parágrafo segundo:</u> É facultado ao <b>contratado,</b> <u>em caso de não concessão do benefício da justiça gratuita,</u>a opção de quitação/pagamento das despesas judiciais devidas pelo <b>contratante.</b>
            <br><br><br>
            <u>Parágrafo terceiro:</u> <b>No caso de improcedência dos pedidos, não serão cobrados os honorários ajustados tampouco os gastos operacionais adiantados pelo <u>contratado.</u></b>
            <br><br>
            <u>Parágrafo quarto:</u> No caso de procedência parcial ou total da demanda, e ou acordo judicial/extrajudicial, serão cobrados, honorários de sucumbência e os gastos operacionais adiantados pelos <b>contratados.</b>
            <br><br>
            <u>Parágrafo quinto:</u> Em caso de acordo e ou parcelamento da execução, onde a indenização auferida na ação proposta seja paga de forma parcelada, os honorários dispostos nesta cláusula serão pagos de início, abatendo-se das parcelas até sua completa totalidade, incluindo os honorários de sucumbência e somente após dar-se-á início ao pagamento dos créditos ao <b><u>contratante.</u></b>
            <br><br>
            <u>Cláusula 03ª:</u> No caso de não reconhecimento dos direitos questionados nesta reclamação patrocinada pelos <b>contratados,</b> se dá por ciente o <b>contratante</b> que todos os débitos arbitrados pelo <b>juízo,</b> sejam eles: custas processuais, honorários advocatícios do(s) advogado(s) <b>ex adverso, eventual condenação por litigância de má fé e demais débitos,</b> serão suportadas pelo <b>contratante,</b> ficando assim isento o <b>contratado</b> qualquer responsabilidade sobre os mesmos.
            <br><br>
            <u>Cláusula 04ª:</u> Fica o <b>contratante</b> ciente de que é de sua responsabilidade manter seus dados cadastrais, tais quais: <b>endereço, telefone para contato e-mail,</b> isentando os <b>contratados</b> de eventual responsabilidade em caso da extinção da demanda por falta de localização do mesmo.
            <br><br>
            <u>Cláusula 05ª:</u> O presente contrato, irretratável quanto aos honorários desde o momento de sua assinatura, mesmo na hipótese de rescisão do contrato por parte do <b>contratante,</b> poderá, a critério dos <b>contratados,</b> ser levado aos autos da ação pertinente com o escopo de habilitação do crédito antes referido, caso haja desistência da ação ou revogação do mandato, manifestada pela contratante, esta pagará os honorários antecipadamente, e se não tiver condições fica desde já acertado que o percentual estipulado e os de sucumbência serão reservados pelo juízo a favor do advogado contratado.
            <br><br>
            <u>Cláusula 06ª:</u> As partes, de comum acordo, elegem o foro da comarca do Rio de Janeiro(capital) para dirimir quaisquer dúvidas quanto a execução do presente contrato.
            <br><br>
            <u>Cláusula 07ª:</u> Eventuais débitos decorrentes do presente contrato, não pagos pelo contratante, após regularmente instado a tanto, serão comunicados às entidades mantenedoras de bancos de dados de proteção ao crédito (SPC, SERASA, etc.) e/ou terão os títulos protestados, quer pelo locador, por seu procurador, ou por empresas de cobrança contratada, procedimento no qual o locatário tem ciência e concorda neste ato.
            <br><br>
            Assim, justos e contratados, firmam o presente instrumento em 02(duas) vias de igual teor e forma, na presença das testemunhas abaixo, produzindo, destarte, seus jurídicos e legais efeitos.

            <br><br>
  <p style="text-align: center; font-weight: bold;">
            Rio de Janeiro, __________________de __________ de 20_____.
            <br><br>
            CONTRATANTE:<br>
            ___________________________________________________________________________<br>
            CONTRATADO:<br>
            ___________________________________________________________________________ <br>
            TESTEMUNHAS: <br>
            ___________________________________________________________________________<br>
            ___________________________________________________________________________ </p>`;
    }
  }
}
