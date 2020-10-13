const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  email:{
    type: String,
    unique: true,
    required: true
  },
  password:{
    type: String,
    required: true
  },
});

// must use 'function(){}' syntax for 'this' to represent the user. Otherwise 'this' will represent 'this' in the context of the file.
userSchema.pre('save',function(next){
  const user = this;
  if(!user.isModified('password')){
    next();
  }
  bcrypt.genSalt(10,(err,salt)=>{
    if (err) return next(err);
    bcrypt.hash(user.password,salt,(err,hash)=>{
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(candidatePwd){
  const user = this;
  return new Promise((resolve,reject)=>{
    bcrypt.compare(candidatePwd,user.password,(err,isMatch)=>{
      if(err)return reject(err);
      if(!isMatch) return reject(false);
      resolve(true);
    });
  })
};

mongoose.model('User',userSchema);
// we're not exporting any functions. We're simply registering the 'User' model in mongoose, which creates the 'users' collection in mongo, which will follow the 'userSchema'
//the collection will be named in lowercase, and in plural so User => users