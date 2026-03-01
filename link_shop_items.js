const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directory = '.';
const filePath = path.join(directory, 'stocked_shop_collection.html');

let content = fs.readFileSync(filePath, 'utf-8');
const $ = cheerio.load(content);
let modified = false;

// Find all the product cards on the shop page.
// The structure is: <div class="group relative bg-surface rounded-2xl shadow-float...">
// We can find them by looking inside the product grid
const cards = $('.grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-3.gap-8 > div.group.relative');

cards.each((i, elem) => {
    const card = $(elem);

    // Check if it already has an onclick or is an 'A' tag
    if (card[0].name !== 'a' && !card.attr('onclick')) {
        // Add cursor-pointer and onclick to redirect to the product detail page
        let classes = card.attr('class') || '';
        if (!classes.includes('cursor-pointer')) {
            card.attr('class', classes + ' cursor-pointer');
        }

        // We link all items to product_detail_enhanced.html for the demo
        card.attr('onclick', "window.location.href='product_detail_enhanced.html'");
        modified = true;
    }
});

// We also need to fix the internal "Buy Now" or similar buttons inside the card if they exist, 
// so they don't break the outer click or they just bubble up. 
// However, an outer onclick on a div works well for a general card click. 
// Just ensuring the Whatsapp float button doesn't trigger the page navigation:
const whatsappButtons = $('.bg-whatsapp');
whatsappButtons.each((i, btn) => {
    const button = $(btn);
    // Add event.stopPropagation() so clicking the Whatsapp button doesn't trigger the card's onclick
    if (!button.attr('onclick') || !button.attr('onclick').includes('stopPropagation')) {
        let currentClick = button.attr('onclick') || "window.location.href='https://wa.me/?text=Hi%20Panta!'";
        button.attr('onclick', `event.stopPropagation(); ${currentClick}`);
        modified = true;
    }
});


if (modified) {
    fs.writeFileSync(filePath, $.html());
    console.log('Successfully linked shop items to detail pages.');
} else {
    console.log('No modifications needed or already linked.');
}
