const express = require('express');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const app = express();

const sslOptions = {
    key: fs.readFileSync('certs/key.pem'),
    cert: fs.readFileSync('certs/cert.pem'),
};
const server = https.createServer(sslOptions, app);


const io = require("socket.io")(server, { cors: { origin: '*' }});
const { ExpressPeerServer } = require("peer");


app.set('view engine', 'ejs')

app.use(express.static('public'));
app.use("/peerjs", ExpressPeerServer(server, { debug: true}));




app.get('/', (req, res) => {
    res.redirect(`/${uuidv4()}`);
});


app.get('/:room', (req, res) => {
    res.render('room', { roomId: req.params.room });
});


io.on("connection", (socket) => {
    socket.on("join-room", (roomId, userId) => {
        socket.join(roomId);
        socket.to(roomId).emit('user-connected', userId);
    });
});



server.listen(3000);