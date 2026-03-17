const fs = require('fs');
let html = fs.readFileSync('stocked_shop_collection.html', 'utf8');

const replacements = [
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=funny_age_set'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=birthday_king_set'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=birthday_queen_set'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=neon_party_set'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=speech_bubble_pack'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=team_bride_groom'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=retro_sunglasses'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=mustache_on_stick'" },
  { old: "window.location.href='product_detail_enhanced.html'", new: "window.location.href='product_detail_enhanced.html?id=level_up_sign'" }
];

let currentIndex = 0;
html = html.replace(/window\.location\.href='product_detail_enhanced\.html'/g, (match) => {
  if (currentIndex < replacements.length) {
    const res = replacements[currentIndex].new;
    currentIndex++;
    return res;
  }
  return match;
});

fs.writeFileSync('stocked_shop_collection.html', html);
