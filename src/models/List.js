const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  _id: {
    type: String,
    // unique: true,
    // index: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 30,
    trim: true
  },
  color: String,
  icon: String,
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