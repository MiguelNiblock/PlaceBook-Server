const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  address: String,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number
  },
  datetimeCreated: Number,
  datetimeModified: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  listId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
    required: true
  },
  notes: {
    type: String,
    default: ''
  },
  stars: {
    type: Number,
    default: 0
  },
  tags: {
    type: [String],
    default: []
  }
})

mongoose.model('Location', locationSchema)