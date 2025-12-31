const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const router = express.Router()

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const exist = await User.findOne({ email })
  if (exist) return res.sendStatus(409)

  const hash = await bcrypt.hash(password, 10)
  await User.create({ name, email, password: hash })
  res.sendStatus(201)
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  const user = await User.findOne({ email })
  if (!user) return res.sendStatus(401)

  const ok = await bcrypt.compare(password, user.password)
  if (!ok) return res.sendStatus(401)

  const token = jwt.sign({ id: user._id }, 'secret')
  res.json({ name: user.name, token })
})

module.exports = router
