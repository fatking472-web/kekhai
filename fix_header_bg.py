import re

html_path = 'd:/kekhaibaohiem/public/index.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f: content = f.read()
except:
    with open(html_path, 'r', encoding='latin-1') as f: content = f.read()

css = """
<style>
    /* New Header Background */
    app-portal-header.bhxh-header {
        background-image: url('/assets/images/new_header.png') !important;
        background-size: auto 100% !important;
        background-position: left center !important;
        background-repeat: no-repeat !important;
        background-color: #1079c6 !important;
        border-bottom: none !important;
    }
    app-portal-header #header .banner {
        background: transparent !important;
        box-shadow: none !important;
    }
    /* Hide the original img tags since the new background has the logo */
    app-portal-header .left img {
        display: none !important;
    }
    /* Ensure the header has enough height for the background logo to be visible */
    app-portal-header #header .banner {
        min-height: 75px;
        display: flex;
        align-items: center;
    }
    app-portal-header .pot-header {
        width: 100%;
    }
    /* Make right buttons white and align correctly */
    app-portal-header .right .btn {
        background: rgba(255,255,255,0.1);
        color: #fff;
        border: 1px solid rgba(255,255,255,0.5);
    }
    @media (max-width: 768px) {
        app-portal-header #header .banner {
            min-height: 60px;
        }
        app-portal-header .right .btn {
            padding: 0 10px;
            font-size: 12px;
        }
    }
</style>
"""

if '<style>\n    /* New Header Background */' not in content:
    content = content.replace('<app-portal-header', css + '\n<app-portal-header')

try:
    with open(html_path, 'w', encoding='utf-8') as f: f.write(content)
except:
    with open(html_path, 'w', encoding='latin-1') as f: f.write(content)

print('Updated public/index.html')
