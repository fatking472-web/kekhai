const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('data/database.sqlite');
db.all('SELECT * FROM users', (err, users) => {
  db.all('SELECT userId, portraitUrl, frontDocUrl, backDocUrl FROM declarations ORDER BY createdAt DESC', (err, decls) => {
    const mappedUsers = users.map(u => {
      const safeU = { ...u };
      delete safeU.password;
      const userDecl = decls.find(d => d.userId === u.id);
      if (userDecl) {
        safeU.attachments = { portrait: userDecl.portraitUrl, frontDoc: userDecl.frontDocUrl, backDoc: userDecl.backDocUrl };
      }
      return safeU;
    });
    console.log(JSON.stringify(mappedUsers, null, 2));
  });
});
