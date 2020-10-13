const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');

module.exports = (req, res, next)=>{
  const {authorization} = req.headers;
  //check request is valid
  if (!authorization) return res.status(401).send({error:'You must be logged in.'});
  //check the token is valid
  const token = authorization.replace('Bearer ','');
  jwt.verify(token,'SALTKEY',async(err,payload)=>{
    if(err){
      return res.status(401).send({error:'You must be logged in.'});
    }
    const {userId} = payload;
    // find the user, in the Users collection, by its Id, which we extracted from the token
    const user = await User.findById(userId);
    req.user = user;
    next();
  })
};