const fs = require('fs');
const path = require('path');

const directory = '.';
const chatWidgetHTML = `
<!-- AI Chat Widget -->
<div id="ai-chat-widget" class="fixed bottom-6 right-6 z-50 font-display flex flex-col items-end">
  <!-- Chat Window (Hidden by default) -->
  <div id="ai-chat-window" class="hidden flex-col w-[350px] h-[500px] bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-slate-100 mb-4 origin-bottom-right transition-all duration-300 transform scale-95 opacity-0">
    <!-- Header -->
    <div class="bg-gradient-to-r from-primary to-purple-600 p-4 flex justify-between items-center text-white">
      <div class="flex items-center gap-2">
        <span class="material-symbols-outlined">smart_toy</span>
        <span class="font-bold">Panta AI</span>
      </div>
      <button id="close-ai-chat" class="hover:bg-white/20 rounded-full p-1 transition-colors flex items-center justify-center">
        <span class="material-symbols-outlined text-sm">close</span>
      </button>
    </div>
    <!-- Messages Body -->
    <div id="ai-chat-messages" class="flex-1 p-4 bg-slate-50 overflow-y-auto flex flex-col gap-3">
      <div class="self-start bg-white border border-slate-100 p-3 rounded-2xl rounded-tl-sm shadow-sm text-sm text-slate-700 max-w-[85%]">
        Hi there! 👋 I'm Panta AI. I can help you find the perfect prop, process custom designs, or answer any questions. How can I help you today?
      </div>
    </div>
    <!-- Input -->
    <div class="p-3 bg-white border-t border-slate-100 flex items-center gap-2">
      <input type="text" id="ai-chat-input" placeholder="Ask me anything..." class="flex-1 bg-slate-100 border-none rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-primary/50 outline-none">
      <button id="send-ai-chat" class="bg-primary text-white size-9 rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors shrink-0 shadow-md">
        <span class="material-symbols-outlined text-[18px]">send</span>
      </button>
    </div>
  </div>

  <!-- Toggle Button -->
  <button id="toggle-ai-chat" class="size-14 bg-gradient-to-r from-primary to-purple-600 rounded-full flex items-center justify-center text-white shadow-[0_8px_30px_rgb(225,45,117,0.3)] hover:scale-105 transition-transform flex group">
    <span class="material-symbols-outlined text-2xl group-hover:hidden block">smart_toy</span>
    <span class="material-symbols-outlined text-2xl hidden group-hover:block transition-all">chat</span>
  </button>
</div>

<script>
  document.addEventListener('DOMContentLoaded', () => {
    // Only bind if the elements exist to avoid errors
    const toggleBtn = document.getElementById('toggle-ai-chat');
    const closeBtn = document.getElementById('close-ai-chat');
    const chatWindow = document.getElementById('ai-chat-window');
    const chatMessages = document.getElementById('ai-chat-messages');
    const chatInput = document.getElementById('ai-chat-input');
    const sendBtn = document.getElementById('send-ai-chat');

    if (!toggleBtn || !chatWindow) return;

    function toggleChat() {
      if (chatWindow.classList.contains('hidden')) {
        chatWindow.classList.remove('hidden');
        chatWindow.classList.add('flex');
        
        // small delay for transition
        setTimeout(() => {
          chatWindow.classList.remove('scale-95', 'opacity-0');
          chatWindow.classList.add('scale-100', 'opacity-100');
        }, 10);
      } else {
        chatWindow.classList.remove('scale-100', 'opacity-100');
        chatWindow.classList.add('scale-95', 'opacity-0');
        setTimeout(() => {
          chatWindow.classList.add('hidden');
          chatWindow.classList.remove('flex');
        }, 300);
      }
    }

    if(toggleBtn) toggleBtn.addEventListener('click', toggleChat);
    if(closeBtn) closeBtn.addEventListener('click', toggleChat);

    function addMessage(text, isUser = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = \`p-3 rounded-2xl shadow-sm text-sm max-w-[85%] \${isUser ? 'self-end bg-gradient-to-r from-primary to-purple-600 text-white rounded-tr-sm' : 'self-start bg-white border border-slate-100 text-slate-700 rounded-tl-sm'}\`;
      msgDiv.textContent = text;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
      return msgDiv;
    }

    function showTyping() {
       const typingDiv = document.createElement('div');
       typingDiv.id = 'ai-typing';
       typingDiv.className = 'self-start bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm shadow-sm text-slate-500 max-w-[85%] flex items-center gap-1.5 h-10';
       typingDiv.innerHTML = '<div class="size-1.5 bg-slate-400 rounded-full animate-bounce"></div><div class="size-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div><div class="size-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>';
       chatMessages.appendChild(typingDiv);
       chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeTyping() {
       const typingDiv = document.getElementById('ai-typing');
       if (typingDiv) typingDiv.remove();
    }

    function handleSend() {
      const text = chatInput.value.trim();
      if (!text) return;
      
      addMessage(text, true);
      chatInput.value = '';
      
      showTyping();
      setTimeout(() => {
        removeTyping();
        addMessage("Thanks! My AI brain is currently powering up 🔋, but a totally real human will hop in and reply to your message in just a moment!");
      }, 1500);
    }

    if(sendBtn) sendBtn.addEventListener('click', handleSend);
    if(chatInput) {
        chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') handleSend();
        });
    }
  });
</script>
`;

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        // Prevent double injection if run twice
        if (!content.includes('id="ai-chat-widget"')) {
            // Find closing body tag and insert right before it
            if (content.includes('</body>')) {
                content = content.replace('</body>', chatWidgetHTML + '\n</body>');
                fs.writeFileSync(filePath, content);
                console.log(`Injected AI Chat widget into ${file}`);
            } else {
                // if no closing body tag, just append to end
                fs.appendFileSync(filePath, '\\n' + chatWidgetHTML);
                console.log(`Appended AI Chat widget to ${file}`);
            }
        } else {
            console.log(`AI Chat widget already exists in ${file}, skipping`);
        }
    }
});
