const chatForm = document.getElementById("chat-form");
const chatMessages = document.getElementById("chat");
const chatLink = document.getElementsByClassName("contact-link");

const socket = io();

for (let i = 0; i < chatLink.length; i++) {
  chatLink[i].addEventListener("click", function () {
    let room = this.getAttribute("href");
    let parts = room.split("AND");
    parts[0] = parts[0].split("").slice(1).join("");
    const userId = parts[0];
    const recepientId = parts[1];
    if (parts[0] > parts[1]) {
      room = parts[1] + "AND" + parts[0];
    } else {
      room = parts[0] + "AND" + parts[1];
    }

    //join a Room
    socket.emit("joinRoom", { userId, recepientId, room });
    clearChat();
  });
}

socket.on("message", (message) => {
  outputMessage(message);

  //Scroll down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

socket.on("recepientInfo", ({ userImage, userName }) => {
  document.getElementById("recipient-image").src = userImage;
  document.getElementById("recipient-username").innerText = userName;
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

function clearChat() {
  chatMessages.innerHTML = "";
}

//Output message to DOM
function outputMessage(message) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = `<div class="message-info">${message.username} <span>${message.time}</span></div>
      <div class="message-text">
        ${message.text}
      </div>`;
  chatMessages.appendChild(div);
}
