const pptr = require("puppeteer");
const cheerio = require("cheerio");
const {Parser} = require("json2csv");
const fs = require("fs");
function delay(time) {
  return new Promise(function (resolve) {
    setTimeout(resolve, time);
  });
}

var kermaID = [];
var newID = [];
let index = 0;
const detailKERMA = [];

const kerma = {
  login: async () => {
    const parser = new Parser();
    const browser = await pptr.launch({headless: true});
    const page = await browser.newPage();
    await page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36"
    );
    await page.goto("https://laporankerma.kemdikbud.go.id/auth/login/");
    await page
      .waitForSelector(
        "#formLogin > div.wrap-input100.validate-input.m-b-23 > input"
      )
      .then(() => {
        page
          .click("#formLogin > div.wrap-input100.validate-input.m-b-23 > input")
          .then(() => {
            page
              .type(
                "#formLogin > div.wrap-input100.validate-input.m-b-23 > input",
                "kerma_its2016"
              )
              .then(() => {
                page
                  .type("#formLogin > div:nth-child(4) > input", "its123456")
                  .then(() => {
                    page.click(
                      "#formLogin > div.container-login100-form-btn > div > button"
                    );
                  });
              });
          });
      });

    await page.waitForSelector("td");
    await page.goto("https://laporankerma.kemdikbud.go.id/kerma/kerma").then(async ()=> {
      await page.select("#dataTable_length > label > select", "100");
    });

    await page.waitForSelector("td");

    for (let i = 0; i <= 2; i++) {
      console.log("Mengambil ID page :" + (i + 1));
      await page.select("#dataTable_length > label > select", "100");
      const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
      });

      const $ = cheerio.load(html);

      $("tbody tr button.btn-edit ").each(function (i, elem) {
        kermaID[index] = $(this).attr("onclick");
        // console.log(kermaID[index]);
        index++;
      });

      await page.click("#dataTable_next > a").then(async () => {
        await delay(11000);
      });
      
    }
    
    // console.log(kermaID);

    newID = kermaID.map((item) => {
      return item.split("'")[1];
    });

    console.log(newID);

    function creatOBJ(
      no_dokumen,
      judul_kerma,
      jenis_dokumen_kerjasama,
      dasar_dokumen_kerjasama,
      deskripsi,
      status_kerma,
      tanggal_awal,
      tanggal_akhir,
      anggaran,
      sumber_pendanaan,
      dibuat,
      diubah,
      link
    ) {
      var obj = {};
      obj.no_dokumen = no_dokumen;
      obj.judul_kerma = judul_kerma;
      obj.jenis_dokumen_kerjasama = jenis_dokumen_kerjasama;
      obj.dasar_dokumen_kerjasama = dasar_dokumen_kerjasama;
      obj.deskripsi = deskripsi;
      obj.status_kerma = status_kerma;
      obj.tanggal_awal = tanggal_awal;
      obj.tanggal_akhir = tanggal_akhir;
      obj.anggaran = anggaran;
      obj.sumber_pendanaan = sumber_pendanaan;
      obj.dibuat = dibuat;
      obj.diubah = diubah;
      obj.link = link;
      return obj;
    }

    for (n = 0; n < newID.length; n++) {
      await page
        .goto(
          "https://laporankerma.kemdikbud.go.id/kerma/kerma/form/" + newID[n]
        )
        .then(async () => {
          await page.waitForSelector(
            "#page-wrapper > div:nth-child(1) > nav > div > div > h2"
          );
        });

      const html = await page.evaluate(() => {
        return document.documentElement.innerHTML;
      });

      const $ = cheerio.load(html);

      function anggaran() {
        let anggaran;
        if ($("input#anggaran").val() == undefined) {
          anggaran = "";
        } else {
          anggaran = $("input#anggaran").val();
        }
        return anggaran;
      }

      function sumber_pendanaan() {
        let sumber_pendanaan;
        if (
          $("#select2-id_sumber_dana-container").html() ==
          '<span class="select2-selection__placeholder">Pilih sumber pendanaan</span>'
        ) {
          sumber_pendanaan = "";
        } else {
          sumber_pendanaan = $("#select2-id_sumber_dana-container").html();
        }
        return sumber_pendanaan;
      }

      function dibuat() {
        var dibuat;

       try {
        dibuat = $(
          "#kermaForm > div.col-sm-12.col-md-12.col-lg-12 > div > div > div.ibox-footer > div > div > div.pull-left"
        ).html();
        dibuat = dibuat.replace("<b>dibuat: </b>", "");
       } catch (error) {
          dibuat = "";
          console.log(error);
        
       }

        return dibuat;
      }

      function diubah() {
        var diubah;

        diubah = $(
          "#kermaForm > div.col-sm-12.col-md-12.col-lg-12 > div > div > div.ibox-footer > div > div > div.pull-right"
        ).html();
        diubah = diubah.replace("<b>terakhir diubah: </b>", "");

        return diubah;
      }

      var test = creatOBJ(
        $("#no_dokumen").val(),
        $("#judul_kerma").val(),
        $("#select2-id_jns_dok-container").attr("title"),
        "Memorandum of Understanding (MoU)",
        $("textarea#note_kerma").html(),
        $("#select2-id_stat_kerma-container").attr("title"),
        $("input#tgl_awal").val(),
        $("input#tgl_akhir").val(),
        anggaran(),
        sumber_pendanaan(),
        dibuat(),
        diubah(),
        "https://laporankerma.kemdikbud.go.id/kerma/kerma/form/" + newID[n]
      );

      detailKERMA.push(test);
      console.log("Proses ke " + n);
    }

    fs.writeFileSync("detailKERMA.json", JSON.stringify(detailKERMA));
    const csv = parser.parse(detailKERMA);
    fs.writeFileSync("detailKerma.csv", csv);

    console.log(detailKERMA);

    await browser.close();
  },
};

module.exports = kerma;
