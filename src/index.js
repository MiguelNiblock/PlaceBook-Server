// mongoose model must be defined only once, so not necessary to name it
// to use the model elsewhere, import mongoose, not the User model itself
// if you imported a model again elsewhere, you'd be creating another collection
require('./models/User');
require('./models/Track');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const trackRoutes = require('./routes/trackRoutes');
const requireAuth = require('./middlewares/requireAuth');

const app = express();
app.use(bodyParser.json()); //allows the ability to read request's body
// becomes available in the req.body of a request
app.use(authRoutes); //associates route handler with app
app.use(trackRoutes); //requests are handled by trackRoutes
// URI provided by mongodb instance from atlas
const mongoUri = 'mongodb+srv://admin:password1.1.@cluster0.ujve1.mongodb.net/test?retryWrites=true&w=majority'

mongoose.connect(mongoUri,{
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});
// Status messages
mongoose.connection.on('connected',()=>console.log('Connected to mongo instance'));
mongoose.connection.on('error',(err)=>console.error('Error connecting to mongo',err));

// Default route, protected by authentication middleware
app.get('/', requireAuth, (req,res)=>{
  res.send(`Your email: ${req.user.email}`);
});

app.listen(3000,()=>console.log('listening on 3000'));