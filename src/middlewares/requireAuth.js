// middleware function that makes sure user includes a valid token in their request. 
  // if they do, we'll allow them to access a given route in our app.
  // else we'll reject the request.
  // it runs before a request handler to protect private information.
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = mongoose.model('User');
require('dotenv').config()

//Authenticate user through request token
module.exports = (req, res, next)=>{
  // return res.status(401).send({error:'You must be logged in.'});

    //token will come in request header named 'authorization'
    //express automatically turns request headers to lower-case: (Authorization -> authorization)
    //authorization == `Bearer asdlfkajsdfalksdjfas`
  const {authorization} = req.headers;
    // check authorization was provided
  if (!authorization) return res.status(401).send({error:'You must be logged in.'});
    //validate token
  const token = authorization.replace('Bearer ','');//parse token
  // console.log('token received:',token);
  jwt.verify(token, process.env.SALTKEY, async(err,payload)=>{
    if(err){
      return res.status(401).send({error:'You must be logged in.'});
    }
    const {userId} = payload; //info extracted from token
      // find the user, in the Users collection, by its Id, which we extracted from the token
    const user = await User.findById(userId);
      //attach the user data to the request object, for the next middleware to access
    req.user = user; 
    next(); // signal that the request can move on to the next middleware in the chain of middlewares
      // if no other middlewares exist, request handler runs.
  })
};