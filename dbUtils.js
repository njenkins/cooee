var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database("data.sqlite");

function initDb(){

}

function addRecord(){

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
