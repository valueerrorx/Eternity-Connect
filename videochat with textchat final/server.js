const express = require("express");
const { v4: uuidv4 } = require("uuid");
const https = require('https');
const fs = require('fs');

const sslOptions = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
};

const app = express();
const server = https.createServer(sslOptions, app);

const io = require("socket.io")(server, {  cors: {  origin: '*'  }});
const { ExpressPeerServer } = require("peer");


app.set("view engine", "ejs");

app.use("/peerjs", ExpressPeerServer(server, { debug: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.redirect(`/${uuidv4()}`);
});

app.get("/:room", (req, res) => {
  res.render("room", { roomId: req.params.room });
});

io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId, userName) => {
      socket.join(roomId);

      setTimeout(()=>{
        socket.to(roomId).broadcast.emit("user-connected", userId);
      }, 1000)

      socket.on("message", (message) => {
        console.log("backend message received")
        io.to(roomId).emit("createMessage", message, userName);
      });
    });
});

server.listen(3030);
