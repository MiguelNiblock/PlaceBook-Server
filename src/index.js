// mongoose model must be defined only once
// to use the model elsewhere, import mongoose, not the User model itself
require('./models/User')
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(bodyParser.json());
app.use(authRoutes);

const mongoUri = 'mongodb+srv://admin:password1.1.@cluster0.ujve1.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(mongoUri,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
mongoose.connection.on('connected',()=>console.log('Connected to mongo instance'));
mongoose.connection.on('error',(err)=>console.error('Error connecting to mongo',err));

app.get('/',requireAuth,(req,res)=>{
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000,()=>console.log('listening on 3000'));