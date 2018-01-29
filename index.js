var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3002;

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/chef", function(req, res) {
  res.sendFile(__dirname + "/chef.html");
});

app.get("/chef2", function(req, res) {
  res.sendFile(__dirname + "/chef2.html");
});

io.on("connection", function(socket) {
  
  socket.on("user vote", function(msg) {
    var currentRoom = socket.rooms[Object.keys(socket.rooms)[0]];
    console.log(msg);
    io.sockets.in(currentRoom).emit("user voted", msg);
  });

  socket.on("card reset", function(msg) {
    var currentRoom = socket.rooms[Object.keys(socket.rooms)[0]];
    console.log(currentRoom);
    io.sockets.in(currentRoom).emit("card reset");
  });

  socket.on("room", function(user) {
    socket.join(user.roomCode);
    console.log(user);
    io.sockets.in(user.roomCode).emit("user connected", user);
  });

  socket.on("room chef", function(roomCode) {
    console.log("chef enters room: " + roomCode);
    socket.join(roomCode);
  });

  socket.on("chef connected", function(room) {
    io.sockets.in(room).emit("chef connected");
  });

  socket.on("set sizes", function(sizes) {
    var currentRoom = socket.rooms[Object.keys(socket.rooms)[0]];
    io.sockets.in(currentRoom).emit("set sizes", sizes);
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
