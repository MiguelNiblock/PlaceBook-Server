const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    maxlength: 30,
    trim: true
  },
  address: {
    type: String,
    default: ''
  },
  coords: {
    latitude: Number,
    longitude: Number
  },
  datetimeCreated: String,
  datetimeModified: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  listId: {
    type: String,
    ref: 'List'
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