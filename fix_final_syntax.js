const fs = require('fs');

let html = fs.readFileSync('community_gallery.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

// Fix 1: The Toast Notification corrupted string (around line 584)
const toastSearch = 'const isError = type === \\'error\\';';
const toastTargetStart = html.indexOf('toast.className = `flex items-center gap-3', html.indexOf(toastSearch));
const toastTargetEnd = html.indexOf('          `;', toastTargetStart) + 12;

if (toastTargetStart !== -1 && toastTargetEnd !== -1) {
    const cleanToast = `toast.className = \`flex items-center gap-3 \${isError ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'} border px-6 py-4 rounded-xl shadow-lg shadow-black/5 transform transition-all duration-300 translate-x-12 opacity-0 font-bold\`;

          toast.innerHTML = \`
            <span class="material-symbols-outlined">\${isError ? 'error' : 'check_circle'}</span>
            <span>\${message}</span>
          \`;`;
    html = html.substring(0, toastTargetStart) + cleanToast + html.substring(toastTargetEnd);
    console.log("Fixed toast syntax.");
} else {
    console.log("Could not find toast syntax block.");
}

// Fix 2: The completely mangled AI Chat logic at the bottom (lines 880-940)
// This time I'll just replace the entire script block that holds this.
const badScriptStartString = `<script>
    // --- AI Widget Logic ---`;
const badScriptEndString = `  <!-- Toast Container -->`;

const badStart = html.indexOf(badScriptStartString);
const badEnd = html.indexOf(badScriptEndString);

const cleanScriptStart = indexHtml.indexOf(badScriptStartString);
const cleanScriptEnd = indexHtml.indexOf(`</body>`, cleanScriptStart);

if (badStart !== -1 && badEnd !== -1 && cleanScriptStart !== -1 && cleanScriptEnd !== -1) {
    const cleanScript = indexHtml.substring(cleanScriptStart, cleanScriptEnd);
    html = html.substring(0, badStart) + cleanScript + '\n' + html.substring(badEnd);
    console.log("Fixed AI script syntax.");
} else {
     console.log("Could not find AI script block.");
}

fs.writeFileSync('community_gallery.html', html);
console.log("Write complete.");

