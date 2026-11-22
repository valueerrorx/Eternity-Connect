const express = require('express');
const https = require('https');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs');


const app = express();

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