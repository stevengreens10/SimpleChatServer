var socket;
var name;
var input;
var div;
var notifications = 0;
var joined = false;

var sound;

function preload(){
  sound = loadSound("./notification.mp3");
}

function setup(){
  noCanvas();
  background(51);
  //socket = io.connect("http://138.197.15.195:3000");
  socket = io.connect("10.0.0.8:3000");
  div = select("#messages");

  socket.on('clear', function(){
    var children = div.child();
    for(var i = children.length-1; i >= 0; i--){
      children[i].remove();
    }

    var p = createP("---CLEARED---");
    p.parent(div);

  });

  socket.on('load', function(messages){
    for(var i = 0; i < messages.length; i++){
      var p = createP(messages[i]);
      p.parent(div);
    }
  });

  socket.on('message', function(message){

    if(!document.hasFocus()){
      notifications++;
      document.title = "(" + notifications + ") Chat Server";
      if(!sound.isPlaying()) sound.play();
    }

    var p = createP(message.name + ": " + message.text);
    p.parent(div);
  });

  socket.on('update', function(names){
    // var keys = Object.keys(names);
    // var newNames = [];
    // for(var i = 0; i < keys.length; i++){
    //   var name = names[keys[i]];
    //   newNames.push(name);
    // }

    var list = select("#names");
    for(var i = list.child().length-1; i >= 0; i--){
      list.child()[i].remove();
    }

    for(var i = 0; i < names.length; i++){
      var li = createElement("li",names[i]);
      li.parent(select("#names"));
    }

    var userCount = select("#usercount");
    userCount.html("Users (" + names.length + " online)");
  });

  input = createElement("textarea");
  input.parent(select("#textbox"));
  input.elt.placeholder = "Type a message";
  name = prompt("What is your name?");

}

function draw(){
  if(name == "null"){
     name = prompt("What is your name?");
   }else if(!joined){
     socket.emit('join', name);
     joined = true;
   }

  if(document.hasFocus()){
    document.title = "Chat Server";
    notifications = 0;
  }

  if(document.hasFocus()){
    notifications = 0;
  }
}



function keyPressed(){
  if(keyCode == 13){
    if(input.value() != ""){
      if(input.value().charAt(0) != "/"){
        var message = {
          name: name,
          text: input.value()
        }
        socket.emit('message', message);
      }else{
        if(input.value().substring(0, 6) == "/clear"){
          socket.emit('clear', undefined);
        }
      }
      input.elt.value = "";
    }
    return false;
  }
}
