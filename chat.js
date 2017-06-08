var express = require("express");
var socket = require('socket.io');

var app = express();
var server = app.listen(3000);
var io = socket(server);

var messages = [];
var names = {};

app.use(express.static('public'));

console.log("Server is running");

io.sockets.on('connection', function(socket){

  socket.emit('load', messages);

  socket.on('join', function(name){
    console.log(name + " has joined");
    names[socket.id] = name;
    var users = getNames();
    console.log(users);
    io.sockets.emit('update', users);
  });

  socket.on('disconnect', function(){
    console.log(names[socket.id] + " disconnected");
    delete names[socket.id];
    var users = getNames();
    io.sockets.emit('update', users);
  });

  socket.on('message', function(message){
    io.sockets.emit('message', message);
    console.log(message);
    if(!names[socket.id]){
      names[socket.id] = message.name;
    }
    messages.push(message);
  });

  socket.on('clear', function(){
    messages = [];
    io.sockets.emit('clear', undefined);
  });
});

function getNames(){
  var socketIDs = Object.keys(names);
  var users = [];
    for(var i = 0; i < socketIDs.length; i++){
      users.push(names[socketIDs[i]]);
  }
  return users;
}
