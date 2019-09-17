const express = require("express"); 
const server = express(); 
const Users = require('../Users/userModel.js');
const db = require('../Data/db_config.js');
const bcrypt = require("bcryptjs");

server.use(express.json());    
server.get('/' , (req,res) => {
    res.json({message:"Working ......"})
})

 server.get('/api/users' , isUserLoggedIn, (req, res) => {
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
         if(user && bcrypt.compareSync(password , user.password)) {
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
     const hash = bcrypt.hashSync(user.password , 12)
     user.password = hash;

     Users.add(user)
     .then(saved => {
         res.status(201).json(saved);
     })
     .catch(error => {
         res.status(500).json(error);
     })
}) 

// MiddleWares 
 
function isUserLoggedIn(req ,res, next) {
  const {username , password} = req.headers;

  if(username && password){
     Users.findBy({username})
     .first()
     .then(user => {
         if(user && bcrypt.compareSync(password , user.password)) {
           next();
         }
         else {
             res.status(401).json({message : "Invalid Cred"});
         }
     }) 
     .catch(error => {
         res.status(500).json(error);
     })
  }
  else{
      res.status(400).json({message:'Invalid Creds'});
  }
}  


module.exports = server;  