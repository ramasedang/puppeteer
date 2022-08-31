const s = require('puppeteer');
const link = ("https://www.olx.co.id/");

(async () => {
    const browser = await s.launch({headless: false});
    const page = await browser.newPage();
    await page.goto(link, {waitUntil: 'networkidle2'});
    const datas = await page.$$('.EIR5N');
    for (const data of datas) {
        try {
            const url = await data.$eval('a', element => element.getAttribute('href'));
            const fixURL = "https://www.olx.co.id/" + url
            console.log(fixURL);
        } catch (error) {
            console.log(error);
        }
    }
    console.log();
    await browser.close();
})();