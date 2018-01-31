var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3002;

app.use(express.static("public"));

app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/chef", function (req, res) {
  res.sendFile(__dirname + "/chef2.html");
});

app.get("/chef2", function (req, res) {
  res.sendFile(__dirname + "/chef2.html");
});

var rooms = [];

io.on("connection", function (socket) {

  socket.on("user can vote", function (user) {
    var currentRoom = socket.rooms[user.roomCode];
    io.sockets.in(currentRoom).emit("user can vote", user);
  });

  socket.on("user send vote", function (msg) {
    var currentRoom = socket.rooms[msg.user.roomCode];
    io.sockets.in(currentRoom).emit("user voted", msg);
  });

  socket.on("user wait", function (user) {
    var currentRoom = socket.rooms[user.roomCode];
    io.sockets.in(currentRoom).emit("user wait", user);
  });

  socket.on("card reset", function (roomCode) {
    var currentRoom = socket.rooms[roomCode];
    console.log(currentRoom);
    io.sockets.in(currentRoom).emit("card reset");
  });

  socket.on("room", function (user) {
    socket.join(user.roomCode);
    //rooms[user.roomCode].users[user.name] = { user, socket };
    //rooms[user.roomCode].sockets[socket.id] = { user, socket };
    console.log("user enters room: " + user.roomCode);
    io.sockets.in(user.roomCode).emit("user connected", user);
  });

  socket.on("room chef", function (roomCode) {
    //rooms[roomCode] = { id: roomCode, users: {}, sockets: {} };
    console.log("chef enters room: " + roomCode);
    rooms.push(roomCode);
    socket.join(roomCode);
  });

  socket.on("new ticket", function (msg) {
    io.sockets.in(msg.roomCode).emit("set ticket", msg.ticket);
  })

  socket.on('disconnecting', (reason) => {
    Object.entries(socket.rooms).forEach(([key, value]) => {
      io.sockets.in(key).emit("user disconnected", key);
    });
  });

  socket.on("chef connected", function (room) {
    io.sockets.in(room).emit("chef connected");
  });

  socket.on("set sizes", function (sizes) {
    var currentRoom = socket.rooms[Object.keys(socket.rooms)[0]];
    io.sockets.in(currentRoom).emit("set sizes", sizes);
  });
});

http.listen(port, '0.0.0.0', function () {
  console.log("listening on *:" + port);
});
