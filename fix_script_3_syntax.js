const fs = require('fs');
const path = require('path');

const filePath = path.join('.', 'community_gallery.html');
let content = fs.readFileSync(filePath, 'utf-8');

// I will just replace the entire flawed section of the script.
// It seems `setupGalleryInteractions` got duplicated and tangled.
// Here is the correct setupGalleryInteractions:

const correctScript = `          function setupGalleryInteractions() {
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
          }`;

// The bad block in the file right now is:
/*
          function setupGalleryInteractions() {
            const items = document.querySelectorAll('.break-inside-avoid');
            items.forEach(item => {
              // Lightbox opening
              ...
              });
            });
          }

          function setupGalleryInteractions() {
            const items = document.querySelectorAll('.break-inside-avoid');
            items.forEach(item => {
              const subNode = item.querySelector('span.text-sm');
              ...
            });
          }
*/

// Let's just find the entire script block that starts around `// --- UI Polishes: Filtering, Lightbox, Toast ---`
// and ends with `</script>` and replace it completely with a cleanly parsed version.

const startMarker = `// --- UI Polishes: Filtering, Lightbox, Toast ---`;
const startIndex = content.indexOf(startMarker);
const endIndex = content.indexOf('</script>', startIndex);

if(startIndex !== -1 && endIndex !== -1) {
    const newScriptText = `// --- UI Polishes: Filtering, Lightbox, Toast ---

          function showToast(message, type = 'success') {
            const container = document.getElementById('toast-container');
            if (!container) return;

            const toast = document.createElement('div');
            const isError = type === 'error';
            toast.className = \`flex items-center gap-3 \${isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'} border px-6 py-4 rounded-xl shadow-lg shadow-black/5 transform transition-all duration-300 translate-x-12 opacity-0 font-bold\`;

            toast.innerHTML = \`
            <span class="material-symbols-outlined">\${isError ? 'error' : 'check_circle'}</span>
            <span>\${message}</span>
          \`;

            container.appendChild(toast);

            // Animate in
            requestAnimationFrame(() => {
              toast.classList.remove('translate-x-12', 'opacity-0');
            });

            // Animate out and remove
            setTimeout(() => {
              toast.classList.add('translate-x-12', 'opacity-0');
              setTimeout(() => toast.remove(), 300);
            }, 4000);
          }

          // Lightbox tracking
          function openLightbox(mediaSrc, isVideo, title, subtitle) {
            const modal = document.getElementById('lightbox-modal');
            const wrapper = document.getElementById('lightbox-content-wrapper');

            let mediaHtml = isVideo
              ? \`<video src="\${mediaSrc}" class="max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl" controls autoplay></video>\`
              : \`<img src="\${mediaSrc}" class="max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl object-contain" alt="\${title}">\`;

            wrapper.innerHTML = \`
            \${mediaHtml}
            <div class="mt-4 text-center">
              <h3 class="text-2xl font-black text-white">\${title}</h3>
              <p class="text-primary font-bold">\${subtitle}</p>
            </div>
          \`;

            modal.classList.remove('hidden');
            modal.classList.add('flex');
            setTimeout(() => {
              modal.classList.remove('opacity-0');
              wrapper.classList.remove('scale-95');
              wrapper.classList.add('scale-100');
            }, 10);
          }

          function closeLightbox() {
            const modal = document.getElementById('lightbox-modal');
            const wrapper = document.getElementById('lightbox-content-wrapper');
            modal.classList.add('opacity-0');
            wrapper.classList.remove('scale-100');
            wrapper.classList.add('scale-95');
            setTimeout(() => {
              modal.classList.add('hidden');
              modal.classList.remove('flex');
              wrapper.innerHTML = ''; 
            }, 300);
          }

          function setupGalleryInteractions() {
            const items = document.querySelectorAll('.break-inside-avoid');
            items.forEach(item => {
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

        function setupFilters() {
          const buttons = document.querySelectorAll('.flex-nowrap button');
          const items = document.querySelectorAll('.break-inside-avoid');

          buttons.forEach(btn => {
            btn.addEventListener('click', () => {
              buttons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                b.classList.add('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
              });
              btn.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
              btn.classList.remove('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');

              const filterText = btn.textContent.toLowerCase().trim();

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

        loadGallery().then(() => {
          setupGalleryInteractions();
          setupFilters();
        });

        document.addEventListener('DOMContentLoaded', () => {
          setTimeout(() => {
            const buttons = document.querySelectorAll('.flex-nowrap button');

            buttons.forEach(btn => {
              btn.addEventListener('click', (e) => {
                const filterText = e.target.textContent.toLowerCase().trim();
                buttons.forEach(b => {
                  b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                  b.classList.add('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
                });
                e.target.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                e.target.classList.remove('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');

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
          }, 500); 
        });
      `;
    
    content = content.slice(0, startIndex) + newScriptText + content.slice(endIndex);
    fs.writeFileSync(filePath, content);
    console.log("Entire block replaced cleanly.");
}
