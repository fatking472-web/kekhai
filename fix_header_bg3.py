import re

html_path = 'd:/kekhaibaohiem/index.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f: content = f.read()
except:
    with open(html_path, 'r', encoding='latin-1') as f: content = f.read()

# First, remove the old CSS I injected to avoid duplicates
content = re.sub(r'<style>\s*/\*\s*New Header Background\s*\*/.*?</style>\s*', '', content, flags=re.DOTALL)

css = """
<style>
    /* New Header Background */
    app-portal-header #header {
        background-size: auto 100% !important;
        background-position: left center !important;
        background-repeat: no-repeat !important;
        background-color: #1079c6 !important;
        border-bottom: none !important;
    }
    app-portal-header.bhxh-header, app-portal-header #header .banner {
        background: transparent !important;
        box-shadow: none !important;
    }
    /* Hide the original img tags since the new background has the logo */
    app-portal-header .left img {
        display: none !important;
    }
    /* Ensure the header has enough height for the background logo to be visible */
    app-portal-header #header {
        min-height: 75px;
        display: flex;
        align-items: center;
        width: 100%;
    }
    app-portal-header .pot-header {
        width: 100%;
    }
    /* Make right buttons white and align correctly */
    app-portal-header .right .btn {
        background: rgba(255,255,255,0.1) !important;
        color: #fff !important;
        border: 1px solid rgba(255,255,255,0.5) !important;
    }
    @media (max-width: 768px) {
        app-portal-header #header {
            min-height: 60px;
        }
        app-portal-header .right .btn {
            padding: 0 10px;
            font-size: 12px;
        }
    }
</style>
<script>
    // Inject the background image using JS to avoid base href pointing to remote server
    document.addEventListener('DOMContentLoaded', function() {
        var header = document.querySelector('app-portal-header #header');
        if (header) {
            header.style.backgroundImage = "url('" + window.location.origin + "/assets/images/new_header.png')";
        }
        // Also fix the banner globe image if it is broken due to base href
        var bannerImg = document.querySelector('app-portal-index .banner-img');
        if (bannerImg && bannerImg.src.includes('kekhaibaohiem.cc')) {
            bannerImg.src = window.location.origin + '/assets/images/bg_01.png';
        }
    });
    // In case the DOM is already loaded or elements are rendered dynamically
    setInterval(function() {
        var header = document.querySelector('app-portal-header #header');
        if (header && !header.style.backgroundImage.includes('new_header.png')) {
            header.style.backgroundImage = "url('" + window.location.origin + "/assets/images/new_header.png')";
        }
        var bannerImg = document.querySelector('app-portal-index .banner-img');
        if (bannerImg && bannerImg.src.includes('kekhaibaohiem.cc')) {
            bannerImg.src = window.location.origin + '/assets/images/bg_01.png';
        }
    }, 500);
</script>
"""

content = content.replace('<app-portal-header', css + '\n<app-portal-header')

try:
    with open(html_path, 'w', encoding='utf-8') as f: f.write(content)
except:
    with open(html_path, 'w', encoding='latin-1') as f: f.write(content)

print('Fixed CSS and injected JS to bypass base href')
