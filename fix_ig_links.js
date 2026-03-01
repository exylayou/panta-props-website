const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir);

const oldLinks = [
    'https://www.instagram.com/pantaprops_/_/',
    'https://www.instagram.com/pantaprops_/'
];
const newLink = 'https://www.instagram.com/pantaprops_/_/';

files.forEach(file => {
    if (file.endsWith('.html') || file.endsWith('.js')) {
        const filePath = path.join(dir, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;

        oldLinks.forEach(oldLink => {
            // Use regex for global replace across the string
            const regex = new RegExp(oldLink.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');

            if (content.match(regex)) {
                content = content.replace(regex, newLink);
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated Instagram link in ${file}`);
        }
    }
});
