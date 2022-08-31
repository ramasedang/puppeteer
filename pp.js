const pptr = require('puppeteer');


const pp = {
    browser: null,
    page: null,

    init : async () => {
        pp.browser = await pptr.launch({headless: false});
        pp.page = await pp.browser.newPage();
        pp.page.setUserAgent(
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36'
        );
    },

    start : async () => {
        const link = "https://www.olx.co.id/"
        await pp.page.goto(link, {waitUntil: 'networkidle2'});
    },

    scapre : async () => {
        // const product = await pp.page.$$('EIR5N');
        const data = await pp.page.$$eval('.ul li',elements => elements.map(item => item.textContent));
        console.log(data);
  
    }
}

module.exports = pp;