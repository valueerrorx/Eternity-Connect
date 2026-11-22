 
const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(express.static('public'));
app.set('view engine', 'ejs');

app.get('/', function(req, res){
  res.render('index');
});



io.on('connection', (socket) => {
  console.log('a user connected');

  socket.on('message', (msg) => {
    console.log(`message received in backend: ${msg}`);
    io.emit('createMessage', msg);
  });
});











http.listen(3000, function(){
  console.log('listening on *:3000');
});
