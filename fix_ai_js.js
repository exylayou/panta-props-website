const fs = require('fs');

const commHtml = fs.readFileSync('community_gallery.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const aiWidgetStart = '  <!-- AI Chat Widget -->';
const aiWidgetEnd = '</body>';

const indexStart = indexHtml.indexOf(aiWidgetStart);
const indexEnd = indexHtml.indexOf(aiWidgetEnd, indexStart);
const cleanAiWidget = indexHtml.substring(indexStart, indexEnd);

// Find the start of the bad script block
const fallbackStart = commHtml.indexOf('    // --- AI Widget Logic ---');
if (fallbackStart !== -1) {
    // find the start of the enclosing HTML comment
    const realStart = commHtml.lastIndexOf('  <!-- AI Chat Widget -->', fallbackStart);
    // find the real end (before toast or body)
    const realEnd = commHtml.lastIndexOf('</body>');
    
    // Safety check - verify realStart is reasonable
    if (realStart > 0 && realStart < fallbackStart) {
        const newCommHtml = commHtml.substring(0, realStart) + cleanAiWidget + '\n\n  <!-- Toast Container -->\n  <div id="toast-container" class="fixed top-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none"></div>\n\n' + '</body>\n</html>';
        fs.writeFileSync('community_gallery.html', newCommHtml);
        console.log("Re-injected clean AI Chat block.");
    } else {
        console.log("Fallback search boundaries invalid.");
    }
} else {
    console.log("Could not find bad AI logic comment.");
}
