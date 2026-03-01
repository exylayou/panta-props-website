const fs = require('fs');
const path = require('path');

const filePath = path.join('.', 'community_gallery.html');
let content = fs.readFileSync(filePath, 'utf-8');

const regex = /items\.forEach\(item => \{[\s\S]*?\}\);/g;
const replacement = `items.forEach(item => {
                const subNode = item.querySelector('span.text-sm');
                const pNode = item.querySelector('p.font-bold');
                
                let matchText = "";
                if(subNode) matchText += subNode.textContent.toLowerCase();
                if(pNode) matchText += pNode.textContent.toLowerCase();
                
                if (filterText === 'all') {
                    item.style.display = 'block';
                } else if (matchText.includes(filterText) || (filterText === 'parties' && matchText.includes('party')) || (filterText === 'weddings' && matchText.includes('wedding'))) {
                    item.style.display = 'block';
                } else {
                    item.style.display = 'none';
                }
              });`;

if (content.match(regex)) {
    content = content.replace(regex, replacement);
    fs.writeFileSync(filePath, content);
    console.log('Fixed Filter Logic inner loop');
} else {
    console.log('Regex did not match');
}
