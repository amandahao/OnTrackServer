const fs = require('fs');

exports.dbUri = process.env.MONGODB_URI || fs.readFileSync("db.txt", "utf8");
