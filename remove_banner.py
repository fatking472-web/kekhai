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
    /* Reset margins and backgrounds to eliminate any white space */
    body, html {
        margin: 0 !important;
        padding: 0 !important;
        background-color: #f4f6f9 !important; /* Standard site background */
    }

    /* Style the header to use the drum pattern image */
    app-portal-header.bhxh-header {
        margin: 0 !important;
        padding: 0 !important;
        width: 100% !important;
        left: 0 !important;
        top: 0 !important;
        border-bottom: none !important;
        background: transparent !important;
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

    /* COMPLETELY HIDE THE GLOBE BANNER */
    app-portal-index .banner {
        display: none !important;
    }
    
    /* Reset main content area to sit perfectly under the header */
    .portal-home .main, .portal-content {
        margin: 0 !important;
        padding: 0 !important; 
        margin-top: 80px !important; /* Exactly the height of the fixed header */
        background-color: #f4f6f9 !important;
    }

    @media (max-width: 768px) {
        app-portal-header #header {
            min-height: 60px !important;
        }
        .portal-home .main, .portal-content {
            margin-top: 60px !important;
        }
        app-portal-header .right .btn {
            padding: 0 10px;
            font-size: 12px;
        }
    }
</style>
"""

# We first remove the old injected <style> block from previous runs to prevent duplication
content = re.sub(r'<style>.*?Reset margins and backgrounds.*?</style>', '', content, flags=re.DOTALL)

# Insert CSS safely before </head>
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
content2 = re.sub(r'<style>.*?Reset margins and backgrounds.*?</style>', '', content2, flags=re.DOTALL)
content2 = re.sub(r'</head>', css + '\n</head>', content2, count=1)

try:
    with open(html_path2, 'w', encoding='utf-8') as f: f.write(content2)
except:
    with open(html_path2, 'w', encoding='latin-1') as f: f.write(content2)

print('Removed globe banner completely!')
