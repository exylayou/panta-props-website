const fs = require('fs');
const path = require('path');

const directory = '.';

// This script finds the existing ai-chat script in all HTML files and REPLACES the handleSend function and adds a simple intent matching system.

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        // Check if the chat widget is actually in this file
        if (content.includes('id="ai-chat-widget"')) {
            let modified = false;

            // Define the new logic to replace the old handleSend
            const oldLogicStart = 'function handleSend() {';
            const oldLogicEnd = `if(sendBtn) sendBtn.addEventListener('click', handleSend);`;

            // If we have already upgraded it, skip
            if (content.includes('function getBotResponse(text)')) {
                console.log(`Chat widget in ${file} is already smart, skipping.`);
                return;
            }

            if (content.includes(oldLogicStart) && content.includes(oldLogicEnd)) {

                const smartLogic = `
    function getBotResponse(text) {
      const lower = text.toLowerCase();
      
      // Material & Thickness logic
      if (lower.includes('material') || lower.includes('made of') || lower.includes('pvc') || lower.includes('thick') || lower.includes('mm')) {
         return "Our stock props are made from durable, premium 5mm expanded PVC with a matte finish to prevent glare. If you place a Custom Order, we upgrade that to extra-durable 8mm PVC!";
      }
      
      // Custom order logic
      if (lower.includes('custom') || lower.includes('bespoke') || lower.includes('my own')) {
         return "We absolutely do custom orders! We can design and laser-cut your custom props from 8mm PVC and ship them in just 3 days. Check out the 'Custom Orders' page for more info.";
      }
      
      // Shipping / Location logic
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

    if(sendBtn) sendBtn.addEventListener('click', handleSend);`;

                // Substring replacement
                const startIndex = content.indexOf(oldLogicStart);
                const endIndex = content.indexOf(oldLogicEnd) + oldLogicEnd.length;

                if (startIndex !== -1 && endIndex !== -1) {
                    const before = content.substring(0, startIndex);
                    const after = content.substring(endIndex);
                    content = before + smartLogic + after;
                    modified = true;
                }
            }

            if (modified) {
                fs.writeFileSync(filePath, content);
                console.log(`Upgraded AI Chat widget intelligence in ${file}`);
            }
        }
    }
});
