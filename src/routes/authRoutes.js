const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config()

  // user model allows us to interact with the user collection in mongo
const User = mongoose.model('User');
const List = mongoose.model('List');

const router = express.Router();

  //Must make sure no users sign up with the same username account
router.post('/signup', async(req,res)=>{
  const {username, password, queues} = req.body;
  // console.log('signup params:',username,password,queues.lists.create);
  const timeStamp = new Date().toISOString();
  try { // to create a new user entry
    const user = new User({username, password, datetimeCreated:timeStamp});
    await user.save();// async operation, sent to mongoDB
    // console.log('user:',user);
      //Create many, from queue
    const listsCreateQueue = queues.lists.create.map((item)=>{
      return {...item,userId:user._id}//add the userId to the new items
    })
    // console.log('listsCreateQueue:',listsCreateQueue);
    const docs = await List.insertMany(listsCreateQueue,{lean:true,ordered:false,rawResult:true})
    // console.log('docs created:',docs);    
      //respond with salted session token
    const token = jwt.sign({userId: user._id}, process.env.SALTKEY);
    res.send({token});
  } catch (err) { // if user is duplicate or if no username || password
    return res.status(422).send(err.message);
  };

});

  // Handle login. Use user method to compare plain-text password to hashed
  //pwd stored in db.
router.post('/signin', async(req,res)=>{
    //check the login request is valid
  const {username,password} = req.body;
  if(!username || !password){
    return res.status(422).send({error:'Must provide username and password.'});
  };
    //check the account exists
  const user = await User.findOne({username})
  if(!user) return res.status(404).send({error:'username not found.'});
    //check the password is correct
  try {
    await user.comparePassword(password);
      //if password matched, respond with a session token
    const token= jwt.sign({userId:user._id}, process.env.SALTKEY);
    return res.send({token});
  } 
  catch(err){//if password didn't match
    return res.status(422).send({error:'Invalid password or username.'});
  };
  
});

module.exports = router;