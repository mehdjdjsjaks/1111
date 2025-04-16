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

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = 'fa-IR';
  const voices = speechSynthesis.getVoices();
  const faVoice = voices.find(v => v.lang === 'fa-IR' || v.name.includes('Google فارسی'));
  if (faVoice) msg.voice = faVoice;
  else console.warn('صدای فارسی پیدا نشد!');
  speechSynthesis.speak(msg);
}

function sendMessage() {
  const input = document.getElementById('userInput');
  const text = input.value.trim();
  if (!text) return;
  addMessage(text, 'user');
  const response = getBotResponse(text);
  addMessage(response, 'bot');
  speak(response);
  input.value = '';
}

// فعال‌سازی صداها
window.speechSynthesis.onvoiceschanged = () => {
  speechSynthesis.getVoices(); // فقط صداها رو بارگذاری کنه
};

// حالت تاریک و روشن
const themeToggle = document.getElementById('themeToggle');
themeToggle.onclick = () => {
  document.body.classList.toggle('dark');
  document.body.classList.toggle('light');
};
// حالت پیش‌فرض تاریک
document.body.classList.add('dark');
