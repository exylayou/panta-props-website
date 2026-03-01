const fs = require('fs');
const path = require('path');

const filePath = path.join('.', 'community_gallery.html');
let content = fs.readFileSync(filePath, 'utf-8');

// I will just replace the entire flawed section of the script.
// The flaw is around lines 675 to 788.

const badScriptStartString = `function setupGalleryInteractions() {`;
const badScriptEndString = `      </script>`;

const startIndex = content.indexOf(badScriptStartString);
const endIndex = content.indexOf(badScriptEndString);

if (startIndex !== -1 && endIndex !== -1) {
  const replacement = `function setupGalleryInteractions() {
            const items = document.querySelectorAll('.break-inside-avoid');
            items.forEach(item => {
              // Lightbox opening
              item.addEventListener('click', () => {
                const img = item.querySelector('img');
                const video = item.querySelector('video');
                const titleNode = item.querySelector('p.font-bold');
                const subNode = item.querySelector('span.text-sm');

                const title = titleNode ? titleNode.textContent : 'Community Highlight';
                const subtitle = subNode ? subNode.textContent : '';

                if (img) openLightbox(img.src, false, title, subtitle);
                if (video) openLightbox(video.src, true, title, subtitle);
              });
            });
          }

        // Filter Logic
        function setupFilters() {
          const buttons = document.querySelectorAll('.flex-nowrap button');
          const items = document.querySelectorAll('.break-inside-avoid');

          buttons.forEach(btn => {
            btn.addEventListener('click', () => {
              // Update button styling
              buttons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                b.classList.add('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
              });
              btn.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
              btn.classList.remove('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');

              const filterText = btn.textContent.toLowerCase().trim();

              // Filter items
              items.forEach(item => {
                const subNode = item.querySelector('span.text-sm');
                const pNode = item.querySelector('p.font-bold');

                let matchText = "";
                if (subNode) matchText += subNode.textContent.toLowerCase();
                if (pNode) matchText += pNode.textContent.toLowerCase();

                if (filterText === 'all') {
                  item.style.display = 'block';
                } else if (matchText.includes(filterText) || (filterText === 'parties' && matchText.includes('party')) || (filterText === 'weddings' && matchText.includes('wedding'))) {
                  item.style.display = 'block';
                } else {
                  item.style.display = 'none';
                }
              });
            });
          });
        }

        // Hook into the existing DOMContentLoaded or loadGallery to setup interactions for dynamically loaded content
        loadGallery().then(() => {
          // setup interactions for dynamically appended items
          setupGalleryInteractions();
          setupFilters();
        });

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
                  if (subNode) matchText += subNode.textContent.toLowerCase();
                  if (pNode) matchText += pNode.textContent.toLowerCase();

                  if (filterText === 'all') {
                    item.style.display = 'block';
                  } else if (matchText.includes(filterText) || (filterText === 'parties' && matchText.includes('party')) || (filterText === 'weddings' && matchText.includes('wedding'))) {
                    item.style.display = 'block';
                  } else {
                    item.style.display = 'none';
                  }
                });
              });
            });
          }, 500); // Give gallery time to render the initial fetch
        });
      </script>`;

  content = content.slice(0, startIndex) + replacement + content.slice(endIndex + 17);
  fs.writeFileSync(filePath, content);
  console.log("Fixed Syntax");
} else {
  console.log("Could not find bounds");
}
