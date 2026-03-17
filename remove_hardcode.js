const fs = require('fs');

let html = fs.readFileSync('/home/oltonexeter/Panta Prop/product_detail_enhanced.html', 'utf8');

// Replace hardcoded title
html = html.replace(
    'The "Neon Party" Prop Set',
    ''
);

// Replace hardcoded reviews
html = html.replace(
    '4.9 (124 Reviews)',
    ''
);

// Replace hardcoded prices
html = html.replace(
    '<span class="text-4xl font-extrabold text-primary tracking-tight">$45.00</span>',
    '<span class="text-4xl font-extrabold text-primary tracking-tight"></span>'
);
html = html.replace(
    '<span class="text-lg font-bold text-muted line-through">$55.00</span>',
    '<span class="text-lg font-bold text-muted line-through" style="display:none;"></span>'
);

// Replace WhatsApp button price
html = html.replace(
    'Buy via WhatsApp - $45.00',
    'Buy via WhatsApp'
);

// Replace image sources
html = html.replace(
    /src="https:\/\/lh3\.googleusercontent\.com\/aida-public\/[^"]+"/g,
    'src=""'
);

// Replace description paragraphs
html = html.replace(
    /<p class="text-slate-600 leading-relaxed">[\s\S]*?<\/p>/,
    '<p class="text-slate-600 leading-relaxed"></p>'
);

// Replace details paragraph
html = html.replace(
    /<span class="text-secondary">✨ Most Popular:<\/span> Includes 5 high-def props: "Party", "Cheers", "Oh Baby", Glasses, Lips/,
    ''
);

// Replace Best Seller Badge
html = html.replace(
    /<span class="inline-flex items-center rounded-full bg-\[#FFD166\] px-3 py-1 text-xs font-bold text-slate-900 shadow-sm font-display">[\s\S]*?<\/span>/,
    '<span class="inline-flex items-center rounded-full px-3 py-1 text-xs font-bold shadow-sm font-display" style="display:none;"></span>'
);

fs.writeFileSync('/home/oltonexeter/Panta Prop/product_detail_enhanced.html', html);
console.log("Hardcoded content removed.");
