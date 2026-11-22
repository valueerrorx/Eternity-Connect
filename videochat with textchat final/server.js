const express = require("express");
const { v4: uuidv4 } = require("uuid");
const https = require('https');
const fs = require('fs');

const path = require('path');
const { execFileSync } = require('child_process');

// Generate a self-signed development certificate on first start (needed for camera/mic over HTTPS)
const certDir = path.join(__dirname, 'certs');
const keyFile = path.join(certDir, 'key.pem');
const certFile = path.join(certDir, 'cert.pem');
if (!fs.existsSync(keyFile) || !fs.existsSync(certFile)) {
    console.log('No certificate found, creating a self-signed one in certs/ ...');
    fs.mkdirSync(certDir, { recursive: true });
    execFileSync('openssl', ['req', '-x509', '-newkey', 'rsa:2048', '-nodes', '-days', '365',
        '-keyout', keyFile, '-out', certFile, '-subj', '/CN=localhost'], { stdio: 'inherit' });
}

const sslOptions = {
    key: fs.readFileSync(keyFile),
    cert: fs.readFileSync(certFile),
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
