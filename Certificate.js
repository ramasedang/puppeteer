const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");
const sertifikasi = [];

(async () => {
  let res = await axios.get("https://www.its.ac.id/kpm/certification/");
  let data = res.data;
  const $ = cheerio.load(data);
  const elementSelector = "#tablepress-8 > tbody > tr";
  const elementSelectorlink = "#tablepress-8 > tbody > tr > td > i > a";

  const keys = ["no", "faculty", "program", "link", "validity"];
  $(elementSelector).each((index, element) => {
    const obj = {};
    let keyIndex = 0;
    let keyIndex2 = 3;

    $(element)
      .children()
      .each((childX, childEl) => {
        const data = $(childEl).text();
        obj[keys[keyIndex]] = data;
        if (keyIndex === 3) {
          const link = $(elementSelectorlink).attr("href");
          obj[keys[keyIndex2]] = link;
        }
        keyIndex++;
      });
    sertifikasi.push(obj);

    $(element)
      .children()
      .each((childX, childEl) => {
        const data = $(childEl).find("a").attr("href");
        // console.log(data);
        // obj[keys[3]] = data;
      });
    sertifikasi.push(obj);
  });

  // $(elementSelectorlink).each((index, element) => {
  //   const obj = {};
  //   let keyIndex2 = 0;
  //   $(element).each((childX, childEl) => {
  //     const data = $(childEl).attr("href");
  //     obj[keys[3]] = data;

  //      sertifikasi.push(obj);
  //   });
  //   // sertifikasi.push({link: data});
  // })

  console.log(sertifikasi);
  fs.writeFileSync("sertifikasi.json", JSON.stringify(sertifikasi));
})();
