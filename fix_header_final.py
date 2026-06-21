import re

html_path = 'd:/kekhaibaohiem/public/index.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f: content = f.read()
except:
    with open(html_path, 'r', encoding='latin-1') as f: content = f.read()

# Fix base href to load local assets properly
content = content.replace('<base href="https://kekhaibaohiem.cc/">', '<base href="/">')

css = """
<style>
    /* Remove white borders around the page */
    body, html {
        margin: 0 !important;
        padding: 0 !important;
        background: #f4f6f9; /* standard body bg */
    }

    /* Fix header background and size */
    app-portal-header.bhxh-header {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        left: 0 !important;
        top: 0 !important;
        border-bottom: none !important;
    }
    
    app-portal-header #header {
        background-image: url('/assets/images/new_header.png') !important;
        background-size: auto 100% !important;
        background-position: left center !important;
        background-repeat: no-repeat !important;
        background-color: #1079c6 !important;
        min-height: 80px !important;
        display: flex !important;
        align-items: center !important;
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    app-portal-header #header .banner {
        background: transparent !important;
        box-shadow: none !important;
        width: 100% !important;
    }

    /* Hide the original img tags since the new background has the logo */
    app-portal-header .left img {
        display: none !important;
    }

    /* Make right buttons white and align correctly */
    app-portal-header .right .btn {
        background: rgba(255,255,255,0.1) !important;
        color: #fff !important;
        border: 1px solid rgba(255,255,255,0.5) !important;
    }

    /* Hide the globe banner completely */
    app-portal-index .banner {
        display: none !important;
    }

    @media (max-width: 768px) {
        app-portal-header #header {
            min-height: 60px !important;
        }
        app-portal-header .right .btn {
            padding: 0 10px;
            font-size: 12px;
        }
    }
</style>
"""

# Inject CSS into the <head> so it doesn't get destroyed by Angular if it's inside <app-portal>
if '</head>' in content:
    content = content.replace('</head>', css + '\n</head>')
else:
    # Fallback
    content = content.replace('<app-portal-header', css + '\n<app-portal-header')

try:
    with open(html_path, 'w', encoding='utf-8') as f: f.write(content)
except:
    with open(html_path, 'w', encoding='latin-1') as f: f.write(content)

print('Updated public/index.html successfully!')
