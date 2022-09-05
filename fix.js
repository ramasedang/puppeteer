const puppeteer = require('puppeteer');

const html = `
<html>
    <body>
    <table>
      <tr id="TR_99999997" style="background-color: rgb(255, 255, 255);">
        <td id="TD_TEXT_XXXXX" style="cursor: pointer;" onclick="selectEnvironnement('99999997',1)">test1</td>
      </tr>    
      <tr id="TR_99999998" style="background-color: rgb(255, 255, 255);">
        <td id="TD_TEXT_XXXXX" style="cursor: pointer;" onclick="selectEnvironnement('99999998',2)">test2</td>
      </tr>    
      <tr id="TR_99999999" style="background-color: rgb(255, 255, 255);">
        <td id="TD_TEXT_XXXXX" style="cursor: pointer;" onclick="selectEnvironnement('99999999',3)">test3</td>
      </tr>    
    </table>
    <script>
      function selectEnvironnement(p1, p2) {
        console.log(p1, p2);
      };
    </script>
  </body>
</html>`;

(async () => {
  const browser = await puppeteer.launch({ headless : false});
  const page = await browser.newPage();
  await page.goto(`data:text/html,${html}`);

  await page.waitForTimeout(3000);
  var tdList = await page.$$('table td[id^="TD_TEXT_"]', e => e.map((btn) => btn));
  console.log(tdList);
  await tdList[0].click();
  await tdList[1].click();
  await tdList[2].click();
  await page.waitForTimeout(20000);

  await browser.close();
})();
