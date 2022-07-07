const express = require('express')
const app = express();
var bodyParser = require('body-parser')
const dotenv = require('dotenv').config()
const mongoose = require('mongoose');
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const { log } = require('console');
const io = new Server(server);
const port = process.env.PORT || 5000;


app.use(express.static(__dirname));
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
 
const DB = process.env.MONGO_URI;
mongoose.connect(DB, {useNewUrlParser: true})
.then((con)=> {
   console.log('Successful connection');
});

var Message = mongoose.model('Message', {
  name: String,
  message: String
});

var messages = [
    {name: "John", message: "Hello"},
    {name: "Jane", message: "Hi"}
]

app.get('/messages', (req, res) => {  
    Message.find({}, (err, messages) => {
        res.send(messages);
    });
  });

  app.post('/messages', (req, res) => {  
    var message = new Message(req.body);
    message.save((err) => { 
      if (err) { 
      console.log(err);
      sendStatus(500);
    } });
    // messages.push(req.body);
    io.emit('message', req.body);
    res.sendStatus(200);
  })

  io.on('connection', (socket) => {
    console.log('a user connected');
  });

server.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})