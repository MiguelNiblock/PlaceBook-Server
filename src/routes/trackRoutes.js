const express = require('express');
const mongoose = require('mongoose');
// tracks must be protected with authorization
const requireAuth = require('../middlewares/requireAuth');
const Track = mongoose.model('Track');

const router = express.Router();

// Ensure all request handlers attached to this router require the user to be signed in.
    // It attaches user obj to req, if authenticated
router.use(requireAuth);

//Fetch all tracks a user has ever created
router.get('/tracks', async(req, res)=>{
    const tracks = await Track.find({userId: req.user._id})
    res.send(tracks);
});

//Save a new track for a given user
router.post('/tracks', async(req,res)=>{
    const {name, locations} = req.body
    if (!name || !locations) {
        return res.status(422)
        .send({error:'You must provide a name and locations'});
    }
    try { //userId obtained from req.user, thanks to requireAuth middleware
        const track = new Track({name, locations, userId: req.user._id});
        await track.save();
        res.send(track); //return the track created
    } catch (err) {return res.status(422).send({error:err.message})}
});

module.exports = router;