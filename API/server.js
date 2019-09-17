const express = require("express"); 
const server = express(); 
const Users = require('../Users/userModel.js');
const bcrypt = require("bcryptjs");
const session = require('express-session'); 
const db = require('../Data/db_config.js');
const knexsession = require('connect-session-knex')

server.use(express.json());    
server.use(session(sessionConfig));  
const sessionConfig = {
  name : "HelloSession" ,
  secret : "word" ,
  cookie : {
      maxAge :  1000 * 20 , 
      secure :  false ,
      httpOnly : true,
  } , 
  resave : false , 
  saveUnitialized : true , 
  store: new knexsession({
      Knex : db ,
      tablename : "knexsession" ,
      sidfieldname :"sessionid" ,
      createtable: true,
      clearInterval: 1000 * 20
  })
};
server.get('/' , (req,res) => {
    res.json({message:"Working ......"})
})

 server.get('/api/users' , isUserLoggedIn, (req, res) => {
    Users.find() 
    .then(users => { 
        res.json(users)
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

server.get('/logout' , (req,res) => {
    if(req.session){
        req.session.destroy(err => {
            if(err){
                res.json(err);
            }
            else {
                res.json({message : "ERROR"})
            }
        })
    } 
    else {
        res.json({message : ""})
    }
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