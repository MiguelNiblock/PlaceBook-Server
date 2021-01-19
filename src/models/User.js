const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email:{
    type: String,//error if property is not string
    unique: true,//mongoose will send error message if email isn't unique
    required: true //error if property isn't provided
  },
  password:{
    type: String,
    required: true
  },
});

//Fn that salts and hashes a pwd before saving an instance
  //of a user into our db. Will generate a salt & hash the salt and plain-text password together,
  //and store actual hash in db. Known as pre-save hook, for a db schema.
  //Callback must use 'function(){}' syntax for 'this' to represent the user. 
  //Otherwise 'this' will represent 'this' in the context of the file.(Not what we want)
userSchema.pre('save', function(next){
  const user = this;//the new instance of user, being saved
  //if user hasn't modified their pwd, don't salt anything
  if(!user.isModified('password')) next();
  //else, generate salt, and hash pwd+salt
  bcrypt.genSalt(10, (err,salt)=>{ //int for how complex the salt
    if (err) return next(err);
    bcrypt.hash(user.password, salt, (err,hash)=>{
      if(err) return next(err);
      user.password = hash; // update user's password with salted & hashed password
      next(); // continue saving user
    });
  });
});

//Fn to compare login password with hashed pwd in db, for given user.
  //Passes plain-text pwd through hashing algo and compares with stored hash.
  //Must be called in a route handler fn, like: `router.post('/signin',()=>)`
    //Will be available as a method of a user object.
  //Must use 'function(){}' syntax, again, for 'this' to represent the user.
  //Fn will be called with some pwd a user is trying to log in with.
userSchema.methods.comparePassword = function(candidatePwd){
  const user = this;//user trying to sign in
  return new Promise((resolve,reject)=>{
    bcrypt.compare(candidatePwd, user.password, (err,isMatch)=>{
      if(err) return reject(err);
      if(!isMatch) return reject(false);
      resolve(true);
    });
  })
};

mongoose.model('User', userSchema);
// we're not exporting any functions. We're simply registering the 'User' model in mongoose, which creates the 'users' collection in mongo, which will follow the 'userSchema'
//the collection will be named in lowercase, and in plural: 'User' => 'users'