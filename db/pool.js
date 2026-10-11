const { Pool } = require("pg");

module.exports = new Pool({
  host: "localhost",
  user: "inaladevi",       
  database: "top_users",  
  password: "",           
  port: 5432             
});
