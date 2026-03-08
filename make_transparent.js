const fs = require('fs');
const { execSync } = require('child_process');

try {
  execSync('npm list sharp || npm install sharp');
} catch (e) {
  execSync('npm install sharp');
}

const sharp = require('sharp');

const dir = '/home/oltonexeter/.gemini/antigravity/brain/adcd76bb-c0a6-4a11-b616-2c17bf27aad5/';
const files = [
    { in: 'category_celebration_1772895450041.png', out: 'uploads/demo_celebration.png' },
    { in: 'category_holiday_1772895462061.png', out: 'uploads/demo_holiday.png' },
    { in: 'category_corporate_1772895479978.png', out: 'uploads/demo_corporate.png' },
    { in: 'category_miscellaneous_1772895495132.png', out: 'uploads/demo_miscellaneous.png' }
];

async function processImages() {
    for (const file of files) {
        console.log(`Processing ${file.in}`);
        
        // Remove white background (flatten, threshold) and replace it with transparency 
        // This is a rough estimation trick, for true precise we'd need more complex ML, 
        // but since backgrounds are pure white, setting tolerance high usually creates a nice cutout
        try {
            await sharp(dir + file.in)
                 // This trims the surrounding whitespace and gives transparent bg if the edge is white
                 .trim({ threshold: 250, background: { r: 255, g: 255, b: 255, alpha: 0 } }) 
                 .png()
                 .toFile(file.out);
            console.log(`Saved ${file.out}`);
        } catch (e) {
            console.error(`Error processing ${file.in}:`, e);
        }
    }
}

processImages();
