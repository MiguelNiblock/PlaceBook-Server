const express = require('express');
const mongoose = require('mongoose');
// Route must be protected with authorization
const requireAuth = require('../middlewares/requireAuth');
const Location = mongoose.model('Location');

const router = express.Router();

// Ensure all request handlers attached to this router require the user to be signed in.
  // It attaches user obj to req, if authenticated
router.use(requireAuth);

//Save a new instance of model for a given user
router.post('/locs', async(req,res)=>{
  const {name, address, coords, notes, stars, tags, listId} = req.body
  if (!listId) {
    return res.status(422).send({error:'You must choose a list in which to save this location'});
  }
  try { //userId obtained from req.user, thanks to requireAuth middleware
    const timeStamp = new Date().toISOString();
    const location = new Location({name, address, coords, notes, stars, tags, userId: req.user._id, listId, datetimeCreated:timeStamp, datetimeModified:timeStamp});
    await location.save();
    res.send(location); //return the instance created
  } catch (err) {return res.status(422).send({error:err.message})}
});

//Fetch all instances a user has ever created
router.get('/locs', async(req, res)=>{
  const locs = await Location.find({userId: req.user._id})
  res.send(locs);
});

router.put('/locs/:id', async(req, res)=>{
  try {
    const _id = req.params.id;
    const {name, address, coords, notes, stars, tags, listId} = req.body
    // const savedLoc = await Location.findById(_id)
    // const datetimeCreated = savedLoc.datetimeCreated
    const datetimeModified = new Date().toISOString();
    const newLoc = await Location.findByIdAndUpdate(
      _id,
      {name, address, coords, notes, stars, tags, listId, datetimeModified},
      {new:true}
    )
    res.send(newLoc);
  } catch (err) {return res.status(422).send({error:err.message})}
})

module.exports = router;