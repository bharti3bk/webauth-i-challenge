const express = require("express"); 
const server = express(); 
const Users = require('../Users/userModel.js');
const db = require('../Data/db_config.js');

server.use(express.json());    
server.get('/' , (req,res) => {
    res.json({message:"Working ......"})
})

 server.get('/api/users' , (req, res) => {
    Users.find()
    .then(users => {
        res.json(users);
    })
    .catch(error => {
        res.send(error);
    })
 })  

 server.post('/api/login' , (req,res) => { 
     const {username , password} = req.body;
     Users.findBy({username})
     .first()
     .then(user => {
         if(user) {
             res.status(200).json({message : `${user.username}`});
         }
         else {
             res.status(401).json({message : "Invalid Cred"});
         }
     }) 
     .catch(error => {
         res.status(500).json(error);
     })

 }) 
 server.post('/api/register' , (req,res) => { 
     const user = req.body;

     Users.add(user)
     .then(saved => {
         res.status(201).json(saved);
     })
     .catch(error => {
         res.status(500).json(error);
     })
})
module.exports = server;  