const s = require('puppeteer');
const link = ("https://www.olx.co.id/");

(async () => {
    const browser = await s.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(link, {waitUntil: 'networkidle2'});
    const data = await page.$$eval('.EIR5N a',elements => elements.map(item => item.getAttribute('href')));
    console.log(data);
    await browser.close();
})();