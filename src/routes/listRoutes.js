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
    const timeStamp = new Date().toISOString();
    const list = new List({name, color, icon, shown:true, expanded:true, datetimeCreated:timeStamp, datetimeModified:timeStamp, userId: req.user._id});
    // console.log('list:',list)
    await list.save();
    res.send(list); //return the instance created
  } catch (err) {return res.status(422).send({error:err.message})}
});

//Fetch all instances a user has ever created
router.get('/lists', async(req, res)=>{
  // console.log('get /lists');
  const lists = await List.find({userId: req.user._id})
  res.send(lists);
});

router.put('/lists/:id', async(req, res)=>{
  try {
    const _id = req.params.id;
    const {name, color, icon, shown, expanded,datetimeModified} = req.body
    console.log('PUT:',_id,name,color,icon,shown,expanded,datetimeModified)
    const updatedList = await List.findByIdAndUpdate(
      _id,
      {name, color, icon, shown, expanded, datetimeModified},
      {new:true}
    )
    res.send(updatedList);
  } catch (err) {return res.status(422).send({error:err.message})}
})

router.delete('/lists/:id', async(req,res)=>{
  try {
    const _id = req.params.id;
    const deletedList = await List.findByIdAndDelete(_id);
    res.send(deletedList);
  } catch (err) {return res.status(422).send({error:err.message})};
})

module.exports = router;