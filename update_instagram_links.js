const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir);

files.forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;

        // Ensure all instagram links open in a new tab smoothly
        const instagramRegex = /<a[^>]*href=["']https?:\/\/(www\.)?instagram\.com[^"']*["'][^>]*>/gi;

        content = content.replace(instagramRegex, (match) => {
            if (!match.includes('target=')) {
                modified = true;
                return match.replace('>', ' target="_blank">');
            }
            return match;
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated Instagram links in ${file} to open in new tab`);
        }
    }
});
