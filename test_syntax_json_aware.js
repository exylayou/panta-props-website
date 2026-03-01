const fs = require('fs');
const html = fs.readFileSync('community_gallery.html', 'utf8');

const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/g);
let allGood = true;

scripts.forEach((block, index) => {
    // Skip JSON-LD scripts
    if (block.includes('type="application/ld+json"')) {
        console.log(`Script block ${index} is JSON-LD. Skipping.`);
        return;
    }

    const code = block.replace(/<script[\s\S]*?>/,'').replace(/<\/script>/,'');
    try {
        new Function(code);
    } catch (e) {
        console.error(`Syntax error in script block ${index}:`, e.message);
        allGood = false;
    }
});

if(allGood) console.log("All Javascript blocks have valid syntax.");
