const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto('https://site-que-você-quer-clonar');

    await page.waitForSelector('body');

    const htmlContent = await page.content();

    const htmlFilePath = path.join(__dirname, 'pasta-do-site', 'index.html');
    fs.writeFileSync(htmlFilePath, htmlContent);
    console.log('HTML salvo com sucesso em:', htmlFilePath);

    const cssLinks = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
        return links.map(link => link.href);
    });

    for (let cssLink of cssLinks) {
        const response = await page.goto(cssLink);
        const cssContent = await response.text();
        const cssFileName = cssLink.split('/').pop();
        const cssFilePath = path.join(__dirname, 'pasta-do-site', cssFileName);
        fs.writeFileSync(cssFilePath, cssContent);
        console.log('CSS salvo com sucesso em:', cssFilePath);
    }

    await browser.close();
})();
