const fs = require('fs');
const path = require('path');

const targetFiles = [
    'index.html',
    'stocked_shop_collection.html',
    'custom_services_landing.html',
    'brand_story.html',
    'community_gallery.html'
];

// The old text to find
const oldSearch = `// Material & Thickness logic
        if (lower.includes('material') || lower.includes('made of') || lower.includes('pvc') || lower.includes('thick') || lower.includes('mm')) {
          return "Our stock props are made from durable, premium 5mm expanded PVC with a matte finish to prevent glare. If you place a Custom Order, we upgrade that to extra-durable 8mm PVC!";
        }`;

// The new replacement text
const newReplace = `// Material & Thickness logic
        if (lower.includes('material') || lower.includes('made of') || lower.includes('pvc') || lower.includes('thick') || lower.includes('mm')) {
          return "Both our Stock and Custom props are cut from maximum-durability, premium 8mm expanded PVC with a matte finish to prevent glare!";
        }`;

targetFiles.forEach(file => {
    const filePath = path.join('.', file);
    if (fs.existsSync(filePath)) {
        let content = fs.readFileSync(filePath, 'utf-8');

        if (content.includes(oldSearch)) {
            content = content.replace(oldSearch, newReplace);
            fs.writeFileSync(filePath, content);
            console.log(`Updated AI knowledge base in ${file}`);
        } else {
            // Try a more flexible regex if the exact spacing above fails
            const fallbackRegex = /\/\/ Material & Thickness logic[\s\S]*?return ".*5mm.*8mm.*";[\s\S]*?\}/;
            if (fallbackRegex.test(content)) {
                content = content.replace(fallbackRegex, newReplace);
                fs.writeFileSync(filePath, content);
                console.log(`Updated AI knowledge base via Regex in ${file}`);
            } else {
                console.log(`Could not find old text in ${file}`);
            }
        }
    }
});
