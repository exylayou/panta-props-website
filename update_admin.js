const fs = require('fs');
const cheerio = require('cheerio');

const htmlPath = './admin_dashboard.html';
const html = fs.readFileSync(htmlPath, 'utf8');
const $ = cheerio.load(html);

// 1. Update Header Button
let headerDiv = $('.flex-1');
headerDiv.find('p').remove();
headerDiv.append(`
<div class="flex items-center gap-3 mt-2">
    <p class="text-slate-500">Review and update custom prop order requests.</p>
    <button id="newLeadBtn" class="bg-slate-900 hover:bg-primary text-white text-xs font-bold py-1.5 px-3 rounded-lg shadow-sm transition-colors flex items-center gap-1">
        <span class="material-symbols-outlined text-[16px]">add</span> Add Lead
    </button>
</div>
`);
$('#leadCount').removeClass('bg-green-100 text-green-700').addClass('bg-primary/10 text-primary');

// 2. Replace leads table with Kanban Board
const tableContainer = $('.bg-white.rounded-\\[2rem\\].shadow-\\[0_20px_40px_-12px_rgba\\(0\\,0\\,0\\,0\\.05\\)\\].border.border-slate-100.overflow-hidden').first();
tableContainer.replaceWith(`
<!-- Kanban Container -->
<div id="kanbanBoard" class="grid grid-cols-1 md:grid-cols-4 gap-6 items-start mt-6 w-full pb-8">
    <!-- Columns will be injected by JS -->
</div>
<!-- Empty State -->
<div id="emptyState" class="hidden flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-3xl border border-slate-100 w-full mt-6">
    <div class="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-400 mb-4">
        <span class="material-symbols-outlined text-4xl">inbox</span>
    </div>
    <h3 class="text-xl font-bold text-slate-900 mb-1">No leads yet!</h3>
    <p class="text-slate-500 max-w-sm">Lead requests, DMs, and outreach targets will appear here.</p>
</div>
`);

// 3. Add Modals
$('#gallerySection').before(`
<!-- New Lead Modal -->
<div id="newLeadModal" class="hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="text-xl font-bold">Add Manual Lead</h3>
            <button id="closeLeadModalBtn" class="text-slate-400 hover:text-red-500 transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="p-6 overflow-y-auto">
            <form id="newLeadForm" class="space-y-4">
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">First Name</label>
                        <input type="text" id="nlFirst" required class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm">
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Last Name</label>
                        <input type="text" id="nlLast" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm">
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Email / Handle</label>
                    <input type="text" id="nlEmail" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm">
                </div>
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Source</label>
                        <select id="nlSource" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm appearance-none">
                            <option>Instagram DM</option>
                            <option>Outreach</option>
                            <option>Email</option>
                            <option>Website</option>
                        </select>
                    </div>
                    <div>
                        <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Status</label>
                        <select id="nlStatus" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm appearance-none">
                            <option>New</option>
                            <option>Contacted</option>
                            <option>In Progress</option>
                            <option>Closed</option>
                        </select>
                    </div>
                </div>
                <div>
                    <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Description / Needs</label>
                    <textarea id="nlDesc" rows="3" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm"></textarea>
                </div>
                <button type="submit" id="saveNewLeadBtn" class="w-full bg-slate-900 hover:bg-primary text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-2">
                    Save Lead
                </button>
            </form>
        </div>
    </div>
</div>

<!-- Lead Details Modal -->
<div id="leadDetailsModal" class="hidden fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
        <div class="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
            <h3 class="text-xl font-bold">Lead Details</h3>
            <button id="closeLeadDetailsBtn" class="text-slate-400 hover:text-red-500 transition-colors">
                <span class="material-symbols-outlined">close</span>
            </button>
        </div>
        <div class="p-6 overflow-y-auto space-y-4">
            <div id="ldHeader" class="font-bold text-2xl text-slate-900 leading-tight">Name</div>
            <div class="flex gap-4 text-sm text-slate-500 pb-2 border-b border-slate-100 flex-wrap" id="ldSub">Contact</div>
            <div class="text-sm text-slate-700 whitespace-pre-wrap bg-slate-50 p-4 rounded-xl shadow-inner border border-slate-100" id="ldDesc">Desc</div>
            
            <div class="pt-4 space-y-3">
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">Update Pipeline Stage</label>
                <select id="ldStatus" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none font-bold appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23131313%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px_12px] bg-no-repeat bg-[position:calc(100%-1rem)_center]">
                    <option value="New">🔵 New</option>
                    <option value="Contacted">🟡 Contacted</option>
                    <option value="In Progress">🟣 In Progress</option>
                    <option value="Closed">⚪ Closed</option>
                </select>
                
                <label class="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-1 mt-4">CRM Notes</label>
                <textarea id="ldNotes" rows="4" class="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 focus:border-primary focus:ring-1 focus:ring-primary outline-none text-sm placeholder-slate-300" placeholder="E.g., Sent DM on Tuesday, waiting for reply..."></textarea>
            </div>
            <button id="saveLeadUpdatesBtn" data-id="" class="w-full bg-slate-900 hover:bg-primary text-white font-bold py-3 rounded-xl shadow-md transition-colors mt-4">
                Save Updates
            </button>
        </div>
    </div>
</div>
`);

