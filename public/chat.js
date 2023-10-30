document.addEventListener("DOMContentLoaded", function () {
  const messageForm = document.getElementById("message-form");
  const messageInput = document.getElementById("message-input");
  const chatMessages = document.getElementById("chat-messages");

  messageForm.addEventListener("submit", function (e) {
    e.preventDefault();
    const messageText = messageInput.value.trim();

    if (messageText !== "") {
      addMessage("User1", messageText);
      messageInput.value = "";
    }
  });

  function addMessage(user, content) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message");
    messageDiv.innerHTML = `
        <span class="user">${user}:</span>
        <span class="content">${content}</span>
      `;
    chatMessages.appendChild(messageDiv);

    // Scroll to the bottom to show the latest message
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }
});
