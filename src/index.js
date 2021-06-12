// Mongoose model must be defined only once, so not necessary to name it.
// To use the model elsewhere, import mongoose, not the User model itself.
// If you imported a model again elsewhere, you'd be creating another collection
require('./models/User');
require('./models/List');
require('./models/Location');
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoutes');
const listRoutes = require('./routes/listRoutes');
const locationRoutes = require('./routes/locationRoutes');
const requireAuth = require('./middlewares/requireAuth');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config()

const app = express();
app.use(bodyParser.json()); //allows the ability to read request's body
// becomes available in the req.body of a request
app.use(authRoutes); //associates route handler with app
app.use(listRoutes);
app.use(locationRoutes);
app.use(userRoutes);
// app.use(trackRoutes); //requests are handled by trackRoutes
// URI provided by mongodb instance from atlas
const mongoUri = process.env.mongoUri

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

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port,()=>console.log('listening on port '+port));