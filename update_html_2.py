import re

with open('public/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace main logo
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/logo_text\.svg"', 'src="/assets/images/logo_main.png"', content)
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/logo_white\.svg"', 'src="/assets/images/logo_main.png"', content)

# Replace banner
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/bg_01\.svg"', 'src="/assets/images/globe_banner.png"', content)

# Replace kekhai
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/kekhai\.svg"', 'src="/assets/images/kekhai.png"', content)

# Replace tichhop (base64 string)
content = re.sub(r'src="data:image/svg\+xml;base64,[^"]+"', 'src="/assets/images/tichhop.png"', content)

# Replace thanhtoanbhxhdientu-01
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/thanhtoanbhxhdientu-01\.svg"', 'src="/assets/images/thanhtoanbhxhdientu-01.png"', content)

# Replace dichvucong-01
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/dichvucong-01\.svg"', 'src="/assets/images/dichvucong-01.png"', content)

# Replace tracuu
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/tracuu\.svg"', 'src="/assets/images/tracuu.png"', content)

# Replace tailieu
content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/tailieu\.svg"', 'src="/assets/images/tailieu.png"', content)

# Fix partner logos by using the cropped ones we made
# We have 9 logos: logo_0 to logo_8 in public/assets/images/cropped/
# Let's replace the first 9 partner SVGs with our cropped JPGs.
partners = [
    'vinbhxh_logo.svg', 'dv2.svg', 'dv3.svg', 'dv4.svg', 'ts24corp.svg', 'vnpost-01.svg', 'viettel ca-01.svg', 'tc2.svg', 'misa_logo.svg'
]
for i, p in enumerate(partners):
    content = re.sub(r'src="(?:https://kekhaibaohiem\.cc)?/assets/images/' + p.replace('.', r'\.') + r'"', f'src="/assets/images/cropped/logo_{i}.jpg"', content)

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

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print('Updated both index.html files.')
