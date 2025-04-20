let selectedNumber = null;
let messages = [];

async function fetchMessages() {
  const res = await fetch("/messages");
  messages = await res.json();
  renderConversations();
}

function cleanNumber(number) {
  // Fix array-wrapped numbers
  if (Array.isArray(number)) return number[0];
  if (typeof number === "string" && number.startsWith("["))
    return JSON.parse(number)[0]; // handle stringified arrays
  return number;
}

function groupByNumber(msgs) {
  const grouped = {};
  msgs.forEach((msg) => {
    const from = cleanNumber(msg.from_number);
    const to = cleanNumber(msg.to_number);
    const myNumber = "18337753445";
    const other = from === myNumber ? to : from;

    if (!grouped[other]) grouped[other] = [];
    grouped[other].push({ ...msg, from, to }); // store cleaned version
  });
  return grouped;
}

function renderConversations() {
  const grouped = groupByNumber(messages);
  const list = document.getElementById("conversationList");
  list.innerHTML = "";
  Object.keys(grouped).forEach((number) => {
    const div = document.createElement("div");
    div.className = "conversation";
    div.textContent = number;
    div.onclick = () => {
      selectedNumber = number;
      document.getElementById("chatTitle").textContent = `Chat with ${number}`;
      renderMessages();
    };
    list.appendChild(div);
  });
}

function renderMessages() {
  const list = document.getElementById("messageList");
  list.innerHTML = "";
  const grouped = groupByNumber(messages);
  if (!selectedNumber) return;
  const msgs = grouped[selectedNumber] || [];

  msgs.forEach((msg) => {
    const div = document.createElement("div");
    div.className = "message";
    const from = cleanNumber(msg.from_number);
    if (from === "18337753445") {
      div.classList.add("from-me");
    } else {
      div.classList.add("from-them");
    }

    // Prevent [object Object]
    div.textContent =
      typeof msg.text === "string" ? msg.text : JSON.stringify(msg.text);
    list.appendChild(div);
  });

  list.scrollTop = list.scrollHeight;
}

async function sendReply() {
  const input = document.getElementById("replyInput");
  const text = input.value.trim();
  if (!text || !selectedNumber) return;
  await fetch("/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      to: selectedNumber,
      text,
    }),
  });
  input.value = "";
  await fetchMessages(); // Refresh after send
}

fetchMessages();
setInterval(fetchMessages, 5000);
