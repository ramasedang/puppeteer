const pptr = require("puppeteer");
const axios = require("axios");
const {Parser} = require("json2csv");
const fs = require("fs");
const CSVToJSON = require("csvtojson");
const cheerio = require("cheerio");

const Sc = {
  getDataBanpt: async () => {
    const response = await axios.get(
      "https://www.banpt.or.id/direktori/model/dir_prodi/get_hasil_pencariannew.php"
    );
    const data = response.data.data;
    const parser = new Parser();
    const csv = parser.parse(data);
    // fs.writeFileSync("datatest.csv", csv);
    const users = await CSVToJSON().fromString(csv);
    const newJson = JSON.stringify(users);
    // fs.writeFileSync("datatestnew.json", newJson);
    // console.log(newJson);
    const ITS = users.filter(
      (item) => item[0] === "Institut Teknologi Sepuluh Nopember"
    );
    // const newCSV = parser.parse(users);
    // fs.writeFileSync("datatestnew.csv", newCSV);
    const newCSV = parser.parse(ITS);
    fs.writeFileSync("datatestnew.csv", newCSV);
    console.log(ITS);
  },

  getDataSertifikasi: async () => {
    const sertifikasi = [];
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
            let link = $(elementSelectorlink).attr("href");
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

    console.log(sertifikasi);
    fs.writeFileSync("sertifikasi.json", JSON.stringify(sertifikasi));
  },
};

module.exports = Sc;
