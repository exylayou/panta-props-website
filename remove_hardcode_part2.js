const fs = require('fs');

let html = fs.readFileSync('/home/oltonexeter/Panta Prop/product_detail_enhanced.html', 'utf8');

// Replace remaining Neon Party occurrences (like breadcrumbs)
html = html.replace(
    '<span class="text-slate-900 font-bold font-display">Neon Party Set</span>',
    '<span class="text-slate-900 font-bold font-display"></span>'
);

// We need to make sure the H1 is also caught if the first replace missed it
html = html.replace(
    '<h1 class="text-3xl md:text-4xl font-extrabold text-[#1b0e13] leading-[1.1] mb-3 font-display">\n                                \n                            </h1>',
    '<h1 class="text-3xl md:text-4xl font-extrabold text-[#1b0e13] leading-[1.1] mb-3 font-display" id="product-title-h1"></h1>'
);
if (!html.includes('id="product-title-h1"')) {
    html = html.replace(
        /<h1[^>]*>[\s\S]*?<\/h1>/,
        '<h1 class="text-3xl md:text-4xl font-extrabold text-[#1b0e13] leading-[1.1] mb-3 font-display" id="product-title-h1"></h1>'
    );
}

fs.writeFileSync('/home/oltonexeter/Panta Prop/product_detail_enhanced.html', html);
console.log("Remaining hardcoded content removed.");
