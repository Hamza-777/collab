const socket = io();
const chatForm = document.getElementById('chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.getElementById('room-name');
const userList = document.getElementById('users');
const editor = document.getElementById('editor');
const collabInfo = document.querySelector('.collab-info-container');
const collabEditor = document.querySelector('.collab-editor-container');
const collabChat = document.querySelector('.collab-chat-container');
const details = document.getElementById('details');
const chat = document.getElementById('chat');

const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Event Listeners

editor.addEventListener('keyup', (e) => {
    let text = editor.value;
    socket.emit('edit', text);
});

chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    let msg = e.target.elements.msg.value;

    socket.emit('chatMessage', msg);

    e.target.elements.msg.value = '';
    e.target.elements.msg.focus();
});

details.addEventListener('click', (e) => {
    let infoWidth = parseInt((collabInfo.style.width).split('%')[0]);
    let editorWidth = parseInt((collabEditor.style.width).split('%')[0]);
    let chatWidth = parseInt((collabChat.style.width).split('%')[0]);

    if(infoWidth == 20) {
        if(chatWidth == 30) {
            collabInfo.style.width = '0%';
            collabEditor.style.width = '70%';
        } else {
            collabInfo.style.width = '0%';
            collabEditor.style.width = '100%';
        }
    } else {
        if(chatWidth == 30) {
            collabInfo.style.width = '20%';
            collabEditor.style.width = '50%';
        } else {
            collabInfo.style.width = '20%';
            collabEditor.style.width = '80%';
        }
    }
});

chat.addEventListener('click', (e) => {
    let infoWidth = parseInt((collabInfo.style.width).split('%')[0]);
    let editorWidth = parseInt((collabEditor.style.width).split('%')[0]);
    let chatWidth = parseInt((collabChat.style.width).split('%')[0]);

    if(chatWidth == 30) {
        if(infoWidth == 20) {
            collabChat.style.width = '0%';
            collabEditor.style.width = '80%';
        } else {
            collabChat.style.width = '0%';
            collabEditor.style.width = '100%';
        }
    } else {
        if(infoWidth == 30) {
            collabChat.style.width = '30%';
            collabEditor.style.width = '50%';
        } else {
            collabChat.style.width = '30%';
            collabEditor.style.width = '70%';
        }
    }
});

// Socket events

socket.emit('joinRoom', {username, room});

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room);
    outputUsers(users);
});

socket.on('editCode', msg => {
    displayCode(msg);
});

socket.on('message', msg => {
    outputMessage(msg);
    chatMessages.scrollTop = chatMessages.scrollHeight;
});

const outputMessage = (message) => {
    let div = document.createElement('div');
    div.className = 'message';
    div.innerHTML = `<p class="meta">${message.username} <span>${message.time}</span></p>
    <p class="text">
        ${message.text}
    </p>`;
    chatMessages.appendChild(div);
}

// Display edited code
const displayCode = (message) => {
    editor.value = message;
}

// Add room name to DOM
function outputRoomName(room) {
    roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
    userList.innerHTML = '';
    users.forEach((user) => {
        const li = document.createElement('li');
        li.innerText = user.username;
        userList.appendChild(li);
    });
}