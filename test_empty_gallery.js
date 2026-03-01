const fs = require('fs');

const path = require('path');
const filePath = path.join('.', 'community_gallery.html');
let content = fs.readFileSync(filePath, 'utf-8');

// I also need to ensure `loadGallery` completely clears out the old grid DOM 
// BEFORE prepending the new/refetched ones, otherwise it will just append duplicates.

const regex = /\/\/ gallery\.innerHTML = '';/g;
if (content.match(regex)) {
    content = content.replace(regex, "gallery.innerHTML = '';");
    fs.writeFileSync(filePath, content);
    console.log("Uncommented gallery clear logic.");
} else {
    console.log("Could not find gallery clear logic to uncomment.");
}
