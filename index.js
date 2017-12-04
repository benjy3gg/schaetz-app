var express = require("express");
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var port = process.env.PORT || 3000;

app.use(express.static("public"));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/index.html");
});

app.get("/chef", function(req, res) {
  res.sendFile(__dirname + "/chef.html");
});

io.on("connection", function(socket) {
  socket.on("card draw", function(msg) {
    io.emit("card draw", msg);
  });

  socket.on("card reset", function(msg) {
    io.emit("card reset");
  });
});

http.listen(port, function() {
  console.log("listening on *:" + port);
});
