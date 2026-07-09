const MESSAGES_KEY = "spacevision_messages";

function getStoredMessages() {
  const data = localStorage.getItem(MESSAGES_KEY);
  return data ? JSON.parse(data) : [];
}

function saveStoredMessages(messages) {
  localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
}

export function saveContactMessage({ name, email, message }) {
  const messages = getStoredMessages();

  const newMessage = {
    id: Date.now().toString(),
    name,
    email,
    message,
    createdAt: new Date().toISOString(),
  };

  messages.unshift(newMessage);
  saveStoredMessages(messages);

  return newMessage;
}

export function getContactMessages() {
  return getStoredMessages();
}

export function getContactMessagesCount() {
  return getStoredMessages().length;
}

export function getContactMessagesByEmail(email) {
  return getStoredMessages().filter(
    (msg) => msg.email.toLowerCase() === email.toLowerCase()
  );
}