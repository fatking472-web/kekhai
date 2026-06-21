import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace main logo
content = re.sub(r'<img src="/logo_text\.svg" alt="Bảo hiểm Xã hội Việt Nam">', '<img src="/assets/images/logo_main.png" alt="Bảo hiểm Xã hội Việt Nam">', content)

# Replace banner
content = re.sub(r'src="/assets/images/bg_01\.svg"', 'src="/assets/images/globe_banner.png"', content)

# Replace kekhai
content = re.sub(r'src="/assets/images/kekhai\.svg"', 'src="/assets/images/kekhai.png"', content)

# Replace tichhop (base64 string)
content = re.sub(r'src="data:image/svg\+xml;base64,[^"]+"', 'src="/assets/images/tichhop.png"', content)

# Replace thanhtoanbhxhdientu-01
content = re.sub(r'src="/assets/images/thanhtoanbhxhdientu-01\.svg"', 'src="/assets/images/thanhtoanbhxhdientu-01.png"', content)

# Replace dichvucong-01
content = re.sub(r'src="/assets/images/dichvucong-01\.svg"', 'src="/assets/images/dichvucong-01.png"', content)

# Replace tracuu
content = re.sub(r'src="/assets/images/tracuu\.svg"', 'src="/assets/images/tracuu.png"', content)

# Replace tailieu
content = re.sub(r'src="/assets/images/tailieu\.svg"', 'src="/assets/images/tailieu.png"', content)

css = '''
    <style>
    .banner-img { max-width: 100%; height: auto; object-fit: contain; }
    .menu-section img { max-width: 100%; height: auto; object-fit: contain; }
    .box-logo img { width: 100%; height: auto; max-height: 80px; }
    .partner-card img { max-width: 100%; height: auto; object-fit: contain; }
    </style>
'''
if '<style>\n    .banner-img' not in content:
    content = content.replace('</head>', css + '</head>')

with open('public/index.html', 'w', encoding='utf-8') as f:
    f.write(content)
print('Updated index.html')
