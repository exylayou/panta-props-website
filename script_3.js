
        function openUploadModal() {
          const modal = document.getElementById('upload-modal');
          const content = document.getElementById('upload-modal-content');
          modal.classList.remove('hidden');
          modal.classList.add('flex');
          setTimeout(() => {
            modal.classList.remove('opacity-0');
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
          }, 10);
        }

        function closeUploadModal() {
          const modal = document.getElementById('upload-modal');
          const content = document.getElementById('upload-modal-content');
          modal.classList.add('opacity-0');
          content.classList.remove('scale-100');
          content.classList.add('scale-95');
          setTimeout(() => {
            modal.classList.remove('flex');
            modal.classList.add('hidden');
          }, 300);
        }

        document.addEventListener('DOMContentLoaded', () => {
          // File input handling for the modal
          const fileInput = document.getElementById('modal-file-input');
          const submitBtn = document.getElementById('modal-submit-btn');
          const dropZone = fileInput.parentElement;
          let selectedFile = null;

          // Drag and drop events
          ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
          });

          function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
          }

          ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, highlight, false);
          });

          ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, unhighlight, false);
          });

          function highlight(e) {
            dropZone.classList.add('border-primary', 'bg-primary/5');
          }

          function unhighlight(e) {
            dropZone.classList.remove('border-primary', 'bg-primary/5');
          }

          dropZone.addEventListener('drop', handleDrop, false);

          function handleDrop(e) {
            const dt = e.dataTransfer;
            const files = dt.files;
            handleFiles(files);
          }

          fileInput.addEventListener('change', function () {
            handleFiles(this.files);
          });

          function handleFiles(files) {
            if (files.length > 0) {
              selectedFile = files[0];
              // Update UI to show selected file
              dropZone.innerHTML = `<div class="flex items-center gap-3 text-primary">
                  <span class="material-symbols-outlined">check_circle</span>
                  <span class="font-bold">${selectedFile.name} Selected</span>
                </div>
                <p class="text-xs text-slate-500 mt-2">Click to select a different file</p>
                <input type="file" id="modal-file-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept=".png,.jpg,.jpeg,.mp4,.mov">`;

              // Re-attach listener to new input
              document.getElementById('modal-file-input').addEventListener('change', function () {
                handleFiles(this.files);
              });
            }
          }

          // Submit handling
          submitBtn.addEventListener('click', async () => {
            if (!selectedFile) {
              showToast("Please select a file to upload.", "error");
              return;
            }

            // Get form values
            const nameInput = document.querySelector('input[placeholder="Jane Doe"]');
            const eventSelect = document.querySelector('select');
            const captionInput = document.querySelector('textarea');

            const submitterName = nameInput ? nameInput.value : 'Anonymous';
            const eventType = eventSelect ? eventSelect.value : '#Community';
            const caption = captionInput ? captionInput.value : '';

            // Update button state
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="material-symbols-outlined animate-spin">progress_activity</span> Uploading...';
            submitBtn.disabled = true;

            const formData = new FormData();
            formData.append('media', selectedFile);
            formData.append('submitterName', submitterName);
            formData.append('eventType', eventType);
            formData.append('caption', caption);

            try {
              const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData
              });

              if (res.ok) {
                showToast("File uploaded successfully! It will appear after review.", "success");
                closeUploadModal();
                // Reset form
                selectedFile = null;
                if (nameInput) nameInput.value = '';
                if (eventSelect) eventSelect.selectedIndex = 0;
                if (captionInput) captionInput.value = '';
                dropZone.innerHTML = `<span class="material-symbols-outlined text-slate-400 dark:text-slate-500 text-3xl mb-2 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors">cloud_upload</span>
                  <p class="text-slate-900 dark:text-white font-medium mb-1 relative z-10 pointer-events-none">Click to upload or drag and drop</p>
                  <p class="text-slate-400 dark:text-slate-500 text-sm relative z-10 pointer-events-none">PNG, JPG up to 10MB or MP4, MOV up to 50MB</p>
                  <input type="file" id="modal-file-input" class="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20" accept=".png,.jpg,.jpeg,.mp4,.mov">`;
                document.getElementById('modal-file-input').addEventListener('change', function () { handleFiles(this.files); });

                // Immediately refresh gallery to show the new post
                await loadGallery();
                setupGalleryInteractions();
                setupFilters();
              } else {
                showToast("Error uploading file. Please try again.", "error");
              }
            } catch (err) {
              showToast("Error uploading file. Please try again.", "error");
            } finally {
              submitBtn.innerHTML = originalBtnHtml;
              submitBtn.disabled = false;
            }
          });
        });

        // --- Fetch Gallery Logic ---
        async function loadGallery() {
          const gallery = document.getElementById('community-gallery-container');
          if (!gallery) return;

          try {
            const res = await fetch('/api/gallery');
            if (res.ok) {
              const posts = await res.json();
              if (posts.length > 0) {
                // gallery.innerHTML = ''; // DO NOT CLEAR - we want to keep static items
                posts.forEach(post => {
                  // Prevent rendering duplicates
                  if (document.querySelector(`[data-post-id="\${post.id}"]`)) return;

                  const newDiv = document.createElement('div');
                  newDiv.className = 'break-inside-avoid group relative overflow-hidden rounded-xl bg-slate-200 aspect-[4/5] sm:aspect-square md:aspect-[3/4] mb-6 shadow-md hover:shadow-xl transition-all duration-300';
                  newDiv.setAttribute('data-post-id', post.id);

                  const isVideo = post.media_type === 'video';
                  const mediaHtml = isVideo
                    ? `<video src="${post.file_path}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer" autoplay loop muted playsinline></video>`
                    : `<img loading="lazy" src="${post.file_path}" alt="${post.caption || 'Community Upload'}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 cursor-pointer">`;

                  newDiv.innerHTML = `
                    ${mediaHtml}
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 sm:p-6 pb-4 sm:pb-6 pointer-events-none">
                      <p class="text-white font-bold text-sm sm:text-base mb-1 truncate drop-shadow-md">${post.submitter_name}</p>
                      ${post.caption ? `<p class="text-white/90 text-xs sm:text-sm line-clamp-2 leading-relaxed drop-shadow">${post.caption}</p>` : ''}
                      <span class="text-primary/90 text-xs sm:text-sm font-bold uppercase tracking-wider mt-2 bg-black/40 inline-block w-max px-2 py-1 rounded-md backdrop-blur-sm">#${post.event_type}</span>
                    </div>
                  `;
                  gallery.insertBefore(newDiv, gallery.firstChild);
                });
              }
            }
          } catch (err) {
            console.error(err);
          }
        }

        // --- UI Polishes: Filtering, Lightbox, Toast ---

        function showToast(message, type = 'success') {
          const container = document.getElementById('toast-container');
          if (!container) return;

          const toast = document.createElement('div');
          const isError = type === 'error';
          toast.className = `flex items-center gap-3 ${isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'} border px-6 py-4 rounded-xl shadow-lg shadow-black/5 transform transition-all duration-300 translate-x-12 opacity-0 font-bold`;

          toast.innerHTML = `
            <span class="material-symbols-outlined">${isError ? 'error' : 'check_circle'}</span>
            <span>${message}</span>
          `;

          container.appendChild(toast);

          requestAnimationFrame(() => {
            toast.classList.remove('translate-x-12', 'opacity-0');
          });

          setTimeout(() => {
            toast.classList.add('translate-x-12', 'opacity-0');
            setTimeout(() => toast.remove(), 300);
          }, 4000);
        }

        function openLightbox(mediaSrc, isVideo, title, subtitle) {
          const modal = document.getElementById('lightbox-modal');
          const wrapper = document.getElementById('lightbox-content-wrapper');

          let mediaHtml = isVideo
            ? `<video src="${mediaSrc}" class="max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl" controls autoplay></video>`
            : `<img src="${mediaSrc}" class="max-h-[85vh] w-auto max-w-full rounded-xl shadow-2xl object-contain" alt="${title}">`;

          wrapper.innerHTML = `
            ${mediaHtml}
             <div class="mt-4 text-center">
              <h3 class="text-2xl font-black text-white">${title}</h3>
              <p class="text-primary font-bold">${subtitle}</p>
            </div>`;

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

        function closeLightbox() {
          const modal = document.getElementById('lightbox-modal');
          const wrapper = document.getElementById('lightbox-content-wrapper');
          modal.classList.add('opacity-0');
          wrapper.classList.remove('scale-100');
          wrapper.classList.add('scal           etTimeout(() => {
            modal.classList.add('h          
            modal.classList.remove('flex');
          rapper.innerHTML = '';
        }, 300);
        }

        f            tu pGalleryInteractions(tems = document.querySelectorAll('.break-insi            ;
          items.forEach(item => item.addEventListener('click', () => {
          const img = item.querySelector('img');
          const video = item.querySelector('video');
          const titleNode = item.querySelector('p.font-bold');
          const subNode = item.querySelector('sp'                    const title = titleNode ? titleNode.textContent : 'Community Highlight';
          const subtitle = subNode ? subNode.textContent : '';

          if L            g.src, false, title, subtitle)             ideo) openLigh.src, true, title, subtitle);
              });
          });
        }

        function setupFilt                b            ocument.querySelectorAll('            ap button');
        ems = document.querySelectorAll('.break-inside-avoid                 buttons.forEach(btn => {
                       entListene          ',           
              button          h(b => {
          b.classList.remove('bg-primary', 't            , 'shadow - md', 'shadow - primary / 20');
                b.cl            d('hover:bg-primary/10', 'text-slate-600', 'dark:text-slate-400');
          e.currentTarge.d('bg-primary', 'text-white', 'shadow-md', 'shadow-primary/20');
          e.currentTarget.classList.remove('hove              /10', 'text-slate-600', 'dark:text-slate-400');

          const filterText = e.currentTarget.textContent.toLowerCase

          items.forEach(item => {
            const subNode = item.querySelector('span.text-sm');
            const pNode = item.querySelector('p.font-bold');

            let matchText = "";
            if (subNode) matchText += subNod            ent.toLowerCase();
                           ) matchText += pNode.textCont            rCase();

          if (             === 'all') {
            item.style.display = 'block';
                    else if (matchText.includes(filterText              Text === 'parties' && matchText.incl            y')) ||           ext          ddings' && matchText.includ            g'))) {
                  item.style.display = 'block';
          } else {
            item.style.display = 'none';
          });
            });
            });
        }

        loadGallery().th            
          setupGalleryInteractions                setupFilters();

        document.addEventList              tentLoaded', () => {
        s => {
          const buttons = document.querySelectorAll(rap butto                       ttons.forEach(btn => {
              b            tListener('click', (e) => {
            const filterText = e            rget.textContent.toLower                             buttons.forEach(b => {
              remove('bg-primary', 'text-white', 'shadow-md', '0                    b.classList.ad              ar y/10', 'text-slate-600', 'dark:text-slate-400');
              e.currentTarget.classList.add('bg-primary', 'a              -primary/20');
              lassList.remove('hover:bg-prim              late-600', 'dark:text-slate-400');

              document.querySelectorAll('.break-inside-avoid.group').forEach(item => {
                const subNode = item.queryS                m');
                const p              ySelector                                let matchText                            Node) matchText += subNode.textContent.toLowerCase();
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

      