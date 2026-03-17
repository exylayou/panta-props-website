const fs = require('fs');

let html = fs.readFileSync('/home/oltonexeter/Panta Prop/product_detail_enhanced.html', 'utf8');

// The original JS script relied on searching for text "Neon Party" which we just deleted.
// We need to update the JS to select elements based on classes or structure since the text is now empty.

// Titles
html = html.replace(
    /const titles = document\.querySelectorAll\("h1"\);\s+titles\.forEach\(t => {\s+if \(t\.textContent\.includes\("Neon Party"\)\) t\.textContent = product\.title;\s+}\);/g,
    'const titles = document.querySelectorAll("h1#product-title-h1"); if(titles.length) titles[0].textContent = product.title;'
);

// Breadcrumbs
html = html.replace(
    /const breadcrumb = document\.querySelectorAll\("nav span\.text-slate-900"\);\s+breadcrumb\.forEach\(b => {\s+if \(b\.textContent\.includes\("Neon Party"\)\) b\.textContent = product\.title;\s+}\);/g,
    'const breadcrumb = document.querySelectorAll("nav span.text-slate-900"); if(breadcrumb.length) breadcrumb[0].textContent = product.title;'
);

fs.writeFileSync('/home/oltonexeter/Panta Prop/product_detail_enhanced.html', html);
console.log("JS Selectors updated to handle empty initial text.");
