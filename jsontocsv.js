const {Parser} = require("json2csv");
const fs = require("fs");
const jason = require("./datatest.json");


const jsontocsv = {
    convert : async () => {
        const parser = new Parser();
        const csv = parser.parse(jason);
        fs.writeFileSync("datatest.csv", csv);
    }

    
}

module.exports = jsontocsv;