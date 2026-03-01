
    document.addEventListener('DOMContentLoaded', () => {
      // Only bind if the elements exist to avoid errors
      const toggleBtn = document.getElementById('toggle-ai-chat');
      const closeBtn = document.getElementById('close-ai-chat');
      const chatWindow = document.getElementById('ai-chat-window');
      const chatMessages = document.getElementById('ai-chat-messages');
      const chatInput = document.getElementById('ai-chat-input');
      const sendBtn = document.getElementById('send-ai-chat');

      if (!chatWindow) return;

      function toggleChat() {
        if (chatWindow.classList.contains('hidden')) {
          chatWindow.classList.remove('hidden');
          chatWindow.classList.add('flex');

          // small delay to allow display flex to apply before opacity transition
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

      if (toggleBtn) toggleBtn.addEventListener('click', toggleChat);
      if (closeBtn) closeBtn.addEventListener('click', toggleChat);

      function addMessage(text, isUser = false) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `p-3 rounded-2xl shadow-sm text-sm max-w-[85%] ${isUser ? 'self-end bg-gradient-to-r from-primary to-purple-600 text-white rounded-tr-sm' : 'self-start bg-white border border-slate-100 text-slate-700 rounded-tl-sm'}`;
        msgDiv.textContent = text;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        return msgDiv;
      }

      function showTyping() {
        const typingDiv = document.createElement('div');
        typingDiv.id = 'ai-typing';
        typingDiv.className = 'self-start bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-sm text-slate-500 max-w-[85%] flex items-center gap-1.5 h-10';
        typingDiv.innerHTML = '<div class="size-1.5 bg-slate-400 rounded-full animate-bounce"></div><div class="size-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.15s"></div><div class="size-1.5 bg-slate-400 rounded-full animate-bounce" style="animation-delay: 0.3s"></div>';
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
      }

      function removeTyping() {
        const typingDiv = document.getElementById('ai-typing');
        if (typingDiv) typingDiv.remove();
      }

      function getBotResponse(text) {
        const lower = text.toLowerCase();

        // Material & Thickness logic
        if (lower.includes('material') || lower.includes('made of') || lower.includes('pvc') || lower.includes('thick') || lower.includes('heavy')) {
          return "Both our Stock and Custom props are cut from maximum-durability 8mm PVC and printed with a matte finish to prevent glare!";
        }

        // Custom order logic
        if (lower.includes('custom') || lower.includes('bespoke') || lower.includes('my own')) {
          return "We absolutely do custom orders! We can design and laser-cut your custom props from 8mm PVC and ship them to you in just 3 days. Check out the 'Custom Orders' page for more info.";
        }

        // Shipping logic
        if (lower.includes('ship') || lower.includes('long') || lower.includes('where')) {
          return "We ship worldwide! Stock items usually process in 1-2 days, while custom orders take about 3 days to design and cut before shipping.";
        }

        // Default fallback
        return "Thanks for your message! My AI brain is currently powering up 🔋 to answer that fully, but a totally real human will hop in and reply to your message in just a moment!";
      }

      function handleSend() {
        const text = chatInput.value.trim();
        if (!text) return;

        addMessage(text, true);
        chatInput.value = '';

        showTyping();
        setTimeout(() => {
          removeTyping();
          const response = getBotResponse(text);
          addMessage(response);

          // Store common questions to pass to the human agent later

        }, Math.random() * 1000 + 800); // Random delay between 0.8s and 1.8s for realism
      }

      if (sendBtn) sendBtn.addEventListener('click', handleSend);
      if (chatInput) {
        chatInput.addEventListener('keypress', (e) => {
          if (e.key === 'Enter') handleSend();
        });
      }
    });
  