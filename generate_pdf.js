const puppeteer = require('puppeteer');
const fs = require('fs');
const highlight = require('highlight.js');

async function captureScreenshots(page) {
  const routes = [
    { name: 'dashboard', path: '/' },
    { name: 'analise', path: '/analise' },
    { name: 'graficos', path: '/graficos' },
    { name: 'economia', path: '/economia' }
  ];

  for (const route of routes) {
    const url = `http://localhost:3000${route.path}`;
    console.log(`Visitando: ${url}`);
    
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // Esperar um pouco para animações
    await new Promise(r => setTimeout(r, 2000));
    
    await page.evaluate(() => document.documentElement.className = '');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `capture_${route.name}_light.png`, fullPage: true });

    await page.evaluate(() => document.documentElement.className = 'dark');
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `capture_${route.name}_dark.png`, fullPage: true });
  }
}

function getHighlightedCode(filePath) {
  const code = fs.readFileSync(filePath, 'utf-8');
  // split into parts if too long to avoid going over page boundaries without breaks
  return highlight.highlightAuto(code).value;
}

function formatCodeBlocks(codeHTML, title) {
  // Break into chunks of 30 lines maximum
  const lines = codeHTML.split('\n');
  const chunkSize = 35;
  let html = '';
  
  for(let i = 0; i < lines.length; i+= chunkSize) {
    const chunk = lines.slice(i, i + chunkSize).join('\n');
    html += `
      <div class="page text-left">
        <h3 class="code-title">Trecho de Código - ${title} (Parte ${Math.floor(i/chunkSize) + 1})</h3>
        <pre><code class="hljs">${chunk}</code></pre>
      </div>
    `;
  }
  return html;
}

