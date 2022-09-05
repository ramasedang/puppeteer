const CSVToJSON = require("csvtojson");
const {Parser} = require("json2csv");
const fs = require("fs");

CSVToJSON()
  .fromFile("datatest.csv")
  .then((users) => {
    const newJson = JSON.stringify(users);
    const fields = ["1", "2", "3", "4", "5", "6", "7", "8"];
    const opts = {fields};
    const parser = new Parser();
    const csv = parser.parse(newJson);
    fs.writeFileSync("datatestnew.csv", csv);
  })
  .catch((err) => {
    console.log(err);
  });
