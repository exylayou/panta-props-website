const fs = require('fs');

const commHtml = fs.readFileSync('community_gallery.html', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');

const aiWidgetStart = '  <!-- AI Chat Widget -->';
const aiWidgetEnd = '</body>';

const indexStart = indexHtml.indexOf(aiWidgetStart);
const indexEnd = indexHtml.indexOf(aiWidgetEnd, indexStart);
const cleanAiWidget = indexHtml.substring(indexStart, indexEnd);

const commStart = commHtml.indexOf(aiWidgetStart);
const commEnd = commHtml.indexOf(aiWidgetEnd, commStart);

if (commStart !== -1 && commEnd !== -1) {
    const newCommHtml = commHtml.substring(0, commStart) + cleanAiWidget + '\n\n  <!-- Toast Container -->\n  <div id="toast-container" class="fixed top-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none"></div>\n\n' + '</body>\n</html>';
    fs.writeFileSync('community_gallery.html', newCommHtml);
    console.log("Successfully replaced corrupted AI widget block.");
} else {
    // try finding the start of the bad script block
    const fallbackStart = commHtml.indexOf('    // --- AI Widget Logic ---');
    if (fallbackStart !== -1) {
        // find the start of the enclosing script tag
        const realStart = commHtml.lastIndexOf('<script>', fallbackStart);
        const newCommHtml = commHtml.substring(0, realStart) + cleanAiWidget + '\n\n  <!-- Toast Container -->\n  <div id="toast-container" class="fixed top-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none"></div>\n\n' + '</body>\n</html>';
         fs.writeFileSync('community_gallery.html', newCommHtml);
         console.log("Successfully replaced corrupted AI widget block using fallback.");
    } else {
        console.log("Could not find bounds.");
    }
}
