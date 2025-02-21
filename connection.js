let mySql = require("mysql");

let conn = mySql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "expense-tracker"
});

module.exports=conn;