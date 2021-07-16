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
  const {item} = req.body
  // console.log('POST item received:',item);
  if (!item.listId) {
    return res.status(422).send({error:'You must choose a list in which to save this location'});
  }
  try { //userId obtained from req.user, thanks to requireAuth middleware
    const location = new Location({...item, userId: req.user._id});
    // console.log('creating location:',location);
    await location.save();
    res.send(location); //return the instance created
  } catch (err) {
    console.error('Error saving new location:',err);
    return res.status(422).send(err)
  }
});

//Fetch all instances a user has ever created
router.get('/locs', async(req, res)=>{
  const locs = await Location.find({userId: req.user._id})
  res.send(locs);
});

router.put('/locs/:id', async(req, res)=>{
  try {
    const _id = req.params.id;
    const {name, notes, stars, tags, listId, datetimeModified} = req.body

    const newLoc = await Location.findOneAndUpdate(
      {_id},{name, notes, stars, tags, listId, datetimeModified},
      {runValidators:true,useFindAndModify:false,new:true}
    )
    if(!newLoc){
      console.error('Error updating a location. Possibly not found');
      return res.status(422).send('No location found to update')
    }
    res.send(newLoc);
  } catch (err) {
    console.error('Error updating a location:',err);
    return res.status(422).send({error:err.message})
  };
})

router.delete('/locs/:id', async(req,res)=>{
  try {
    const _id = req.params.id;
    const deletedLoc = await Location.findOneAndDelete({_id});
    if(!deletedLoc){
      console.error('Error deleting a location. Possibly not found');
      return res.status(422).send('No location found to delete')
    }
    res.send(deletedLoc);
  } catch (err) {
    console.error('Error deleting a location:',err);
    return res.status(422).send({error:err.message})
  };
})

module.exports = router;