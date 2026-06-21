import re

html_path = 'd:/kekhaibaohiem/public/index.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f: content = f.read()
except:
    with open(html_path, 'r', encoding='latin-1') as f: content = f.read()

# Fix logo URLs
content = content.replace('https://kekhaibaohiem.cc/assets/images/logo_text.svg', '/assets/images/logo_text.svg')
content = content.replace('https://kekhaibaohiem.cc/assets/images/logo_white.svg', '/assets/images/logo_white.svg')

# Inject CSS for header overlay
css = """
<style>
    /* Overlay Header over Banner */
    app-portal-header.bhxh-header {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        z-index: 1000;
        background: transparent !important;
    }
    app-portal-header #header .banner {
        background: transparent !important;
        border: none !important;
        box-shadow: none !important;
    }
    app-portal-header .left img {
        max-height: 50px;
        width: auto;
        padding-top: 5px;
    }
    /* Hide the dark logo, show the white logo since it's on a dark globe banner */
    app-portal-header .left img[alt="logo"] {
        display: none !important;
    }
    app-portal-header .left img[alt="logo_white"] {
        display: inline-block !important;
    }
    /* Ensure the banner image is responsive and starts from the top */
    app-portal-index .banner {
        position: relative;
        margin-top: 0 !important;
        padding-top: 0 !important;
    }
    app-portal-index .banner .banner-img {
        width: 100% !important;
        height: auto !important;
        max-height: 600px;
        object-fit: cover;
    }
    @media (max-width: 768px) {
        app-portal-header .left img {
            max-height: 40px;
        }
    }
</style>
"""

if '<style>\n    /* Overlay Header over Banner */' not in content:
    content = content.replace('<app-portal-header', css + '<app-portal-header')

try:
    with open(html_path, 'w', encoding='utf-8') as f: f.write(content)
except:
    with open(html_path, 'w', encoding='latin-1') as f: f.write(content)

print('Updated public/index.html')
