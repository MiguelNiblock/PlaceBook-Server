const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    maxlength: 30,
    trim: true
  },
  address: String,
  coords: {
    latitude: Number,
    longitude: Number,
    altitude: Number,
    accuracy: Number,
    heading: Number,
    speed: Number
  },
  datetimeCreated: String,
  datetimeModified: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
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