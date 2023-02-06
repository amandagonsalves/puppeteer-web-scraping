#!/usr/bin/env zx

import puppeteer from 'puppeteer';

const name = "constituicao-98";
const url = 'https://legislacao.presidencia.gov.br/atos/?tipo=CON&numero=&ano=1988&ato=b79QTWE1EeFpWTb1a';

const scrape = async () => { 
  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto(url);
    await page.setViewport({ width: 1080, height: 1024 });
    await page.waitForSelector('.list-group');


    const group = await page.evaluate(() => Array.from(document.querySelectorAll('.list-group > .list-group-item'), (element) => {
      const text = element.textContent;

      return text.replace(/\n/g, '').replace(/\t/g, '').replace(/^\s+|\s+$|\s+(?=\s)/g, '');
    }));

    const result = {};

    for (const item of group) {
      const capitalizedRegex = /\b[A-Z:A-Z-0-9]+\b/g;

      if (capitalizedRegex.test(item)) {
        const [key, value] = item.split(/: (.*)/s);

        result[key] = value;
      }
    }

    await fs.remove(`dist/pages/${name}`);
    await fs.outputFile(`dist/pages/${name}.json`, JSON.stringify(result, null, 2));

    await browser.close();
  } catch (error) {
    throw new Error(error);
  }
};

scrape();