var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

app.use(express.static("public"));

names = [];

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/chef", function(req, res) {
  res.sendFile(__dirname + "/chef.html");
});

io.on("connection", function(socket) {
  socket.on("card draw", function(msg) {
    var currentRoom = socket.rooms[Object.keys(socket.rooms)[0]];
    console.log(currentRoom);
    io.sockets.in(currentRoom).emit("card draw", msg);
  });

  socket.on("card reset", function(msg) {
    var currentRoom = socket.rooms[Object.keys(socket.rooms)[0]];
    console.log(currentRoom);
    io.sockets.in(currentRoom).emit("card reset");
  });

  socket.on("room", function(room) {
    socket.join(room);
    io.sockets.in(room).emit("user connected");
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
