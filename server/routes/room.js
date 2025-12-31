const express = require('express')
const Room = require('../models/Room')
const Message = require('../models/Message')

const router = express.Router()

router.get('/', async (req, res) => {
  const rooms = await Room.find()
  res.json(rooms)
})

router.post('/', async (req, res) => {
  const code = Math.random().toString(36).substring(2, 8)
  const room = await Room.create({ name: req.body.name, code })
  res.json(room)
})

router.post('/join', async (req, res) => {
  const room = await Room.findOne({ code: req.body.code })
  if (!room) return res.sendStatus(404)
  res.json(room)
})

router.delete('/:name', async (req, res) => {
  await Message.deleteMany({ room: req.params.name })
  await Room.deleteOne({ name: req.params.name })
  res.sendStatus(200)
})

module.exports = router
