let myVideoStream;
const videoGrid = document.getElementById("video-grid");
const myVideo = document.createElement("video");
myVideo.muted = true;

const socket = io('/');

var peer = new Peer(undefined, {
        path: '/peerjs',
        host: '/',
        port: 3000,
        debug: 3
 });



navigator.mediaDevices.getUserMedia({
    audio: true,
    video: true,
})
.then((stream) => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream);


    peer.on("call", (call) => {
        console.log('someone call me');
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
            addVideoStream(video, userVideoStream);
        });
    });
  
    socket.on("user-connected", (userId) => {
        console.log("connecting new user...")
        connectToNewUser(userId, stream);
    });

});

const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
       video.play();
       videoGrid.append(video);
    });
};


const connectToNewUser = (userId, stream) => {
    console.log('colling: ' + userId);
    const call = peer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
        console.log("stream received. adding stream...")
        addVideoStream(video, userVideoStream);
    });
};
  
peer.on("open", (id) => {
    console.log('my id is' + id);
    socket.emit("join-room", ROOM_ID, id);
});