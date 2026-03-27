const puppeteer = require('puppeteer');

async function run() {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log("Visitando graficos...");
  await page.goto('http://localhost:3000/graficos', { waitUntil: 'domcontentloaded' });

  console.log("Aguardando 65 segundos para acumular dados dos gráficos (Candlestick)...");
  await new Promise(r => setTimeout(r, 65000));

  await page.evaluate(() => document.documentElement.className = '');
  await page.screenshot({ path: `capture_graficos_light.png`, fullPage: true });

  await browser.close();
  console.log("Screenshot atualizado!");
}
run().catch(console.error);
