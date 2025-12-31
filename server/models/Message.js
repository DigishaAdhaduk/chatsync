const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
  text: String,
  file: String,
  user: String,
  room: String,
  time: Date
})

module.exports = mongoose.model('Message', messageSchema)
