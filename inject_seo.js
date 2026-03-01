const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const seoData = {
    'index.html': {
        title: 'Panta Props | Premium PVC Photo Booth Props',
        description: 'Ditch the flop. Shop premium, durable 5mm PVC photo booth props or order custom 8mm PVC designs. Waterproof, anti-glare, and made for high-end events.',
    },
    'stocked_shop_collection.html': {
        title: 'Shop Props | High-End 5mm PVC Props - Panta Props',
        description: 'Browse our curated collection of ready-to-ship, high-end 5mm PVC photo booth props for weddings, parties, and corporate events. Waterproof and anti-glare.',
    },
    'custom_services_landing.html': {
        title: 'Custom Photo Booth Props | Bespoke 8mm PVC - Panta Props',
        description: 'Start your custom order today. We design and laser-cut bespoke photo booth props from extra-durable 8mm PVC, shipped in just 3 days. Your brand, your vibe.',
    },
    'brand_story.html': {
        title: 'Our Story & FAQ | Panta Props',
        description: 'Learn the story behind Panta Props. We create premium, indestructible photo booth props for events that demand better than floppy cardboard. Read our FAQ.',
    },
    'community_gallery.html': {
        title: 'Community Gallery | Real Events with Panta Props',
        description: 'See how our premium PVC photo booth props pop at real events. Get inspired by our community gallery featuring weddings, birthdays, and corporate events.',
    }
};

const commonSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Panta Props",
    "url": "https://pantaprops.com",
    "logo": "https://pantaprops.com/logo.png",
    "description": "Premium, durable 5mm and 8mm PVC photo booth props. No more floppy cardboard. Waterproof, anti-glare, and custom designed.",
    "contactPoint": {
        "@type": "ContactPoint",
        "email": "hello@pantaprops.com",
        "contactType": "customer service"
    },
    "sameAs": [
        "https://www.instagram.com/pantaprops_/_/",
        "https://youtube.com/@pantaprops"
    ]
};

const schemaString = JSON.stringify(commonSchema, null, 2);

fs.readdirSync('.').forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join('.', file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const $ = cheerio.load(content);
        let modified = false;

        if (file === 'admin_dashboard.html') {
            // Add noindex for admin pages to keep them permanently out of search engines
            if ($('meta[name="robots"]').length === 0) {
                $('head').append('\n  <meta name="robots" content="noindex, nofollow">');
                modified = true;
            }
        } else if (seoData[file]) {
            const data = seoData[file];

            // 1. Update Title tag
            const titleEl = $('title');
            if (titleEl.length > 0) {
                titleEl.text(data.title);
            } else {
                $('head').append(`\n  <title>${data.title}</title>`);
            }

            // 2. Update Meta Description
            let descEl = $('meta[name="description"]');
            if (descEl.length > 0) {
                descEl.attr('content', data.description);
            } else {
                $('head').append(`\n  <meta name="description" content="${data.description}">`);
            }

            // 3. Add Generic Meta Keywords just in case
            let keywordsEl = $('meta[name="keywords"]');
            if (keywordsEl.length === 0) {
                $('head').append(`\n  <meta name="keywords" content="photo booth props, custom props, PVC props, event props, wedding props, party props, durable props">`);
            }

            // 4. Inject Structured Content (JSON-LD) for LLMs
            $('script[type="application/ld+json"]').remove();
            $('head').append(`\n  <script type="application/ld+json">\n${schemaString}\n  </script>`);

            modified = true;
        }

        if (modified) {
            fs.writeFileSync(filePath, $.html());
            console.log(`Successfully injected SEO metadata into ${file}`);
        }
    }
});