// 4. Inject script logic
const scriptTags = $('script');
const mainScript = scriptTags.last();
let scriptContent = mainScript.html();

// Replace renderLeads function
const renderLeadsRegex = /function renderLeads\(leads\)\s*\{[\s\S]*?(?=async function fetchAdminGallery|\/\/ Apply filters locally)/;

const newRenderLeads = `
        function renderLeads(leads) {
            const board = document.getElementById('kanbanBoard');
            if(board) board.innerHTML = '';
            
            leadCount.textContent = \`\${leads.length} Total\`;

            if (leads.length === 0) {
                emptyState.classList.remove('hidden');
                if(board) board.classList.add('hidden');
                return;
            }

            emptyState.classList.add('hidden');
            if(board) board.classList.remove('hidden');

            const columns = [
                { id: 'New', title: '🔵 New', bg: 'bg-blue-50/50', border: 'border-blue-100' },
                { id: 'Contacted', title: '🟡 Contacted', bg: 'bg-yellow-50/50', border: 'border-yellow-100' },
                { id: 'In Progress', title: '🟣 In Progress', bg: 'bg-purple-50/50', border: 'border-purple-100' },
                { id: 'Closed', title: '⚪ Closed', bg: 'bg-slate-50', border: 'border-slate-200' }
            ];

            columns.forEach(col => {
                const colLeads = leads.filter(l => l.status === col.id || (!l.status && col.id === 'New'));
                
                let cardsHtml = colLeads.map(lead => {
                    const date = new Date(lead.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                    const sourceText = lead.source || 'Website';
                    const sourceBadge = \`<span class="bg-white border text-slate-500 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase">\${sourceText}</span>\`;
                    
                    return \`
                    <div class="bg-white p-4 rounded-[1.25rem] shadow-sm border border-slate-100 hover:border-primary/50 hover:shadow-md transition-all flex flex-col gap-3 group relative cursor-pointer" onclick="openLeadDetails(\${lead.id})">
                        <div class="flex justify-between items-start">
                            <div class="font-extrabold text-slate-900 leading-tight">\${lead.first_name} \${lead.last_name}</div>
                            <div class="text-[10px] text-slate-400 font-bold">#\${lead.id}</div>
                        </div>
                        <div class="flex gap-1.5 flex-wrap">
                            \${sourceBadge}
                            <span class="bg-slate-100 text-slate-600 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase truncate max-w-[100px]">\${lead.event_type}</span>
                        </div>
                        <p class="text-xs text-slate-500 line-clamp-2 leading-relaxed">\${lead.description || 'No description provided.'}</p>
                         \${lead.notes ? \`<div class="text-[10px] bg-yellow-50/50 text-yellow-800 p-1.5 rounded-md border border-yellow-100 line-clamp-1"><span class="font-bold">📝</span> \${lead.notes}</div>\` : ''}
                        <div class="flex justify-between items-center mt-auto pt-2 border-t border-slate-50">
                            <span class="text-[10px] text-slate-400 font-medium">\${date}</span>
                            <div class="text-[10px] font-bold text-primary flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                View <span class="material-symbols-outlined text-[12px]">arrow_forward</span>
                            </div>
                        </div>
                    </div>\`;
                }).join('');

                const colDiv = document.createElement('div');
                colDiv.className = \`flex flex-col gap-3 \${col.bg} p-3 rounded-[2rem] border \${col.border} min-h-[300px]\`;
                colDiv.innerHTML = \`
                    <div class="flex justify-between items-center px-2 mb-2">
                        <h3 class="font-extrabold text-slate-700 text-sm tracking-wide">\${col.title}</h3>
                        <span class="bg-white text-slate-500 text-xs font-bold px-2.5 py-1 rounded-full shadow-sm border border-slate-100">\${colLeads.length}</span>
                    </div>
                    <div class="flex flex-col gap-3 flex-1 overflow-y-auto max-h-[60vh] pb-4 px-1 custom-scrollbar">
                        \${cardsHtml}
                    </div>
                \`;
                if(board) board.appendChild(colDiv);
            });
        }
`;

// Insert modal logic at the end
const modalLogic = `
        // --- Modal Logic ---
        const newLeadModal = document.getElementById('newLeadModal');
        const newLeadBtn = document.getElementById('newLeadBtn');
        const closeLeadModalBtn = document.getElementById('closeLeadModalBtn');
        const newLeadForm = document.getElementById('newLeadForm');
        const saveNewLeadBtn = document.getElementById('saveNewLeadBtn');

        if(newLeadBtn) newLeadBtn.addEventListener('click', () => newLeadModal.classList.remove('hidden'));
        if(closeLeadModalBtn) closeLeadModalBtn.addEventListener('click', () => newLeadModal.classList.add('hidden'));

        if(newLeadForm) {
            newLeadForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                saveNewLeadBtn.textContent = 'Saving...';
                saveNewLeadBtn.disabled = true;
                
                const body = {
                    firstName: document.getElementById('nlFirst').value,
                    lastName: document.getElementById('nlLast').value,
                    email: document.getElementById('nlEmail').value,
                    source: document.getElementById('nlSource').value,
                    status: document.getElementById('nlStatus').value,
                    description: document.getElementById('nlDesc').value,
                    eventType: 'Direct Outreach/DM',
                    notes: ''
                };

                try {
                    const res = await fetch('/api/admin/leads', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
                        body: JSON.stringify(body)
                    });
                    if (res.ok) {
                        newLeadForm.reset();
                        newLeadModal.classList.add('hidden');
                        fetchLeads();
                    }
                } catch(e) { console.error(e); } finally {
                    saveNewLeadBtn.textContent = 'Save Lead';
                    saveNewLeadBtn.disabled = false;
                }
            });
        }

        const leadDetailsModal = document.getElementById('leadDetailsModal');
        const closeLeadDetailsBtn = document.getElementById('closeLeadDetailsBtn');
        const saveLeadUpdatesBtn = document.getElementById('saveLeadUpdatesBtn');

        if(closeLeadDetailsBtn) closeLeadDetailsBtn.addEventListener('click', () => leadDetailsModal.classList.add('hidden'));

        window.openLeadDetails = function(id) {
            const lead = allLeads.find(l => l.id === id);
            if(!lead) return;

            document.getElementById('ldHeader').textContent = \`\${lead.first_name} \${lead.last_name}\`;
            
            // Build sub header
            let sub = \`<div class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">mail</span> \${lead.email}</div>\`;
            sub += \`<div class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">source</span> \${lead.source || 'Website'}</div>\`;
            document.getElementById('ldSub').innerHTML = sub;
            
            document.getElementById('ldDesc').textContent = lead.description || 'No description provided.';
            document.getElementById('ldStatus').value = lead.status || 'New';
            document.getElementById('ldNotes').value = lead.notes || '';
            document.getElementById('saveLeadUpdatesBtn').setAttribute('data-id', id);

            leadDetailsModal.classList.remove('hidden');
        };

        if(saveLeadUpdatesBtn) {
            saveLeadUpdatesBtn.addEventListener('click', async (e) => {
                const id = e.target.getAttribute('data-id');
                const status = document.getElementById('ldStatus').value;
                const notes = document.getElementById('ldNotes').value;
                const btn = e.target;
                
                btn.textContent = 'Updating...';
                btn.disabled = true;

                try {
                    const res = await fetch(\`/api/admin/leads/\${id}\`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json', 'Authorization': authToken },
                        body: JSON.stringify({ status, notes })
                    });
                    
                    if(res.ok) {
                        leadDetailsModal.classList.add('hidden');
                        fetchLeads(); // Refresh board
                    }
                } catch(err) { console.error(err); } finally {
                    btn.textContent = 'Save Updates';
                    btn.disabled = false;
                }
            });
        }
`;

scriptContent = scriptContent.replace(renderLeadsRegex, newRenderLeads);

if (!scriptContent.includes('newLeadModal')) {
    scriptContent = scriptContent.replace('async function fetchAdminGallery', modalLogic + '\\n        async function fetchAdminGallery');
} else {
    // If we've run this before, find and replace the block
    // For safety, the above checks the first run.
}

mainScript.html(scriptContent);
fs.writeFileSync('./admin_dashboard.html', $.html());
console.log("Updated admin_dashboard.html");
