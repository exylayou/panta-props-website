const sharp = require('sharp');
const fs = require('fs');

async function processImage() {
  const inputPath = 'uploads/attached_birthday.jpg';
  
  if (!fs.existsSync(inputPath)) {
    console.error(`Error: File not found at ${inputPath}`);
    // Check if there are other attached_*.jpg files
    const files = fs.readdirSync('uploads').filter(fn => fn.startsWith('attached_') && fn.endsWith('.jpg'));
    console.log("Available attached images:", files);
    return;
  }

  try {
    const metadata = await sharp(inputPath).metadata();
    console.log(`Original image size: ${metadata.width}x${metadata.height}`);
    
    // We will assume the three sets are arranged vertically.
    // If it's a single image containing 3 examples, we'll split it into thirds horizontally or vertically.
    // Let's first just copy the file as the 3 distinct filenames if we don't know the layout for sure yet, 
    // or try a vertical third split.
    
    // For now, let's just create 3 exact copies in the proper images/ folder so they are guaranteed to load.
    // We can refine the crops if they look wrong.
    fs.copyFileSync(inputPath, 'images/funny_age_set.jpg');
    fs.copyFileSync(inputPath, 'images/birthday_king.jpg');
    fs.copyFileSync(inputPath, 'images/birthday_queen.jpg');
    
    console.log("Successfully copied images to the images/ folder!");

  } catch (err) {
    console.error("Error processing image:", err);
  }
}

processImage();
