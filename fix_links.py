import os
from bs4 import BeautifulSoup

def update_links(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".html"):
            filepath = os.path.join(directory, filename)
            with open(filepath, 'r') as f:
                soup = BeautifulSoup(f.read(), 'html.parser')

            modified = False
            for a_tag in soup.find_all('a', href=True):
                if a_tag['href'] == '#':
                    text = a_tag.get_text(separator=' ', strip=True).lower()
                    classes = a_tag.get('class', [])
                    
                    if 'shop stock' in text or 'shop' in text and not 'shop the drop' in text:
                        if 'shop all' not in text:
                            a_tag['href'] = 'stocked_shop_collection.html'
                            modified = True
                    if 'custom design' in text or 'custom order' in text:
                        a_tag['href'] = 'custom_services_landing.html'
                        modified = True
                    if 'about' in text or 'our story' in text or 'brand story' in text:
                        a_tag['href'] = 'brand_story.html'
                        modified = True
                    if 'stories' in text or 'community' in text:
                        a_tag['href'] = 'community_gallery.html'
                        modified = True
                    if 'panta props' in text:
                        a_tag['href'] = 'index.html'
                        modified = True
                    
                    # Social links
                    if not text:
                        # Check span content
                        spans = a_tag.find_all('span')
                        for span in spans:
                            if 'public' in span.text:
                                a_tag['href'] = 'https://twitter.com/pantaprops'
                                modified = True
                            if 'photo_camera' in span.text:
                                a_tag['href'] = 'https://instagram.com/pantaprops'
                                modified = True
                            if 'mail' in span.text:
                                a_tag['href'] = 'mailto:hello@pantaprops.com'
                                modified = True

            if modified:
                with open(filepath, 'w') as f:
                    f.write(str(soup))
                print(f"Updated links in {filename}")

if __name__ == "__main__":
    update_links('.')
