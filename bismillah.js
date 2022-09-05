const axios = require("axios");
const {Parser} = require("json2csv");
const fs = require("fs");

async function doGetRequest() {
  let res = await axios.get(
    "https://www.banpt.or.id/direktori/model/dir_prodi/get_hasil_pencariannew.php"
  );
  let data = res.data.data;
  const parser = new Parser();
  const csv = parser.parse(data);
  fs.writeFileSync("datatest.csv", csv);
}

doGetRequest();