async function generatePDF() {
  console.log('Iniciando o navegador para capturar telas...');
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  // await captureScreenshots(page);
  
  console.log('Telas capturadas. Gerando o documento HTML...');
  
  const css = `
    body { font-family: 'Arial', sans-serif; font-size: 14pt; line-height: 1.6; color: #333; margin: 0; padding: 0; }
    .cover { display: flex; flex-direction: column; justify-content: center; align-items: center; height: 100vh; text-align: center; }
    .cover h1 { margin-bottom: 50px; }
    .cover .authors { margin-top: 50px; font-size: 16pt; }
    .page { page-break-after: always; padding: 40px; }
    h1, h2, h3 { color: #2c3e50; }
    p { text-align: justify; margin-bottom: 20px; }
    img { max-width: 100%; height: auto; display: block; margin: 20px auto; border: 1px solid #ddd; box-shadow: 0 4px 8px rgba(0,0,0,0.1); }
    pre { background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 8px; padding: 20px; overflow-x: auto; font-size: 10pt; page-break-inside: avoid; }
    .code-title { font-size: 14pt; margin-bottom: 10px; font-family: monospace; color: #e83e8c; }
    .text-center { text-align: center; }
    .text-left { text-align: left; }
    ul { margin-bottom: 20px; }
    li { margin-bottom: 10px; }
    ${fs.readFileSync('node_modules/highlight.js/styles/github.css', 'utf-8')}
  `;

  // Read code snippets
  const layoutCode = formatCodeBlocks(getHighlightedCode('src/app/layout.tsx'), 'Root Layout (src/app/layout.tsx)');
  const pageCode = formatCodeBlocks(getHighlightedCode('src/app/page.tsx'), 'Dashboard Principal (src/app/page.tsx)');
  const sidebarCode = formatCodeBlocks(getHighlightedCode('src/components/Sidebar.tsx'), 'Sidebar (src/components/Sidebar.tsx)');
  const mathCode = formatCodeBlocks(getHighlightedCode('src/utils/financialMath.ts'), 'Algoritmos Nativos (src/utils/financialMath.ts)');
  const analiseCode = formatCodeBlocks(getHighlightedCode('src/app/analise/page.tsx'), 'Análise Financeira (src/app/analise/page.tsx)');
  const graficosCode = formatCodeBlocks(getHighlightedCode('src/app/graficos/page.tsx'), 'Gráficos Avançados (src/app/graficos/page.tsx)');
  const economiaCode = formatCodeBlocks(getHighlightedCode('src/app/economia/page.tsx'), 'Cenário Econômico (src/app/economia/page.tsx)');
  
  const imgDashboardL = `data:image/png;base64,${fs.readFileSync('capture_dashboard_light.png', 'base64')}`;
  const imgDashboardD = `data:image/png;base64,${fs.readFileSync('capture_dashboard_dark.png', 'base64')}`;
  const imgAnaliseL = `data:image/png;base64,${fs.readFileSync('capture_analise_light.png', 'base64')}`;
  const imgAnaliseD = `data:image/png;base64,${fs.readFileSync('capture_analise_dark.png', 'base64')}`;
  const imgGraficosL = `data:image/png;base64,${fs.readFileSync('capture_graficos_light.png', 'base64')}`;
  const imgGraficosD = `data:image/png;base64,${fs.readFileSync('capture_graficos_dark.png', 'base64')}`;
  const imgEconomiaL = `data:image/png;base64,${fs.readFileSync('capture_economia_light.png', 'base64')}`;
  const imgEconomiaD = `data:image/png;base64,${fs.readFileSync('capture_economia_dark.png', 'base64')}`;

  const html = `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <style>${css}</style>
    </head>
    <body>
      <div class="page cover">
        <h1>COTAÇÕES DE CÂMBIO EM TEMPO REAL<br>(ARQUITETURA MODERNA COM NEXT.JS)</h1>
        <div class="authors">
          <p>Autores: Cauã Azevedo Lincoln<br>Heitor Israel Vieira de Andrade</p>
          <p>Professora e orientadora: Ingrid Batista Conceição</p>
          <p style="margin-top: 100px; font-size: 14pt;">Universidade Santo Amaro (UNISA)</p>
          <p>2026</p>
        </div>
      </div>

      <div class="page">
        <h2>RESUMO</h2>
        <p>Este documento apresenta a reformulação estrutural e migração arquitetural de uma aplicação web destinada à visualização em tempo real das cotações de câmbio do dólar e do iene. Diferente da implementação originada em Javascript Vanilla, Html5 e Css3, este novo modelo abraça as tecnologias mais recentes do mercado, destacando o Next.js (com App Router), TypeScript para tipagem forte, Zustand para gestão global de estado e Tailwind CSS para estilizações refinadas e sofisticadas em níveis de produção comercial.</p>
        <p>A aplicação fornece não somente o panorama constante e síncrono da flutuação destas moedas através de Polling seguro em substituição aos Web Workers, como estende profundamente a capacidade analítica da ferramenta, inserindo dashboards de análises probabilísticas e matemáticas nativas (Ema, Sma e Rsi), renderizações aglomeradas em Velas Japonesas (Candlesticks OHLC) e balanços interativos macroeconômicos.</p>
        <p>A principal contribuição da versão 2.0.0 (codinome <i>Modernity</i>) reside em comprovar como a infraestrutura de componentes React bem lapidados eleva exponencialmente a capacidade semântica, o manutenimento de código, a compatibilidade e a experiência fluida ao usuário final, alçando o projeto à maturidade enterprise.</p>
        <p><b>Palavras-chave:</b> Next.js. TypeScript. Tailwind CSS. Cotações. Algoritmos. Dashboard.</p>
      </div>

      <div class="page">
        <h2>INTRODUÇÃO</h2>
        <p>A constante transformação do mercado financeiro impõe a demanda incessante por acompanhamentos detalhados, imediatos e tecnicamente embasados sobre as flutuações nas moedas estrangeiras. Enquanto as versões preliminares da aplicação de cotações supriam as bases deste monitoramento, a escalabilidade monolítica tornou-se um entrave tecnológico, revelando que a refatoração para frameworks componentizados e reativos como React / Next.js era imperativa para assegurar sua competitividade.</p>
        <p>A interface bancária em sua nova estrutura busca não apenas monitorar as variações cambiais de forma visual, mas sim aprofundar esse escopo gerando algoritmos matemáticos e econômicos puros. Desta forma, foi priorizado um ambiente estrito, sem APIs de terceiros cuidando de matemática, priorizando TypeScript nativo no Node e no Client Component.</p>
        <p>Mais do que funcionalidade, o design e a experiência do usuário receberam a devida complexidade requerida por sistemas monetários mundiais. Micro-animos, transições assíncronas de rotas, Dark e Light Mode dinâmicos sem travamentos visuais, e hierarquia puramente responsiva validam o Next.js App Router como o pináculo moderno para interfaces amigáveis e de fácil consumo.</p>
      </div>

      <div class="page">
        <h2>OBJETIVOS DA REFATORAÇÃO</h2>
        <ul>
          <li><b>Migração de Framework:</b> Transferir integralmente a aplicação Web Workers para hooks funcionais otimizados (uso de <code>useEffect</code>) com o robusto <code>Next.js 16+</code>.</li>
          <li><b>Defesa de Tipagem:</b> Mapear todas as requisições API (AwesomeAPI) e transições numéricas de cotações asseguradas pelo contrato do TypeScript (<code>interfaces</code> e asserções visuais estritas).</li>
          <li><b>Styling Dinâmico Avançado:</b> Reposicionar as lógicas manuais do CSS3 clássico com a utilidade engenhosa do <code>Tailwind CSS v4</code> em conjunto aos temas nativos gerenciados por <code>next-themes</code>.</li>
          <li><b>Capilaridade Algoritmica Embutida:</b> Adicionar funcionalidades de avaliação do Índice de Força Relativa (RSI), Médias Móveis Complexas (EMA/SMA) calculadas totalmente no Client browser e agrupadores temporais formatados para <i>Candlesticks</i> (OHLC).</li>
          <li><b>Gestão de Estado Universal:</b> Disparar e registrar o histórico da variação em apenas uma camada global isolada, provida de alta performance computacional através do <code>Zustand</code>.</li>
        </ul>
      </div>

      <div class="page">
        <h2>ARQUITETURA & TECNOLOGIAS DA VERSÃO 2.0</h2>
        <p>O desenvolvimento da segunda fase se baseou primariamente nos alicerces da "Reactividade" base do <b>React JS</b> potencializado com o servidor/client híbrido <b>Next.js App Router</b>.</p>
        <h3>1. Gerenciamento Global</h3>
        <p>A migração dos antigos Workers revelou a carência de um cofre sólido unificado. O Zustand adentrou o projeto gerindo centralizadamente o store <code>useCurrencyStore</code>, contendo um state de Histórico de Dólar e Iene livre de repetições não intencionais na linha do tempo. Todos os componentes isolados, do Dashboard aos Gráficos, ouvem sem degradação do render engine este store minificado e leve.</p>
        <h3>2. Abstração de Rotas com App Router</h3>
        <p>Ao invés de manipular o DOM exaustivamente sob um único arquivo 'index.html', o Next.js entrega rotas orientadas a pastas físicas do código na subpasta <code>src/app/</code>. Desse modo foram criadas a principal (/), <i>/analise</i>, <i>/economia</i> e <i>/graficos</i>, partilhando harmonicamente um layout mestre com Sidebar global fixa e estado inter-rotas mantido transparente usando Zustand.</p>
        <h3>3. Sistema de Estilos e Theming Híbrido</h3>
        <p>A customização e pintura em tela que antigamente custavam blocos repetitivos CSS, hoje estão sintetizados e imbuídos sob demanda no 'Tailwind'. Mais que isso, o Dark mode foi abraçado de corpo e alma aplicando as condicionantes do Tailwind 'dark:' somado a inserção universal manipulada na tag raiz por um Custom Hook acionado pelo provider <code>next-themes</code>.</p>
      </div>

      <div class="page">
        <h2 class="text-center">VISUALIZAÇÃO COMPLETA: DÚPLA JORNADA (LIGHT E DARK MODE)</h2>
        <p>Abaixo, capturamos os prints imersivos da nova aplicação navegando perfeitamente pelas rotas reformuladas.</p>
        <h3>Tela Inicial - Dashboard V2 (Light Mode)</h3>
        <img src="${imgDashboardL}" alt="Dashboard Variante Branca">
      </div>

      <div class="page">
        <h3>Tela Inicial - Dashboard V2 (Dark Mode)</h3>
        <img src="${imgDashboardD}" alt="Dashboard Variante Escura">
        <p>Podemos observar que o gráfico agora utiliza Recharts, respondendo perfeitamente ao tema e os cantos chanfrados garantem modernidade e hierarquia aos dados isolados de moedas em destaque.</p>
      </div>

      <div class="page">
        <h3>Análise Financeira (Light Mode)</h3>
        <img src="${imgAnaliseL}" alt="Análise Financeira Variante Branca">
        <p>Nesta área são processadas lógicas analíticas sobre indicadores técnicos, extraindo puramente dos ticks providos pela AwesomeAPI armazenados no Zustand e operados pelo core <code>financialMath.ts</code>.</p>
      </div>

      <div class="page">
        <h3>Análise Financeira (Dark Mode)</h3>
        <img src="${imgAnaliseD}" alt="Análise Financeira Variante Escura">
      </div>

      <div class="page">
        <h3>Gráficos Avançados - Velas Japonesas (Light Mode)</h3>
        <img src="${imgGraficosL}" alt="Candlesticks Light Mode">
        <p>Agrupamento OHLC validado a cada fechamento de minuto temporal, renderizado pelas camadas pesadas da biblioteca 'ApexCharts' encapsulada de forma assíncrona para anular crashes no Server Side Rendering.</p>
      </div>

      <div class="page">
        <h3>Gráficos Avançados - Velas Japonesas (Dark Mode)</h3>
        <img src="${imgGraficosD}" alt="Candlesticks Dark Mode">
      </div>

      <div class="page">
        <h3>Cenário Macroeconômico Compartivo (Light Mode)</h3>
        <img src="${imgEconomiaL}" alt="Macroeconomia Light Mode">
        <p>Uma UI avançada lidando graciosamente com barras de progresso cruzadas que evidenciam matematicamente quem dos eixos Unidos e Japão dominam as facetas Econômicas estáticas no contexto histórico de juros, inflação e PIB.</p>
      </div>

      <div class="page">
        <h3>Cenário Macroeconômico Compartivo (Dark Mode)</h3>
        <img src="${imgEconomiaD}" alt="Macroeconomia Dark Mode">
      </div>

      <div class="page">
        <h2 class="text-center">ANÁLISE DE ESTRUTURAS FONTES E ARQUITETURA NO CÓDIGO</h2>
        <p>Nas próximas páginas apresentamos as minúcias e a fundação lógica purista convertida para TypeScript estrito que compõem o esqueleto robusto de todos os front-ends e interfaces vistas até então.</p>
      </div>

      <!-- INCORPORANDO O CÓDIGO COM DESTAQUES NAS PÁGINAS -->
      ${layoutCode}
      ${sidebarCode}
      ${pageCode}
      ${mathCode}
      ${analiseCode}
      ${graficosCode}
      ${economiaCode}

      <div class="page">
        <h2>COMPORTAMENTO EM MATEMÁTICA PURA CLIENT-SIDE (NATIVE TS)</h2>
        <p>No trecho referente de <b>Algoritmos Nativos</b> (exposto páginas atrás), o RSI (Índice de Força Relativa) computado iterativamente avalia todos os <i>spreads</i> de venda armazenados sequencialmente a cada pulso do loop de polling (5000ms). Calculando o Módulo Absoluto das flutuações e extraindo o Peso Simples e Ponderado (EMA), o motor deduz localmente sem onerar as requisições, se a janela da moeda subjacente encontra-se mergulhada em 'Sobrecompra' e 'Sobrevenda'.</p>
        <p>Outra façanha que solidificou o patamar sênior do processo foi a injeção funcional do OHLC. Através do método <code>Array.reduce()</code> e do mapeamento <code>Regex</code> das datas vindas do timestamp da API, as cotações individuais por <i>Tick</i> recebem tratamento transmutador por minuto fechado, determinando matematicamente o Opening Price e Closening Price, junto do Peak e Trough daquele frame específico.</p>
      </div>

      <div class="page">
        <h2>CONSIDERAÇÕES FINAIS</h2>
        <p>Este trabalho e subsequente atualização iterou não de maneira incremental, porém absoluta: refatorando e redesenhando do Zero fundamental uma plataforma acadêmica de HTML limado, erguendo um castelo robusto em React Next JS escalável.</p>
        <p>O objetivo principal de estabelecer fluidez nas requisições sem os conhecidos gargalos da 'The Main Thread' foi sobre-suplantado pelo ganho extra da utilização arquitetada do Context API disfarçado no Store flexível e imaculado ofertado pela solução nativa do 'Zustand'.</p>
        <p>No final, restou atestado que não bastam cálculos formidáveis. O envelopamento da Experiência do Usuário atracada pelo Tailwind CSS na orquestração harmônica das interfaces provou ser um alicerce tão vital quanto as transações assíncronas em si, propiciando e entregando o projeto para o horizonte <i>Enterprise</i> moderno.</p>
      </div>

      <div class="page">
        <h2>REFERÊNCIAS</h2>
        <ul>
          <li>Next.js Documentation. The React Framework for the Web. Disponível em: https://nextjs.org. Acesso em 2026.</li>
          <li>TypeScript Handbook. Typed JavaScript at Any Scale. Disponível em: https://www.typescriptlang.org/docs. Acesso em 2026.</li>
          <li>Zustand. Bear necessities for state management in React. Disponível em: https://zustand-demo.pmnd.rs/. Acesso em 2026.</li>
          <li>AwesomeAPI. API de Cotações de Moedas. Disponível em: https://docs.awesomeapi.com.br/api-de-moedas. Acesso em 2026.</li>
          <li>Tailwind CSS. Rapidly build modern websites without ever leaving your HTML. Disponível em: https://tailwindcss.com/. Acesso em 2026.</li>
        </ul>
      </div>

    </body>
    </html>
  `;

  console.log('Conversão HTML montada, processando PDF final...');
  const finalPdfPath = 'C:\\\\Users\\\\caua.lincoln\\\\Downloads\\\\Projeto-Integrador-main\\\\Projeto_Integrador_Refatorado_V2.pdf';
  
  await page.setContent(html);
  await page.pdf({
    path: finalPdfPath,
    format: 'A4',
    margin: { top: '2cm', bottom: '2cm', left: '2cm', right: '2cm' },
    printBackground: true
  });

  console.log('PDF gerado com sucesso em: ' + finalPdfPath);
  await browser.close();
}

generatePDF().catch(console.error);
