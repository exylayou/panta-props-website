const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directory = '.';

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        let modified = false;

        // Find all navigation menu containers. Most screens have a div wrapping a elements, or a nav element.
        // The most common pattern here is: 
        // <div class="hidden md:flex items-center gap-8">
        //   <a>...</a> ...
        // </div>
        // or
        // <nav class="hidden md:flex gap-8">

        const navSelectors = [
            'nav .hidden.md\\:flex.items-center.gap-8',
            'nav.hidden.md\\:flex.gap-8',
            'header .hidden.md\\:flex.items-center.gap-8',
            'div.hidden.md\\:flex.items-center.gap-8'
        ];

        let navContainer = null;
        for (const selector of navSelectors) {
            const matches = $(selector);
            if (matches.length > 0) {
                // If there are multiple, usually the first one is the main top nav
                navContainer = $(matches[0]);
                break; // Found the standard top navigation container
            }
        }

        if (navContainer && navContainer.length > 0) {

            // We want to replace the inner HTML of the nav container with exactly the 4 requested links.
            // But we should try to preserve the styling of the first link if possible, or use a default.

            let linkClass = "text-sm font-bold text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-primary transition-colors";

            // Try to extract existing class from first link
            const firstA = navContainer.find('a').first();
            if (firstA.length > 0 && firstA.attr('class')) {
                linkClass = firstA.attr('class');
            }

            // Generate the exact 4 links the user asked for:
            // Shop Props (links to stock)
            // Custom Orders (links to custom)
            // Community (links to community gallery)
            // Our Story (links to brand story)

            const newNavHtml = `
                <a class="${linkClass}" href="stocked_shop_collection.html">Shop Props</a>
                <a class="${linkClass}" href="custom_services_landing.html">Custom Orders</a>
                <a class="${linkClass}" href="community_gallery.html">Community</a>
                <a class="${linkClass}" href="brand_story.html">Our Story</a>
            `;

            navContainer.html(newNavHtml);
            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, $.html());
            console.log(`Updated navigation menus in ${file}`);
        }
    }
});
