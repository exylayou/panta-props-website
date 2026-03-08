const fs = require('fs');
const path = require('path');

const directory = '.';

const replacementHTML = `<!-- AI Chat -->
    <a href="#" onclick="document.getElementById('toggle-ai-chat')?.click(); return false;" class="flex flex-col items-center gap-1 min-w-[64px] group">
      <span class="material-symbols-outlined text-[26px] text-slate-500 dark:text-slate-400 group-hover:text-primary transition-colors">smart_toy</span>
      <span class="text-[10px] font-bold text-slate-500 dark:text-slate-400 group-hover:text-primary">AI Chat</span>
    </a>`;

// The regex matches the Shop tab block, including varying whitespace
const regex = /<!--\s*Shop\s*-->\s*<a\s+href="stocked_shop_collection\.html"[^>]*>[\s\S]*?shopping_bag<\/span>\s*<span[^>]*>Shop<\/span>\s*<\/a>/g;

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf-8');

        if (regex.test(content)) {
            content = content.replace(regex, replacementHTML);
            fs.writeFileSync(filePath, content);
            console.log(`Replaced Shop tab with AI Chat in ${file}`);
        } else {
            console.log(`No match found in ${file}`);
        }
    }
});
