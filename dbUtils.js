var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("data.sqlite");
initDb();

function initDb(callback){
  db.serialize(function() {
  		db.run("CREATE TABLE IF NOT EXISTS data (url TEXT, articleContent TEXT)");
      if(callback){
        callback(db);
      }
  	});
}

function addRecord(values){
  // Insert some data.
  	var statement = db.prepare("INSERT INTO data(url, articleContent) VALUES (?, ?)");
  	statement.run(values);
  	statement.finalize();
}

function recordExists(){

}

function getRecord(){

}

function truncateTable(){

}

module.exports = {
  initDb : initDb,
  addRecord : addRecord,
  recordExists : recordExists,
  getRecord : getRecord,
  truncateTable : truncateTable
}
