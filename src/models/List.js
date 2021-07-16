const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  _id: String,
  name: {
    type: String,
    required: true,
    maxlength: 30,
    trim: true
  },
  color: {
    type: String,
    required: true
  },
  icon: {
    type: String,
    required: true
  },
  shown: Boolean,
  expanded: Boolean,
  datetimeCreated: String,
  datetimeModified: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

mongoose.model('List', listSchema)