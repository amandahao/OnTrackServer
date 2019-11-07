const fs = require('fs');

exports.dbUri = process.env.ATLAS_URI || fs.readFileSync("db.txt", "utf8");
