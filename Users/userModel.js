const db = require('../Data/db_config.js');
const express = require("express"); 
const server = express();

server.use(express.json());  
module.exports  = {
 find
}; 

function find() {
    return db('users');
  }
