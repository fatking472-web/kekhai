const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/database.sqlite');
db.run("UPDATE declarations SET userId = '44b3cb18-dd5b-4fe9-94ae-23b3a41be66e', userName = 'blackhand', userPhone = '0123456789' WHERE userId IS NULL", function(err) {
  if (err) console.error(err);
  else console.log(`Updated ${this.changes} rows.`);
});
