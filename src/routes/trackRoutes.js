const express = require('express');
const mongoose = require('mongoose');
// tracks must be protected with authorization
const requireAuth = require('../middlewares/requireAuth');
const Track = mongoose.model('Track');

const router = express.Router();

// Ensure all request handlers attached to this router require
    // the user to be signed in.
router.use(requireAuth);
    // Attaches user obj to req

//Fetch all tracks a user has ever created
router.get('/tracks', async(req, res)=>{
    const tracks = await Track.find({userId: req.user._id})
    res.send(tracks);
});

module.exports = router;