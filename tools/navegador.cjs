// Abre o Chromium do Playwright e monta a URL de um arquivo local, iguais no Linux, Mac e Windows.
// No computador: `npm i` e `npx playwright install chromium` uma vez (o `npm run checar` confere).
// Na nuvem do Claude Code o navegador já vem em /opt/pw-browsers; se a versão do Playwright do
// projeto não for a dele, usa o executável de lá.
const { chromium } = require('playwright');
const fs = require('fs');
const { pathToFileURL } = require('url');

const NUVEM = '/opt/pw-browsers/chromium';

async function abrir() {
  try {
    return await chromium.launch();
  } catch (e) {
    if (fs.existsSync(NUVEM)) return chromium.launch({ executablePath: NUVEM });
    throw e;
  }
}

const url = (arquivo, query = '') => pathToFileURL(arquivo).href + query;

module.exports = { abrir, url };
