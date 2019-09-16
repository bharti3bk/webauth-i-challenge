const express = require("express"); 
const server = express();

server.use(express.json());    
server.get('/' , (req,res) => {
    res.json({message:"Working ......"})
})

// server.get('/api/users' , (req, res) => {
  
// })  

// server.post('/api/login' , (req,res) => {

// }) 

// server.post('/api/register' , (req,res) => {

// })
module.exports = server;  