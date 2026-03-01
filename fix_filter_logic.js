const fs = require('fs');
const path = require('path');

const filePath = path.join('.', 'community_gallery.html');
let content = fs.readFileSync(filePath, 'utf-8');

// Ensure the setup interactions hook is properly closed and executed
if (content.includes('setupFilters();')) {
    content = content.replace(
        'setupFilters();',
        `setupFilters();
          });
        }
        
        // Also attach the events globally so they don't get lost
        document.addEventListener('DOMContentLoaded', () => {
             setTimeout(() => {
                const items = document.querySelectorAll('.break-inside-avoid.group');
                const buttons = document.querySelectorAll('.flex-nowrap button');
                
                buttons.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                         const filterText = e.target.textContent.toLowerCase().trim();
                         // Update active state
                         buttons.forEach(b => {
                             b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                             b.classList.add('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
                         });
                         e.target.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                         e.target.classList.remove('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
                         
                         // Apply filter to all current items on the screen (including freshly loaded ones)
                         document.querySelectorAll('.break-inside-avoid.group').forEach(item => {
                             const subNode = item.querySelector('span.text-sm');
                             const pNode = item.querySelector('p.font-bold');
                             
                             let matchText = "";
                             if(subNode) matchText += subNode.textContent.toLowerCase();
                             if(pNode) matchText += pNode.textContent.toLowerCase();
                             
                             if (filterText === 'all') {
                                 item.style.display = 'block';
                             } else if (matchText.includes(filterText) || (filterText === 'parties' && matchText.includes('party'))) {
                                 item.style.display = 'block';
                             } else {
                                 item.style.display = 'none';
                             }
                         });
                    });
                });
             }, 500); // Give gallery time to render the initial fetch
        });
        `
    );
}

fs.writeFileSync(filePath, content);
console.log('Fixed Filter Logic');
