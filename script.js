const BASE_URL = "https://backendjs-4vpa.onrender.com";


// Token check on page load
window.onload = () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
  } else {
    verifyToken(token);
  }
};

// Token verification
async function verifyToken(token) {
  try {
    const res = await fetch(`${BASE_URL}/verify-token`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      }
    } else {
      const data = await res.json();
      console.log(data.message);
    }
  } catch (err) {
    console.error("Token verification failed:", err);
    alert("Something went wrong. Please try again.");
    window.location.href = "login.html";
  }
}

// Get user intent and interact with /ask
async function getIntent() {
  const input = document.getElementById("userInput").value.trim();
  if (input === "") return;

  addMessage(input, 'user');
  document.getElementById("userInput").value = '';

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Please login first.");
    window.location.href = "login.html";
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({ prompt: input })
    });

    if (!res.ok) {
      if (res.status === 401 || res.status === 403) {
        alert("Session expired. Please login again.");
        localStorage.removeItem("token");
        window.location.href = "login.html";
      } else {
        const text = await res.text();
        showError("somthings wrong here ...." + text);
        console.log("error" + text);
      
      }
      
      return;
    }

    const data = await res.json();
    addMessage(data.response, 'bot');

  } catch (err) {
    console.error("Error:", err);
    addMessage("Something went wrong. Please try again.", 'bot');
  }
}

// Add message to chat
function addMessage(message, sender) {
  const messageContainer = document.createElement("div");
  messageContainer.classList.add("message");
  if (sender === 'bot') messageContainer.classList.add("bot");

  messageContainer.textContent = message;

  const messages = document.getElementById("messages");
  if (messages) {
    messages.appendChild(messageContainer);
    messageContainer.scrollIntoView({ behavior: "smooth" });
  }
}

// Optional error box (if you have resultBox in HTML)
function showError(message) {
  const resultBox = document.getElementById("resultBox");
  if (resultBox) {
    resultBox.textContent = message;
  } else {
    addMessage(message, 'bot');
  }
}


