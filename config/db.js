const mysql = require('mysql2');  
require('dotenv').config();

const connection = mysql.createConnection({
    host: process.env.DB_HOST,    
    port: process.env.PORT,            
    database: process.env.DB_NAME,     
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD
});

connection.connect(function(err) {  
  if (err) throw err;  
  console.log("Server Connected!");
});  

module.exports = connection