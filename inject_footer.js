const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const directory = '.';
const newFooterHtml = `
  <!-- Standard Global Footer -->
  <footer class="bg-[#1f1619] py-16 px-8 mt-auto w-full border-t border-[#312226]">
    <div class="max-w-[1200px] mx-auto flex flex-col md:flex-row justify-between gap-12 font-sans">
      <div class="flex flex-col gap-6 md:w-1/2">
        <!-- Logo -->
        <a href="index.html" class="flex items-center gap-2">
          <span class="material-symbols-outlined text-[#e81e62] text-2xl">camera</span>
          <div class="w-8 h-[2px] bg-[#e81e62]"></div>
          <span class="material-symbols-outlined text-[#e81e62] text-2xl">photo_camera</span>
          <span class="text-white font-bold text-3xl tracking-tight ml-2">Panta</span>
        </a>
        
        <!-- Descriptions -->
        <p class="text-[#a19598] text-lg max-w-md leading-relaxed mt-2">
          Ditch the flop. Premium, durable photo booth props<br/>
          designed for events that demand better.
        </p>

        <!-- Social Icons -->
        <div class="flex gap-4 mt-6">
          <a href="https://www.instagram.com/pantaprops_/_/" class="w-12 h-12 rounded-full bg-[#312328] flex items-center justify-center text-white hover:bg-[#e81e62] transition-colors">
            <span class="material-symbols-outlined text-[20px]">photo_camera</span>
          </a>
          <a href="https://youtube.com/@pantaprops" class="w-12 h-12 rounded-full bg-[#312328] flex items-center justify-center text-white hover:bg-[#e81e62] transition-colors">
            <span class="material-symbols-outlined text-[22px]">play_arrow</span>
          </a>
          <a href="contact.html" class="w-12 h-12 rounded-full bg-[#312328] flex items-center justify-center text-white hover:bg-[#e81e62] transition-colors">
            <span class="material-symbols-outlined text-[20px]">mail</span>
          </a>
        </div>
      </div>

      <!-- Right Side Columns -->
      <div class="flex flex-col sm:flex-row gap-10 sm:gap-20 md:gap-32 w-full md:w-auto mt-2">
        <div class="flex flex-col gap-5">
          <h4 class="text-white font-bold text-xl mb-2">Shop</h4>
          <a href="stocked_shop_collection.html" class="text-[#a19598] hover:text-white transition-colors">All Props</a>
          <a href="stocked_shop_collection.html?category=wedding" class="text-[#a19598] hover:text-white transition-colors">Wedding Sets</a>
          <a href="custom_services_landing.html" class="text-[#a19598] hover:text-white transition-colors">Corporate Events</a>
          <a href="custom_services_landing.html" class="text-[#a19598] hover:text-white transition-colors">Custom Orders</a>
        </div>
        <div class="flex flex-col gap-5">
          <h4 class="text-white font-bold text-xl mb-2">Company</h4>
          <a href="brand_story.html" class="text-[#a19598] hover:text-white transition-colors">Our Story</a>
          <a href="community_gallery.html" class="text-[#a19598] hover:text-white transition-colors">Community</a>
          <a href="brand_story.html#faq" class="text-[#a19598] hover:text-white transition-colors">FAQ</a>
          <a href="contact.html" class="text-[#a19598] hover:text-white transition-colors">Contact</a>
        </div>
      </div>
    </div>
  </footer>
`;

fs.readdirSync(directory).forEach(file => {
  if (file.endsWith('.html')) {
    const filePath = path.join(directory, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const $ = cheerio.load(content);

    let modified = false;

    // If there's an existing footer, replace it
    if ($('footer').length > 0) {
      $('footer').replaceWith(newFooterHtml);
      modified = true;
    } else {
      // Find body tag, insert before AI widget or at end of body
      if ($('#ai-chat-widget').length > 0) {
        $('#ai-chat-widget').before(newFooterHtml);
      } else {
        $('body').append(newFooterHtml);
      }
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(filePath, $.html());
      console.log(`Replaced footer in ${file}`);
    }
  }
});
