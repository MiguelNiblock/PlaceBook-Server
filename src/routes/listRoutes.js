const express = require('express');
const mongoose = require('mongoose');
// Route must be protected with authorization
const requireAuth = require('../middlewares/requireAuth');
const List = mongoose.model('List');

const router = express.Router();

// Ensure all request handlers attached to this router require the user to be signed in.
  // It attaches user obj to req, if authenticated
router.use(requireAuth);

//Save a new instance of model for a given user
router.post('/lists', async(req,res)=>{
  const {name, color, icon} = req.body
  if (!name) {
    return res.status(422).send({error:'You must provide a list name'});
  }
  try { //userId obtained from req.user, thanks to requireAuth middleware
    const datetimeCreated = 10000;
    const datetimeModified = 10000;
    const list = new List({name, color, icon, userId: req.user._id, datetimeCreated, datetimeModified});
    console.log('list:',list)
    await list.save();
    res.send(list); //return the instance created
  } catch (err) {return res.status(422).send({error:err.message})}
});

//Fetch all instances a user has ever created
router.get('/lists', async(req, res)=>{
  const lists = await List.find({userId: req.user._id})
  res.send(lists);
});

module.exports = router;