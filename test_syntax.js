const fs = require('fs');
const html = fs.readFileSync('community_gallery.html', 'utf8');

// The best way to check for trailing script errors without jsdom locally is 
// ensuring the `<script>` blocks parse correctly.
const scripts = html.match(/<script[\s\S]*?>([\s\S]*?)<\/script>/g);
let allGood = true;

scripts.forEach((block, index) => {
    const code = block.replace(/<script[\s\S]*?>/,'').replace(/<\/script>/,'');
    try {
        new Function(code);
    } catch (e) {
        console.error(`Syntax error in script block ${index}:`, e.message);
        allGood = false;
    }
});

if(allGood) console.log("All script blocks have valid javascript syntax.");
