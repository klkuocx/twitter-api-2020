if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const routes = require('./routes')
const bodyParser = require('body-parser')
const passport = require('./config/passport')
const cors = require('cors')
const connection = require('./utils/socket.io')

const app = express()
const port = process.env.PORT

app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())
routes(app)

const server = require('http').createServer(app)
const io = require('socket.io')(server)

io.on('connection', socket => connection(socket))

server.listen(port, () => {
  console.log(`KRLL Twitter API listening on port:${port}`)
})

module.exports = app
