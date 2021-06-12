const express = require('express');
const mongoose = require('mongoose');
// Route must be protected with authorization
const requireAuth = require('../middlewares/requireAuth');
const User = mongoose.model('User');

const router = express.Router();

// Ensure all request handlers attached to this router require the user to be signed in.
  // It attaches user obj to req, if authenticated
router.use(requireAuth);

//Fetch all instances a user has ever created
router.get('/users', async(req, res)=>{
  res.send(req.user);
});

module.exports = router;