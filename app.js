// env init
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

// require server related packages
const express = require('express')
const bodyParser = require('body-parser')
const passport = require('./config/passport')
const cors = require('cors')
const logger = require('morgan')

// init server
const app = express()
const port = process.env.PORT
const server = require('http').createServer(app)
const io = require('socket.io')(server, {
  cors: {
    origin: "*",
    credentials: true
  }
})

app.use(logger('dev'))
app.use(cors())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(passport.initialize())

// run and listen to server 
server.listen(port, () => {
  console.log(`KRLL Twitter API listening on port:${port}`)
})

require('./routes')(app)
require('./utils/socket.io')(io)

module.exports = app
