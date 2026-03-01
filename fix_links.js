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

        $('a[href="#"], a[href=""]').each((_, a_tag) => {
            const $a = $(a_tag);
            const text = $a.text().trim().toLowerCase();
            const html = $a.html().toLowerCase();

            if (text.includes('shop stock') || text.includes('shop') || text.includes('view all') || text.includes('buy') || html.includes('wedding') || html.includes('corporate') || html.includes('parties') || html.includes('holiday')) {
                $a.attr('href', 'stocked_shop_collection.html');
                modified = true;
            } else if (text.includes('custom design') || text.includes('custom order') || html.includes('custom')) {
                $a.attr('href', 'custom_services_landing.html');
                modified = true;
            } else if (text.includes('about') || text.includes('our story') || text.includes('brand story')) {
                $a.attr('href', 'brand_story.html');
                modified = true;
            } else if (text.includes('stories') || text.includes('community') || html.includes('community')) {
                $a.attr('href', 'community_gallery.html');
                modified = true;
            } else if (text.includes('panta props')) {
                $a.attr('href', 'index.html');
                modified = true;
            } else if (html.includes('public')) {
                $a.attr('href', 'https://twitter.com/pantaprops');
                modified = true;
            } else if (html.includes('photo_camera')) {
                $a.attr('href', 'https://www.instagram.com/pantaprops_/_/');
                modified = true;
            } else if (html.includes('mail')) {
                $a.attr('href', 'mailto:hello@pantaprops.com');
                modified = true;
            } else {
                // Default fallback for any unhandled empty links, like the shop by vibe cards
                $a.attr('href', 'stocked_shop_collection.html');
                modified = true;
            }
        });

        // Convert buttons to have onclick events
        $('button').each((_, btn) => {
            const $btn = $(btn);
            const text = $btn.text().trim().toLowerCase();
            const html = $btn.html().toLowerCase();

            if (text.includes('browse stock') || text.includes('shop')) {
                $btn.attr('onclick', "window.location.href='stocked_shop_collection.html'");
                modified = true;
            } else if (text.includes('start custom order') || text.includes('custom')) {
                $btn.attr('onclick', "window.location.href='custom_services_landing.html'");
                modified = true;
            } else if (text.includes('whatsapp') || html.includes('chat')) {
                $btn.attr('onclick', "window.location.href='https://wa.me/?text=Hi%20Panta!'");
                modified = true;
            }
        });

        // Some large div cards act as buttons in index.html, we can make them clickable too.
        $('.hero-card').each((_, card) => {
            const $card = $(card);
            const text = $card.text().toLowerCase();
            if (text.includes('shop the drop')) {
                $card.attr('onclick', "window.location.href='stocked_shop_collection.html'");
                modified = true;
            } else if (text.includes('make it yours')) {
                $card.attr('onclick', "window.location.href='custom_services_landing.html'");
                modified = true;
            }
        });

        if (modified) {
            fs.writeFileSync(filePath, $.html());
            console.log(`Updated more links and buttons in ${file}`);
        }
    }
});
