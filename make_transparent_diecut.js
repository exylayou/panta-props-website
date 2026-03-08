const fs = require('fs');
const sharp = require('sharp');

const dir = '/home/oltonexeter/.gemini/antigravity/brain/adcd76bb-c0a6-4a11-b616-2c17bf27aad5/';
const files = [
    { in: 'diecut_celebration_1772896019746.png', out: 'uploads/demo_diecut_celebration.png' },
    { in: 'diecut_holiday_1772896038550.png', out: 'uploads/demo_diecut_holiday.png' },
    { in: 'diecut_corporate_1772896058895.png', out: 'uploads/demo_diecut_corporate.png' },
    { in: 'diecut_miscellaneous_1772896074139.png', out: 'uploads/demo_diecut_miscellaneous.png' }
];

async function processImages() {
    for (const file of files) {
        console.log(`Processing ${file.in}`);
        try {
            await sharp(dir + file.in)
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
