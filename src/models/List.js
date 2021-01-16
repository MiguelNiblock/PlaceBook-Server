const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: String,
  icon: String,
  datetimeCreated: Number,
  datetimeModified: Number,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

mongoose.model('List', listSchema)