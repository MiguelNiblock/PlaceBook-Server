const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
    timestamp: Number, // miliseconds since 1970
    coords: {
        latitude: Number,
        longitude: Number,
        altitude: Number,
        accuracy: Number,
        heading: Number,
        speed: Number
    }
});

const trackSchema = new mongoose.Schema({
    userId: { //reference to a user ID, from User collection
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        default: ''
    },
    locations: [pointSchema]
});

mongoose.model('Track',trackSchema)
//We're not loading pointSchema.
    // Calling 'model' ties some collection of data to mongoose
    // We won't have a collection of pointschemas. Instead they will be embedded inside 
    // trackSchema, so we only have a collection of track objects.