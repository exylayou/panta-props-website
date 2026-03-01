const fs = require('fs');
const path = require('path');

const directory = '.';
const filePath = path.join(directory, 'index.html');

let content = fs.readFileSync(filePath, 'utf-8');
let modified = false;

// Stock left card
if (content.includes('Browse our curated collection of high-end\n            PVC props.')) {
    content = content.replace(
        'Browse our curated collection of high-end\n            PVC props.',
        'Browse our curated collection of high-end\n            5mm PVC props.'
    );
    modified = true;
}

// Custom right card
if (content.includes('Your brand, your vibe. Custom designed and laser cut in\n            3 days.')) {
    content = content.replace(
        'Your brand, your vibe. Custom designed and laser cut in\n            3 days.',
        'Your brand, your vibe. Custom designed from extra-durable 8mm PVC and laser cut in\n            3 days.'
    );
    modified = true;
}

if (modified) {
    fs.writeFileSync(filePath, content);
    console.log(`Updated material descriptions in index.html`);
} else {
    console.log(`No exact matches found for replace in index.html`);
}
