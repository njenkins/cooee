var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("data.sqlite");
//initDb();
//getRecord('http://abc.net.au/news/2016-03-14/bishop-to-hold-talks-with-iran-foreign-minister-dr-javad-zarif/7243474');

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

function getRecord(url, callback){
  db.get("SELECT * FROM data WHERE url = ?", [url], function(err, row) {
    callback(row);
  });
}

function truncateTable(){

}

function getAllRecords(){

}

module.exports = {
  initDb : initDb,
  addRecord : addRecord,
  recordExists : recordExists,
  getRecord : getRecord,
  getAllRecords : getAllRecords,
  truncateTable : truncateTable
}
