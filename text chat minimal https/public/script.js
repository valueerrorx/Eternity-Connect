const socket = io();


const messages = document.getElementById('messages');
const text = document.getElementById('chat_message');



text.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && text.value.length !== 0) {
      socket.emit("message", text.value);
      text.value = "";
    }
});



socket.on('createMessage', (message) => {
    console.log("message received in frontend")

    messages.innerHTML =
    messages.innerHTML +
    `<div class="message">
        <span>${message}</span>
    </div>`;

    scrollToBottom();
});


function scrollToBottom() {
    const messagesDiv = document.getElementById('chatwindow');
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }
  
