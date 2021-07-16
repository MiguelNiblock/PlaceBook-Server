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
  let {item} = req.body
  if (!item.name) {
    console.error('Error saving new list: List didnt have a name.',item);
    return res.status(422).send({error:'Error saving new list: List didnt have a name'});
  }
  try { //userId obtained from req.user, thanks to requireAuth middleware
    const list = new List({...item, userId: req.user._id});
    console.log('creating list:',list)
    await list.save();
    res.send(list); //return the instance created
  } catch (err) {
    console.error('Error saving new list:',err);
    return res.status(422).send({error:err})
  }
});

//Fetch all instances a user has ever created
router.get('/lists', async(req, res)=>{
  // console.log('get /lists');
  const lists = await List.find({userId: req.user._id})
  res.send(lists);
});

//Edit a record
router.put('/lists/:id', async(req, res)=>{
  try {
    const _id = req.params.id;
    const {name, color, icon, shown, expanded,datetimeModified} = req.body
    console.log('PUT:',_id,name,color,icon,shown,expanded,datetimeModified)
    const updatedList = await List.findOneAndUpdate(
      {_id},{name, color, icon, shown, expanded, datetimeModified},
      {runValidators:true,useFindAndModify:false,new:true}
    )
    if(!updatedList){
      console.error('Error updating a list. Possibly not found');
      return res.status(422).send({error:'No list found to update'})
    }
    res.send(updatedList);
  } catch (err) {
    console.error('Error updating a list:',err);
    return res.status(422).send({error:err.message})
  }
})

router.delete('/lists/:id', async(req,res)=>{
  try {
    const _id = req.params.id;
    const deletedList = await List.findOneAndDelete({_id});
    if(!deletedList){
      console.error('Error deleting a list. Possibly not found');
      return res.status(422).send({error:'No list found to delete'})
    }
    res.send(deletedList);
  } catch (err) {
    console.error('Error deleting a list. Possibly not found',err);
    return res.status(422).send({error:err.message})
  };
})

module.exports = router;