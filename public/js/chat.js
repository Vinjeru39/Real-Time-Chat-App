const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat");
const chatLink = document.getElementsByClassName("contact-link");

const socket = io();
let userId;
let recepientId;

if (window.innerWidth <= 800) {
  document.querySelector(".right-side").classList.add("invisible");
}

for (let i = 0; i < chatLink.length; i++) {
  chatLink[i].addEventListener("click", function () {
    if (document.getElementById("msg").hasAttribute("disabled")) {
      document.getElementById("msg").removeAttribute("disabled");
      document.getElementById("submit-btn").removeAttribute("disabled");
    }

    if (window.innerWidth <= 800) {
      document.getElementById("left-side").classList.toggle("invisible");
      document.querySelector(".right-side").classList.toggle("invisible");
      console.log(document.querySelector(".right-side").classList);
    }

    let room = this.getAttribute("href");
    let parts = room.split("AND");
    parts[0] = parts[0].split("").slice(1).join("");
    userId = parts[0];
    recepientId = parts[1];
    if (parts[0] > parts[1]) {
      room = parts[1] + "AND" + parts[0];
    } else {
      room = parts[0] + "AND" + parts[1];
    }

    //join a Room
    socket.emit("joinRoom", { userId, recepientId, room });
    //clear chat
    chatMessages.innerHTML = "";
  });
}

socket.on("message", ({ message, sentId }) => {
  outputMessage(message, sentId);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("recepientInfo", ({ userImage, userName }) => {
  document.getElementById("recepient-image").src = userImage;
  document.getElementById("recepient-username").innerText = userName;
});

socket.on("initialMessages", ({ messages }) => {
  messages.forEach((message) => {
    createMessage(message);
  });
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

//Message submit
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //Get message text
  const msg = e.target.elements.msg.value;
  //Emit message to the server
  socket.emit("chatMessage", msg);
  //Clear input
  e.target.elements.msg.value = "";
  e.target.elements.msg.focus();
});

//for initial messages in the database
function createMessage(message) {
  const div = document.createElement("div");
  let displayName = message.senderName;

  div.classList.add("message");
  if (message.sender === userId) {
    div.classList.add("sender-message");
    displayName = "ME";
  }
  div.innerHTML = `<div class="message-info">${displayName} <span>${moment(
    message.createdAt
  ).format("h:mm a")}</span></div>
      <div class="message-text">
        ${message.text}
      </div>`;
  chatMessages.appendChild(div);
}

//Output message to DOM
function outputMessage(message, sentId) {
  const div = document.createElement("div");
  let displayName = message.username;

  div.classList.add("message");
  if (sentId === userId) {
    div.classList.add("sender-message");
    displayName = "ME";
  }
  div.innerHTML = `<div class="message-info">${displayName} <span>${message.time}</span></div>
      <div class="message-text">
        ${message.text}
      </div>`;
  chatMessages.appendChild(div);
}
