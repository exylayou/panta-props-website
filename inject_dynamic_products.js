const fs = require('fs');
let html = fs.readFileSync('product_detail_enhanced.html', 'utf8');

// Hide main content initially to prevent flashing
html = html.replace('<main class="flex-grow layout-container max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8">', '<main id="main-product-content" style="opacity: 0; transition: opacity 0.2s ease-in-out;" class="flex-grow layout-container max-w-[1200px] mx-auto w-full px-4 md:px-10 py-8">');

const dynamicScript = `
<script id="dynamic-product-script">
  const products = {
    'funny_age_set': {
      title: 'Funny Age Set (10 Props)',
      price: '$45.00',
      oldPrice: '',
      images: ['images/funny_age_set.jpg', 'images/funny_age_set.jpg'],
      desc: 'Ditch the flimsy paper props. The Funny Age Set is built from premium 5mm PVC that feels as good as it looks. Featuring vibrant UV-printed gradients that pop on camera without the glare.',
      bundleDesc: 'Includes 10 double-sided props.',
      badge: 'New'
    },
    'birthday_king_set': {
      title: 'Birthday King Set (10 Props)',
      price: '$45.00',
      oldPrice: '',
      images: ['images/birthday_king.jpg', 'images/birthday_king.jpg'],
      desc: 'Ditch the flimsy paper props. The Birthday King Set is built from premium 5mm PVC that feels as good as it looks. Featuring vibrant UV-printed gradients that pop on camera without the glare.',
      bundleDesc: 'Includes 10 double-sided props.',
      badge: 'New'
    },
    'birthday_queen_set': {
      title: 'Birthday Queen Set (10 Props)',
      price: '$45.00',
      oldPrice: '',
      images: ['images/birthday_queen.jpg', 'images/birthday_queen.jpg'],
      desc: 'Ditch the flimsy paper props. The Birthday Queen Set is built from premium 5mm PVC that feels as good as it looks. Featuring vibrant UV-printed gradients that pop on camera without the glare.',
      bundleDesc: 'Includes 10 double-sided props.',
      badge: 'New'
    },
    'neon_party_set': {
      title: 'The "Neon Party" Prop Set',
      price: '$45.00',
      oldPrice: '$55.00',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCja-lIkhqC8AtPsRUfcnHq-hIFq8J1aXYFgr63GnABkZV2bD4f9_650wxRmG4bcG9MpU6bCn20ZLpEHyz-GREL_xlqCvFlr8L2R1f5bNGY1ukKpoQ63GCGlZpAjwCdwGgxg_IvMtfeQorAy3DzYv6s7zuKcKgWmtPHLfbJHjgbYkJFf5kqhK0elDysVwrmGrA6cUsP1mECO69FaQJh0pUolCbNybzQivmSY8haV9Wogj5tp6SlJTpnQAu2lq6tPVv1nlweDJ1O4uM',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDAYOUTpeujQ5KQW8R8DE4z08FDM55urPAapQfAtSrMy4wmIDwXGvd2aZst3q3vfkDjuWRaS_hVdc41nJPDQkNmsHoJQ9eHDpQn3YUUGbCfm-UZ06MCbFOgYZ7PQF0daZYaZa1SiNXzbeVmr6Ig4OmPPANyAGNjEedKI0G2_D_Wf6M_SOpz3oyITa8YQAtQw6ywXSeErzsyoZ2FbyFIcMATLrsWSSam0M5whu4JQErLxCU_Mo4jRkYWW57uF2LduBPQMg0Rrcb_xs4',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAuA32IEL3UuSNTv49sT9oglTtKIeNYCAqMwFce7Fj_92JoOfYLqAsRCNZQbVPzJsmH0Ylh9NqhdejJQLjMp-g6-imKsFii8Szi9M4QIL_9lXI3M71RZeq7gKx81uu7zKG9GDX9spNwNWFlN4zWcCspzZ2C2JrCiBC8qc8sF5pxtbwfz4wxXUhFtGKbed-z4sg5OhsPvOasVUHS4Xrb-YElPf1mEIyOajyakQAt802TfmrcMX6hfxqSaUZMu5lVwHdRY9-ZRV3O3XY'
      ],
      desc: 'Ditch the flimsy paper props. The Neon Party Set is built from premium 5mm PVC that feels as good as it looks. Featuring vibrant UV-printed gradients that pop on camera without the glare.',
      bundleDesc: 'Includes 5 props: "Party", "Cheers", "Oh Baby", Glasses, Lips',
      badge: 'Best Seller'
    },
    'speech_bubble_pack': {
      title: 'Speech Bubble Pack',
      price: '$25.00',
      oldPrice: '',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBWN3CkA7IKKjFCebgQnOzhMDl9GQzJB4kPw-cNhc5xleAb44JSJ_bd11ApGNfIftc0xlarvzrBEBef11wtwtqbsGw463cI-3oyD5xf849Odev3vXOFeLaEHAfIZhIgGlxIRKDUl4lnzzLqb2Q1BGSlm7b8zVvT_p3UHyEYIwD9aOl97LJksVrVidReNJpGgRRK3i6GiTXvS6knubvTM3BHzUCFyiuIbJShBXZGoFoh1xBz5dDpzcDTqyXM1QXMOo_ZxVmeFZrSk-4',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDJDE5idqEATYqWAFwuzylbtgOpdzQPcIqpDIeMYjN040hXXbbYcdlvL0VunG71dms7cehOMdUv4ghQJHi80gV1qUntyjoZP6MYHTp3Zu5ArReq1KqrJnExoE4AldlnejIZoa6GId2JyxA6GE_JE9ht8Vq73HGsfesQqzoNwrZANyF8sMlufyAkZVTLU5emUpAkSeE9-SrB8rvZftJcj24NnzydpjKmROretji5n0K2uJa4kAj16VUQ_yWoP2vySuyCwFL1NV3N99E'
      ],
      desc: 'Let your guests do the talking. The Speech Bubble Pack features double-sided prompts made from premium 5mm PVC.',
      bundleDesc: 'Includes multiple fun and interactive speech bubbles.',
      badge: ''
    },
    'team_bride_groom': {
      title: 'Team Bride/Groom',
      price: '$30.00',
      oldPrice: '',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDXOzTBREJmzxdlKfWaVj_ImEvxYHwk-qGyW8eAvOikaTQrg25809WBYt0ERGIHulIczOhAy4wV9nQSeUlPA2VU9Gzrrl5fppST8vvDkk3ZMjk11Fu6ZNdHlU6UXhaPK_-f7_0TZz_llMwTYUsv1cS45FEO9LPbHwB-xmNKKBqPTFZFS2CTehh7V42oYB9sJJsCp4HudImwou09SXBmpIj05lHtYtOv0umqJBehMWad2wWg-5e7l8WAYKj7Bc7XHcLuS4sZbnVPx94',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuB5BZRH3ecN1TEMruv0wERI3_FGM2ssyLY_A9deE-stWYKKxs9tmnpOMY1Ov_q4tow8LvzmnrvJoNt6gXlYflrikNkt_fuzGKtALql0GstmDmQ7lmoK5mzRXXz4vFg9jc25BMIMc0aCKjCVw6OgUF0PS3nqvAz6jutVWHWHOUfV9CBVBFAOmobVMA65-EzFwtPi5yAlD1DF4pUfhZex-BGwqs5doE959rATbV9JfY8HMHqiZCF2Ftf_BCP6_VND5mVZQs-hGhBT8EY'
      ],
      desc: 'Perfect for weddings and bridal showers. The Team Bride/Groom pack adds that unique touch to your photo booth with durable 5mm PVC props.',
      bundleDesc: 'Includes sunglasses and elegant signage props.',
      badge: 'Best Seller'
    },
    'retro_sunglasses': {
      title: 'Retro Sunglasses',
      price: '$18.00',
      oldPrice: '',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuChjdDKo0Gbq84FaiIxUbbeHTYnajqUCFqPXYy_3r4wL9EM5WsRyogNg05nYAkq1biSyupqxjnfMEERz1byfHVvkRKEKBKqig6DRDSUQytcU-xUXwv9pVJjwl6zTsGe_4g6EY5UFwBTZt_GpIsC1OqgPdUT97i_cOLNoxXaz0ZpjqOMgs6JzvGbBE4I-Lh9gLDH-u2YcM_IDLwcdrPvPRRptwfWkhgFhK-nkJgfVov3kSOv4TRkUKX8eUbH5FyO0RVgv26Hy5SNIFI',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDLQt_MRXDdbPWKj97Z-3P-WvXWZfwpT7RZZhvaAHjhjQm3pZBRh3B7jdMkDr-YI56FtrBSPIE9nmKpEe-oVbJpzeMA3kvf8hdNQ57g2Qr_0i8QfLcnReHp-9xQtF3qDXki0Vp1zYfbx2fDK37uNX_G3CzJ3EJjEumxBIPvaQVKjxPaph8mzoP86PNAYxlBy9TjwfS7yfO-sgR64cMKBVQ5noT7TY02aCAE_ljQdUS8FFi4mlmFUVoWWWLHqjEVyA5BhLzzW5lrxkE'
      ],
      desc: 'Bring back the classics with these oversized retro sunglasses. Thick 5mm PVC ensures they survive any wild party.',
      bundleDesc: 'Includes 1 oversized prop.',
      badge: ''
    },
    'mustache_on_stick': {
      title: 'Mustache on Stick',
      price: '$12.00',
      oldPrice: '',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCGIxDL9ijTXaRP1bc5hrznK4qJPXP_B7ThLoLHJZmaMKZMUxzQoNh7_m3rXFCs3i5fLpDOntyzQXkeM_C8sQIPObTtCka14FtH2gYRVykY68G0mGaHgMH_Fhw96sB7RLfcNJfsv4MiXWSxDvdrfJe9muAbuOtHCKCwRNEJlviDW_uADkJfvIDbeRPdlhxU9yBPEaRTMlL1SVzQLlnY9C2PqljxnXRcAJjsHL0Pq-KhpYV_5l7IYJFZI2SHWFBOJDpmnn9d70T2YzQ',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD5kwxbYLlVkFhxgMtnJp-gPlpwsTteodfHhb2dIriWiE_qaR2OlVGttbXqlXkcZREpmmj5fEdWR_T2SALfi7mYpK_p3t7-7n9raI7MW5aYJQ6d3fvNSRkXOOfZ-tA6-mlB2e3dKPBg7XCJZYm7QWKpis5_bk_v2dh_QFAjub3b_mpYY-f2U4x6jQLUPbz2pDDUXMJsjVtEvLCotOFzXY9sh3K8tHTeOsBnCDnYRXOYEIFvTcJYRISwXxla9CQgIwRaKOC9-zould8'
      ],
      desc: 'A photo booth essential. These oversized mustaches are cut from durable 5mm PVC, never flimsy paper or cardboard.',
      bundleDesc: 'Includes 1 durable mustache prop.',
      badge: ''
    },
    'level_up_sign': {
      title: 'Level Up Sign',
      price: '$50.00',
      oldPrice: '',
      images: [
        'https://lh3.googleusercontent.com/aida-public/AB6AXuBSBllcwo-yQtfMwatx0nktu8O08ZCNKwQQh3uZNERmvuLMkngN-e_8ET4f7ddqcUDRn69-Ipt83zULNwF2C-1ZUcUjxZI1t9Tb6F-A8FtJrWDs1ykS1NmO2r3vqFBYwHJteEvgdxuhU7DoXxNFG_KbL01h1O3EtCJ_8EUB34epo1DMCPbOV6ibFzPTBxwiwPHCHwISfkicg1pMMN3YcwD7EeVvo-12rijL-Y0h0UGmW6ZYsb-ehel9kvKmvVC3hPkkgQnD_XGa28g',
        'https://lh3.googleusercontent.com/aida-public/AB6AXuD68DaxVJCBIkckGh4fjW-AQ_ki1eAu3hKWFUCoMeI9rtxKygYs_f8IJ9J8MCsfObiNI9DwpCrkZ0kvA63JsOqAwDMIkYUUWIRh_e4Y4E2EaqE9C3nt9rcnCTceKpGmMARsZw9Qwd0i1xVULPo6rpodeC89ZxWNF0SX5k7OopDeOtqVWGx9G72zsMWzOZUEkxMg8NR7aFQbAST8In8hRFIwRXm1RzisNWgHbiEMQv5r7VfER5tMwhRBUgC-uzHBLI51RlAV2DPBQos'
      ],
      desc: 'Gaming themed, neon-inspired UV print on 5mm PVC. Level up your next party with our most vibrant design yet.',
      bundleDesc: 'Includes 1 oversized sign prop.',
      badge: 'Best Seller'
    }
  };

  function updateProductDetails() {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    
    // Default to the first prop if no ID so it doesn't stay blank
    const product = id && products[id] ? products[id] : products['neon_party_set'];
    
    if (product) {
      const titles = document.querySelectorAll("h1");
      titles.forEach(t => {
        if (t.textContent.includes("Neon Party")) t.textContent = product.title;
      });
      
      const breadcrumb = document.querySelectorAll("nav span.text-slate-900");
      breadcrumb.forEach(b => {
        if (b.textContent.includes("Neon Party")) b.textContent = product.title;
      });
      
      const prices = document.querySelectorAll(".text-4xl.font-extrabold.text-primary, .text-3xl.font-extrabold.text-primary");
      prices.forEach(p => p.textContent = product.price);
      
      const oldPrices = document.querySelectorAll(".line-through");
      oldPrices.forEach(p => {
        if(product.oldPrice) {
           p.style.display = "inline";
           p.textContent = product.oldPrice;
        } else {
           p.style.display = "none";
        }
      });
      
      const mainImages = document.querySelectorAll("img.h-full.w-full.object-cover.object-center");
      mainImages.forEach(img => {
        img.src = product.images[0];
        img.classList.remove("object-cover");
        img.classList.add("object-contain", "bg-[#F0F0F2]");
      });
      
      // Update thumbnails
      const thumbs = document.querySelectorAll(".hide-scrollbar button img");
      if (thumbs.length >= 2) {
        thumbs[0].src = product.images[0];
        thumbs[1].src = product.images[1] || product.images[0];
        // Keep third thumb if available, else hide
        if (thumbs[2]) {
           if (product.images[2]) {
             thumbs[2].src = product.images[2];
             thumbs[2].parentElement.style.display = "block";
           } else {
             thumbs[2].parentElement.style.display = "none";
           }
        }
      }
      
      // Descriptions
      const descs = document.querySelectorAll(".prose p");
      if (descs.length > 0) descs[0].innerHTML = product.desc;
      
      const bundleDescs = document.querySelectorAll("p.text-xs.text-muted.text-center, p.text-xs.text-slate-500.text-center");
      bundleDescs.forEach(p => p.innerHTML = \`<span class="text-secondary">✨ Details:</span> \${product.bundleDesc}\`);
      
      const waButtons = document.querySelectorAll("button span");
      waButtons.forEach(s => {
        if (s.textContent.includes("Buy via WhatsApp") || s.textContent.includes("Buy on WhatsApp")) {
          s.textContent = "Buy via WhatsApp - " + product.price;
        }
      });
      
      // Update badge
      const badges = document.querySelectorAll(".top-4.left-4.z-10 span");
      if (badges.length > 0) {
        if (product.badge) {
          badges[0].style.display = "inline-flex";
          badges[0].innerHTML = \`<span class="material-symbols-outlined text-sm mr-1">\${product.badge === 'New' ? 'new_releases' : 'local_fire_department'}</span>\${product.badge}\`;
        } else {
          badges[0].style.display = "none";
        }
      }
    }
    
    // Show the content smoothly after populating
    const mainContent = document.getElementById("main-product-content");
    if (mainContent) {
        mainContent.style.opacity = '1';
    }
  }

  // Hook into DOMContentLoaded after the base logic
  window.addEventListener('DOMContentLoaded', updateProductDetails);
</script>
`;

if (!html.includes('id="dynamic-product-script"')) {
  html = html.replace('</body>', dynamicScript + '\n</body>');
  fs.writeFileSync('product_detail_enhanced.html', html);
  console.log("Script injected with opacity logic.");
} else {
  console.log("Script already injected.");
}
