const mongoose = require('mongoose');

const listSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  color: String,
  icon: String,
  shown: Boolean,
  datetimeCreated: String,
  datetimeModified: String,
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

mongoose.model('List', listSchema)