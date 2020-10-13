const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');

// user model allows us to interact with the user collection in mongo
const User = mongoose.model('User');

const router = express.Router();

router.post('/signup',async (req,res)=>{
  const {email, password} = req.body;
  try { // create a new user entry
    const user = new User({email, password});
    await user.save();// send to mongoDB
    //responde with session token
    const token = jwt.sign({userId: user._id},'SALTKEY');
    res.send({token});
  } catch (err) { // if user already exists
    // or if there's no email || password
    return res.status(422).send(err.message);
  };

});

router.post('/signin',async(req,res)=>{
  //check the login request is valid
  const {email,password} = req.body;
  if(!email || !password){
    return res.status(422).send({error:'Must provide email and password.'});
  };
  //check the account exists
  const user = await User.findOne({email})
  if(!user)return res.status(404).send({error:'Email not found.'});
  //check the password is correct
  try {
    await user.comparePassword(password);
    //respond with session token
    const token= jwt.sign({userId:user._id},'SALTKEY');
    return res.send({token});
  } 
  catch(err){//if password didn't match
    return res.status(422).send(  {error:'Invalid password.'});
  };
  
});

module.exports = router;