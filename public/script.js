const form = document.getElementById('chat-form');
const input = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

/**
 * Appends a new message to the chat box.
 * @param {string} sender - The sender of the message ('user' or 'bot').
 * @param {string} text - The message content.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(sender, text) {
  const msgDiv = document.createElement('div');
  msgDiv.classList.add('message', sender);
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  // Scroll to the bottom of the chat box to show the latest message
  chatBox.scrollTop = chatBox.scrollHeight;
  return msgDiv;
}

// Listen for form submission
form.addEventListener('submit', async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) {
    return; // Don't send empty messages
  }

  // 1. Add the user's message to the chat box
  appendMessage('user', userMessage);
  input.value = ''; // Clear the input field

  // 2. Show a temporary "Thinking..." message from the bot
  const thinkingMessage = appendMessage('bot', 'Gemini is thinking...');

  try {
    // 3. Send the user's message to the backend API
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const data = await response.json();

    // 4. Replace "Thinking..." with the AI's reply or a fallback message
    if (data && data.result) {
      thinkingMessage.textContent = data.result;
    } else {
      thinkingMessage.textContent = 'Sorry, no response received.';
    }
  } catch (error) {
    console.error('Failed to get response:', error);
    // 5. If an error occurs, update the message to inform the user
    thinkingMessage.textContent = 'Failed to get response from server.';
  } finally {
    // Ensure the view scrolls down to the final message, as its height might have changed
    chatBox.scrollTop = chatBox.scrollHeight;
  }
});


form.addEventListener('submit', function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage('user', userMessage);
  input.value = '';

  // Simulasi dummy balasan bot (placeholder)
  setTimeout(() => {
    appendMessage('bot', 'Gemini is thinking... (this is dummy response)');
  }, 1000);
});

function appendMessage(sender, text) {
  const msg = document.createElement('div');
  msg.classList.add('message', sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
