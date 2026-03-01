const fs = require('fs');
const html = fs.readFileSync('community_gallery.html', 'utf8');
const scripts = [...html.matchAll(/<script[\s\S]*?>([\s\S]*?)<\/script>/g)];

scripts.forEach((match, index) => {
    fs.writeFileSync(`script_${index}.js`, match[1]);
});
