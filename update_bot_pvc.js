const fs = require('fs');
const path = require('path');

const directory = '.';
const newReplace = `// Material & Thickness logic
      if (lower.includes('material') || lower.includes('made of') || lower.includes('pvc') || lower.includes('thick') || lower.includes('mm')) {
         return "Our stock props are made from durable, premium 5mm expanded PVC with a matte finish to prevent glare. If you place a Custom Order, we upgrade that to extra-durable 8mm PVC!";
      }`;

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        const regex = /\/\/\s*Material\s*&\s*Thickness\s*logic[\s\S]*?return\s*"[^"]+";\s*\}/g;
        if (regex.test(content)) {
            content = content.replace(regex, newReplace);
            fs.writeFileSync(filePath, content);
            console.log(`Updated AI knowledge base in ${file}`);
        } else {
            console.log(`No match found in ${file}`);
        }
    }
});
