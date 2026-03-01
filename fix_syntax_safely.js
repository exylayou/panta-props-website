const fs = require('fs');
let html = fs.readFileSync('community_gallery.html', 'utf8');

const startStr = '        function setupGalleryInteractions() {';
const endStr = `      </script> <!-- Lightbox Modal -->`;

const startIndex = html.indexOf(startStr);
const endIndex = html.indexOf(endStr);

if (startIndex !== -1 && endIndex !== -1) {
    const perfectCode = `        function setupGalleryInteractions() {
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
            btn.addEventListener('click', (e) => {
              buttons.forEach(b => {
                b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                b.classList.add('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
              });
              e.currentTarget.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
              e.currentTarget.classList.remove('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');

              const filterText = e.currentTarget.textContent.toLowerCase().trim();

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
                const filterText = e.currentTarget.textContent.toLowerCase().trim();
                buttons.forEach(b => {
                  b.classList.remove('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                  b.classList.add('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
                });
                e.currentTarget.classList.add('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
                e.currentTarget.classList.remove('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');

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
    html = html.substring(0, startIndex) + perfectCode + '\n' + html.substring(endIndex);
    fs.writeFileSync('community_gallery.html', html);
    console.log("Successfully replaced the mangled setupGalleryInteractions block.");
} else {
    console.log("Could not find start or end bounds.");
}
