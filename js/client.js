const socket = io('http://localhost:8000');
// Get DOM elements in respective Js variables

const form = document.getElementById('send-container');
const messageInput = document.getElementById('messageInp');
const messageContainer = document.querySelector(".container");

//Audio that will play on receiving messages
var audio =new Audio('ting.mp3');


// Function which will append event info to the conatiner
const append = (message, position) => {
  const messageElement = document.createElement('div');
  messageElement.innerText = message;
  messageElement.classList.add('message');
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position =='left'){
     audio.play();
  }
  
};


// Ask new user for his/her name and let server know 
const name = prompt("Enter Your Name To Join");
socket.emit('new-user-joined', name);

// If a new user joins receive his/her name from server
socket.on('user-joined', (name) => {
  append(`${name} joined the chat`, 'right');
});


// If server sends a message receive it
socket.on('receive', (data) => {
    if (data) {
        append(`${data.name}: ${data.message}`, 'left');
    } else {
      console.error('Error: Invalid data received from server');
      alert('There was a problem receiving a message. Please try again later.');
    }
  });


  // If a user leaves the chat, append the info to container
  socket.on('left', (name) => {
        append(`${name} left the chat`, 'right');
  });
  
  // If the form gets submitted, send server the message
  form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const message = messageInput.value; 
    append(`You: ${message}`, 'right'); 
    socket.emit('send', message);
    messageInput.value = '';
  });