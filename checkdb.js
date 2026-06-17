const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/database.sqlite');
db.all("SELECT * FROM declarations ORDER BY createdAt DESC LIMIT 2", (err, rows) => {
    console.log(JSON.stringify(rows, null, 2));
});
