const fs = require('fs');

const indexHtml = fs.readFileSync('index.html', 'utf8');
const commHtml = fs.readFileSync('community_gallery.html', 'utf8');

const aiWidgetStart = '<!-- AI Chat Widget -->';
const aiWidgetEnd = '</body>';

const indexStart = indexHtml.indexOf(aiWidgetStart);
const indexEnd = indexHtml.indexOf(aiWidgetEnd, indexStart);
const cleanAiWidget = indexHtml.substring(indexStart, indexEnd);

const commStart = commHtml.indexOf(aiWidgetStart);
const commEnd = commHtml.indexOf(aiWidgetEnd, commStart);

if (commStart !== -1 && commEnd !== -1) {
    const newCommHtml = commHtml.substring(0, commStart) + cleanAiWidget + '\n\n  <!-- Toast Container -->\n  <div id="toast-container" class="fixed top-24 right-6 z-[300] flex flex-col gap-3 pointer-events-none"></div>\n\n' + commHtml.substring(commEnd);
    fs.writeFileSync('community_gallery.html', newCommHtml);
    console.log("Successfully replaced corrupted AI widget block.");
} else {
    console.log("Could not find bounds.");
}
