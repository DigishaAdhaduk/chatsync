const express = require('express')
const http = require('http')
const cors = require('cors')
const multer = require('multer')
const { Server } = require('socket.io')
const Message = require('./models/Message')
require('./db')

const app = express()
app.use(cors())
app.use(express.json())
app.use('/uploads', express.static('uploads'))

app.use('/auth', require('./routes/auth'))
app.use('/rooms', require('./routes/room'))

app.get('/messages/:room', async (req, res) => {
  const msgs = await Message.find({ room: req.params.room }).sort({ time: 1 })
  res.json(msgs)
})

const storage = multer.diskStorage({
  destination: 'uploads',
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname)
  }
})

const upload = multer({ storage })

app.post('/upload', upload.single('file'), (req, res) => {
  res.json({ url: `/uploads/${req.file.filename}` })
})

const server = http.createServer(app)
const io = new Server(server, { cors: { origin: '*' } })

io.on('connection', socket => {
  socket.on('join', room => {
    socket.join(room)
  })

  socket.on('message', async data => {
    await Message.create({ ...data, time: new Date() })
    io.to(data.room).emit('message', data)
  })
})

server.listen(5001)
