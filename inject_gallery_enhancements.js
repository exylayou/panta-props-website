const fs = require('fs');
const path = require('path');

const filePath = path.join('.', 'community_gallery.html');
let content = fs.readFileSync(filePath, 'utf-8');

// 1. Add loading="lazy" to all img tags in the masonry gallery
content = content.replace(/<img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/g, '<img loading="lazy" class="cursor-pointer w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"');
content = content.replace(/<video class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"/g, '<video class="cursor-pointer w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"');

// 2. Add Lightbox HTML (just before the closing main tag)
const lightboxHTML = `
      <!-- Lightbox Modal -->
      <div id="lightbox-modal" class="fixed inset-0 z-[200] hidden items-center justify-center opacity-0 transition-opacity duration-300">
        <div class="absolute inset-0 bg-black/90 backdrop-blur-md" onclick="closeLightbox()"></div>
        <button onclick="closeLightbox()" class="absolute top-6 right-6 text-white hover:text-primary transition-colors z-[210]">
          <span class="material-symbols-outlined text-4xl">close</span>
        </button>
        <div class="relative z-[205] max-w-5xl w-full max-h-[90vh] p-4 flex flex-col items-center justify-center transform scale-95 transition-transform duration-300" id="lightbox-content-wrapper">
           <!-- Content injected here -->
        </div>
      </div>
`;
content = content.replace('</main>', lightboxHTML + '\n    </main>');

// 3. Add Toast HTML (just before the closing body tag)
const toastHTML = `
  <!-- Toast Container -->
  <div id="toast-container" class="fixed top-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none"></div>
`;
content = content.replace('</body>', toastHTML + '\n</body>');

// 4. Inject script logic for Filtering, Lightbox, and Toasts
const scriptLogic = `
        // --- UI Polishes: Filtering, Lightbox, Toast ---

        function showToast(message, type = 'success') {
          const container = document.getElementById('toast-container');
          if(!container) return;
          
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
          // small delay for transition
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
            wrapper.innerHTML = ''; // prevent video continuing to play
          }, 300);
        }

        function setupGalleryInteractions() {
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
              
              if(img) openLightbox(img.src, false, title, subtitle);
              if(video) openLightbox(video.src, true, title, subtitle);
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

              const filterText = btn.textContent.toLowerCase();

              // Filter items
              items.forEach(item => {
                const subNode = item.querySelector('span.text-sm');
                if(!subNode) return;
                const badges = subNode.textContent.toLowerCase();
                
                if(filterText === 'all') {
                  item.style.display = 'block';
                } else if(badges.includes(filterText) || (filterText === 'parties' && badges.includes('party'))) {
                  item.style.display = 'block';
                } else {
                  item.style.display = 'none';
                }
              });
            });
          });
        }

        // Hook into the existing DOMContentLoaded or loadGallery to setup interactions for dynamically loaded content
        `;

content = content.replace('// Close modal after success', `showToast("File uploaded successfully! It will appear after review.", "success");\n                  // Close modal after success`);
content = content.replace(`alert('Error uploading file!');`, `showToast("Error uploading file. Please try again.", "error");`);

// Insert the new logic into the existing script tag, just before the closing tag, and rewrite the loadGallery ending
let index = content.lastIndexOf('loadGallery();');
if(index !== -1) {
  content = content.substring(0, index) + scriptLogic + `
          loadGallery().then(() => {
             // setup interactions for dynamically appended items
             setupGalleryInteractions();
             setupFilters();
          });
        ` + content.substring(index + 14);
}


fs.writeFileSync(filePath, content);
console.log('Injected UI Polishes');
