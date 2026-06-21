import re

html_path = 'd:/kekhaibaohiem/public/index.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f: content = f.read()
except:
    with open(html_path, 'r', encoding='latin-1') as f: content = f.read()

# Replace the previous display: none !important with the new banner styling
old_css = "    /* Hide the globe banner completely */\n    app-portal-index .banner {\n        display: none !important;\n    }"
new_css = """    /* Show and style the globe banner */
    app-portal-index .banner {
        display: block !important;
        width: 100% !important;
        /* Ensure it clears the fixed header. The header is ~80px. */
        margin-top: 75px !important;
    }
    
    app-portal-index .banner .boc-banner {
        width: 100%;
        overflow: hidden;
    }
    
    /* Replace the old banner image with the new one via CSS content replacement */
    app-portal-index .banner-img {
        content: url('/assets/images/globe_banner.png') !important;
        width: 100% !important;
        height: auto !important;
        display: block !important;
        object-fit: cover !important;
    }
    
    @media (max-width: 768px) {
        app-portal-index .banner {
            margin-top: 60px !important;
        }
    }
"""

if old_css in content:
    content = content.replace(old_css, new_css)
else:
    # If the old CSS was slightly different, let's just do a regex replace
    content = re.sub(r'/\* Hide the globe banner completely \*/.*?\}', new_css, content, flags=re.DOTALL)

try:
    with open(html_path, 'w', encoding='utf-8') as f: f.write(content)
except:
    with open(html_path, 'w', encoding='latin-1') as f: f.write(content)

# Also apply to index.html in root
html_path2 = 'd:/kekhaibaohiem/index.html'
try:
    with open(html_path2, 'r', encoding='utf-8') as f: content2 = f.read()
except:
    with open(html_path2, 'r', encoding='latin-1') as f: content2 = f.read()

if old_css in content2:
    content2 = content2.replace(old_css, new_css)
else:
    content2 = re.sub(r'/\* Hide the globe banner completely \*/.*?\}', new_css, content2, flags=re.DOTALL)

try:
    with open(html_path2, 'w', encoding='utf-8') as f: f.write(content2)
except:
    with open(html_path2, 'w', encoding='latin-1') as f: f.write(content2)

print('Updated globe banner successfully!')
