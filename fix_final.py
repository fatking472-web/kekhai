import re

def fix_html(path):
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Fix <base href> - remove it so relative paths work
    content = content.replace('<base href="https://kekhaibaohiem.cc/">', '')
    content = content.replace('<base href="https://kekhaibaohiem.cc/">', '')

    # Map all kekhaibaohiem.cc image paths to local /assets/images/
    img_map = {
        'https://kekhaibaohiem.cc/assets/images/bg_01.svg': '/assets/images/bg_01.svg',
        'https://kekhaibaohiem.cc/assets/images/kekhai.svg': '/assets/images/kekhai.svg',
        'https://kekhaibaohiem.cc/assets/images/thanhtoanbhxhdientu-01.svg': '/assets/images/thanhtoanbhxhdientu-01.svg',
        'https://kekhaibaohiem.cc/assets/images/dichvucong-01.svg': '/assets/images/dichvucong-01.svg',
        'https://kekhaibaohiem.cc/assets/images/tracuu.svg': '/assets/images/tracuu.svg',
        'https://kekhaibaohiem.cc/assets/images/tailieu.svg': '/assets/images/tailieu.svg',
        'https://kekhaibaohiem.cc/assets/images/vinbhxh_logo.svg': '/assets/images/vinbhxh_logo.svg',
        'https://kekhaibaohiem.cc/assets/images/dv2.svg': '/assets/images/dv2.svg',
        'https://kekhaibaohiem.cc/assets/images/dv3.svg': '/assets/images/dv3.svg',
        'https://kekhaibaohiem.cc/assets/images/dv4.svg': '/assets/images/dv4.svg',
        'https://kekhaibaohiem.cc/assets/images/ts24corp.svg': '/assets/images/ts24corp.svg',
        'https://kekhaibaohiem.cc/assets/images/vnpost-01.svg': '/assets/images/vnpost-01.svg',
        'https://kekhaibaohiem.cc/assets/images/viettel ca-01.svg': '/assets/images/viettel ca-01.svg',
        'https://kekhaibaohiem.cc/assets/images/tc2.svg': '/assets/images/tc2.svg',
        'https://kekhaibaohiem.cc/assets/images/misa_logo.svg': '/assets/images/misa_logo.svg',
        'https://kekhaibaohiem.cc/assets/images/CyberLotus.svg': '/assets/images/CyberLotus.svg',
        'https://kekhaibaohiem.cc/assets/images/ibh_logo.svg': '/assets/images/ibh_logo.svg',
        'https://kekhaibaohiem.cc/assets/images/ICARE.svg': '/assets/images/ICARE.svg',
        'https://kekhaibaohiem.cc/assets/images/mbhxh_logo.svg': '/assets/images/mbhxh_logo.svg',
        'https://kekhaibaohiem.cc/assets/images/1Office_logo.svg': '/assets/images/1Office_logo.svg',
        'https://kekhaibaohiem.cc/assets/images/easyCA.svg': '/assets/images/easyCA.svg',
        'https://kekhaibaohiem.cc/assets/images/LogoNewtel_CA.svg': '/assets/images/LogoNewtel_CA.svg',
        'https://kekhaibaohiem.cc/assets/images/tc3.svg': '/assets/images/tc3.svg',
        'https://kekhaibaohiem.cc/assets/images/tc4.svg': '/assets/images/tc4.svg',
        'https://kekhaibaohiem.cc/assets/images/logo_text.svg': '/assets/images/logo_text.svg',
        'https://kekhaibaohiem.cc/assets/images/favicon.png': '/assets/images/favicon.png',
        # chart
        'https://kekhaibaohiem.cc/images/chart.png': '/assets/images/chart.svg',
    }

    for old, new in img_map.items():
        content = content.replace(old, new)

    # Replace remaining kekhaibaohiem.cc image references with placehold
    def replace_img(match):
        url = match.group(0)
        # Extract filename
        fname = url.split('/')[-1].split('.')[0].replace('-', ' ').replace('_', ' ').upper()
        return f'/assets/images/placeholder.svg'

    content = re.sub(r'https://kekhaibaohiem\.cc/assets/images/[^\s"\']+', replace_img, content)
    content = re.sub(r'https://kekhaibaohiem\.cc/images/[^\s"\']+', replace_img, content)

    # Fix banner img style - keep the style as-is but now src is local
    # Fix admin-login logo
    content = content.replace(
        'src="https://kekhaibaohiem.cc/assets/images/logo_text.svg"',
        'src="/assets/images/logo_text.svg"'
    )

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Fixed: {path}')

fix_html(r'D:\kekhaibaohiem\public\index.html')
fix_html(r'D:\kekhaibaohiem\index.html')

# Also fix admin-login.html
try:
    fix_html(r'D:\kekhaibaohiem\public\admin-login.html')
except Exception as e:
    print(f'admin-login: {e}')

print('All files fixed!')
