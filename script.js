function addMessage(text, sender) {
  const chatBox = document.getElementById('chatBox');
  const msg = document.createElement('div');
  msg.className = `message ${sender}`;
  msg.innerText = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function getBotResponse(input) {
  const msg = input.toLowerCase();
  if (msg.includes('سلام')) return 'سلام! حالت چطوره؟';
  if (msg.includes('خوبی')) return 'من عالی‌ام، ممنون که پرسیدی!';
  if (msg.includes('اسمت چیه')) return 'من Axcel هستم، دستیار هوشمند تو!';
  if (msg.includes('خداحافظ')) return 'فعلاً! مراقب خودت باش.';
  return 'متوجه نشدم، لطفاً واضح‌تر بپرس!';
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  const response = getBotResponse(text);
  addMessage(response, 'bot');
  input.value = '';
}

const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  const isDark = document.body.classList.contains('dark');
  document.body.classList.toggle('dark', !isDark);
  document.body.classList.toggle('light', isDark);
  themeToggle.textContent = isDark ? '☀️' : '🌙';
};
