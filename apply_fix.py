import re

html_path = 'd:/kekhaibaohiem/public/index.html'
try:
    with open(html_path, 'r', encoding='utf-8') as f: content = f.read()
except:
    with open(html_path, 'r', encoding='latin-1') as f: content = f.read()

# Fix base href so local images load
content = content.replace('<base href="https://kekhaibaohiem.cc/">', '<base href="/">')

css = """
<style>
    /* Remove white borders, set a dark background for the whole page */
    body, html {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #1b2838 !important; /* Dark background matching the globe banner edges */
    }

    /* Style the header to be solid blue */
    app-portal-header.bhxh-header, app-portal-header #header {
        background-color: #1079c6 !important;
        background-image: none !important; /* remove any drum pattern */
        width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        border-bottom: none !important;
        top: 0 !important;
        left: 0 !important;
    }
    
    app-portal-header #header .banner {
        background: transparent !important;
        box-shadow: none !important;
    }

    /* Show the WHITE logo, hide the black one */
    app-portal-header .left img[alt="logo"] {
        display: none !important;
    }
    app-portal-header .left img[alt="logo_white"] {
        display: inline-block !important;
        max-height: 50px !important; /* ensure it fits nicely */
    }

    /* Make right buttons white */
    app-portal-header .right .btn {
        background: transparent !important;
        color: #fff !important;
        border: 1px solid rgba(255,255,255,0.5) !important;
    }

    /* Style the main content area to have the dark background */
    .portal-home .main, .portal-content {
        background-color: #1b2838 !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    /* Style the globe banner */
    app-portal-index .banner {
        display: block !important;
        width: 100% !important;
        background-color: #1b2838 !important;
        padding: 0 !important;
        margin: 0 !important;
    }
    
    app-portal-index .banner .boc-banner {
        width: 100%;
        text-align: center;
        background-color: #1b2838 !important;
    }
    
    /* Inject the new globe banner and center it */
    app-portal-index .banner-img {
        content: url('/assets/images/globe_banner.png') !important;
        width: 100% !important;
        max-width: 1140px !important; /* keep it contained like in screenshot 2 */
        height: auto !important;
        display: block !important;
        margin: 0 auto !important;
    }
    
    /* Adjust spacing under the fixed header */
    app-portal-index {
        display: block;
        margin-top: 70px !important; /* push down so fixed header doesn't overlap it */
    }
    @media (max-width: 768px) {
        app-portal-index {
            margin-top: 60px !important;
        }
    }
</style>
"""

# Insert CSS into <head> safely (at the end of the first <head>)
# Use regex to find the first </head> and insert before it
content = re.sub(r'</head>', css + '\n</head>', content, count=1)

try:
    with open(html_path, 'w', encoding='utf-8') as f: f.write(content)
except:
    with open(html_path, 'w', encoding='latin-1') as f: f.write(content)

# Apply to root index.html as well
html_path2 = 'd:/kekhaibaohiem/index.html'
try:
    with open(html_path2, 'r', encoding='utf-8') as f: content2 = f.read()
except:
    with open(html_path2, 'r', encoding='latin-1') as f: content2 = f.read()

content2 = content2.replace('<base href="https://kekhaibaohiem.cc/">', '<base href="/">')
content2 = re.sub(r'</head>', css + '\n</head>', content2, count=1)

try:
    with open(html_path2, 'w', encoding='utf-8') as f: f.write(content2)
except:
    with open(html_path2, 'w', encoding='latin-1') as f: f.write(content2)

print('Applied design from screenshot 2 successfully!')
