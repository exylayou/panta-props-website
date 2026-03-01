const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directory = '.';

// Define which files are for "custom" items and which are "stock/general"
const customFiles = [
    'custom_services_landing.html',
    'refined_custom_inquiry_flow.html'
];

fs.readdirSync(directory).forEach(file => {
    if (file.endsWith('.html')) {
        const filePath = path.join(directory, file);
        let content = fs.readFileSync(filePath, 'utf-8');
        let modified = false;

        // General update for custom files: replace any instance of '5mm' with '8mm'
        if (customFiles.includes(file)) {
            if (content.includes('5mm')) {
                content = content.replace(/5mm/g, '8mm');
                modified = true;
            }
        }

        // For Stock/General pages (like index, brand_story, stocked_shop_collection, product_detail)
        // Ensure they still say 5mm for stock items, but if they reference custom, update those specific sections if any.
        // The grep results showed no specific "8mm" text exists, and mostly "5mm" is used generally.
        // We will keep 5mm in general files.
        else {
            // Check if there's any text in these general files that specifically says "custom... 5mm" we should change.
            // On index.html, the hero description for stock and custom needs updating as requested:
            // "update the hero description for stock and custom sections"

            if (file === 'index.html') {
                // Currently index.html says: "5mm Thick PVC" in the marquee.
                // Left Card: "Skip the wait. Browse our curated collection of high-end PVC props."
                // Right Card (Custom): "Your brand, your vibe. Custom designed and laser cut in 3 days."

                // Let's explicitly add the thickness
                if (content.includes('Browse our curated collection of high-end PVC props.')) {
                    content = content.replace(
                        'Browse our curated collection of high-end PVC props.',
                        'Browse our curated collection of high-end 5mm PVC props.'
                    );
                    modified = true;
                }

                if (content.includes('Custom designed and laser cut in 3 days.')) {
                    content = content.replace(
                        'Custom designed and laser cut in 3 days.',
                        'Custom designed from extra-durable 8mm PVC and laser cut in 3 days.'
                    );
                    modified = true;
                }
            }
        }

        if (modified) {
            fs.writeFileSync(filePath, content);
            console.log(`Updated material descriptions in ${file}`);
        }
    }
});
