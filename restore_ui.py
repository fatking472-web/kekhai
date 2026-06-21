import re

html_path = r'D:\kekhaibaohiem\index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    content = f.read()

# CSS to inject
css = '''
<style>
/* Custom UI Restoration Styles */
.custom-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1a365d;
    border-radius: 8px;
    padding: 10px;
    height: 100%;
    width: 100%;
    color: white !important;
    text-decoration: none !important;
    gap: 15px;
    box-shadow: inset 0px 2px 5px rgba(255,255,255,0.2), 0 4px 6px rgba(0,0,0,0.3);
}
.custom-btn:hover {
    background-color: #1f4273;
}
.custom-btn-icon {
    font-size: 40px !important;
}
.custom-btn-text {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}
.custom-btn-text .bold {
    font-weight: 800;
    font-size: 18px;
    letter-spacing: 0.5px;
}
.custom-btn-text .light {
    font-weight: 300;
    font-size: 16px;
}
/* Colors for icons */
.icon-pink { color: #FF4081; }
.icon-purple { color: #B388FF; }
.icon-yellow { color: #FFD54F; }
.icon-blue { color: #81D4FA; }
.icon-green { color: #AED581; }
.icon-orange { color: #FF8A65; }

/* Globe Banner CSS */
.custom-banner {
    width: 100%;
    height: 450px;
    background: linear-gradient(rgba(23, 51, 92, 0.4), rgba(23, 51, 92, 0.8)), url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop') center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
    margin-bottom: 20px;
}

/* Conic Pie Chart CSS */
.custom-pie-chart {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: conic-gradient(
        #ff5722 0% 60%,
        #9c27b0 60% 80%,
        #e91e63 80% 95%,
        #00bcd4 95% 100%
    );
    margin: 0 auto;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
}

.box-logo a img {
    max-height: 50px;
    max-width: 90%;
    object-fit: contain;
}
</style>
'''
if 'Custom UI Restoration Styles' not in content:
    content = content.replace('</head>', css + '\n</head>')

# Replace Globe Banner
banner_pattern = r'<img _ngcontent-c13=\"\" alt=\"image\" class=\"banner-img\"[\s\S]*?src=\"https://kekhaibaohiem.cc/assets/images/bg_01.svg\"[\s\S]*?>'
content = re.sub(banner_pattern, '<div class=\"custom-banner\"></div>', content)

# Replace Pie Chart
chart_pattern = r'<img src=\"https://kekhaibaohiem.cc/images/chart.png\"[\s\S]*?>'
content = re.sub(chart_pattern, '<div class=\"custom-pie-chart\"></div>', content)

# Function to generate button HTML
def btn_html(icon_class, icon_name, text_bold, text_light):
    return f'''<div class=\"custom-btn\"><i class=\"material-icons custom-btn-icon {icon_class}\">{icon_name}</i><div class=\"custom-btn-text\"><span class=\"bold\">{text_bold}</span><span class=\"light\">{text_light}</span></div></div>'''

# Replace Buttons
content = re.sub(r'<img _ngcontent-c13=\"\" alt=\"image\"[\s\S]*?src=\"https://kekhaibaohiem.cc/assets/images/kekhai.svg\">', btn_html('icon-pink', 'edit_document', 'KÊ KHAI', 'HỒ SƠ'), content)
content = re.sub(r'<img[\s\S]*?src=\"data:image/svg\+xml;base64,77u/PHN2Zy[\s\S]*?\">', btn_html('icon-purple', 'event_available', 'TÍCH HỢP', 'ĐIỆN TỬ'), content)
content = re.sub(r'<img _ngcontent-c13=\"\" alt=\"image\"[\s\S]*?src=\"https://kekhaibaohiem.cc/assets/images/thanhtoanbhxhdientu-01.svg\">', btn_html('icon-yellow', 'request_quote', 'ĐÓNG', 'BHXH ĐIỆN TỬ'), content)
content = re.sub(r'<img _ngcontent-c13=\"\" alt=\"image\"[\s\S]*?src=\"https://kekhaibaohiem.cc/assets/images/dichvucong-01.svg\">', btn_html('icon-blue', 'language', 'DỊCH VỤ CÔNG', 'TRỰC TUYẾN'), content)
content = re.sub(r'<img _ngcontent-c13=\"\" alt=\"image\"[\s\S]*?src=\"https://kekhaibaohiem.cc/assets/images/tracuu.svg\">', btn_html('icon-green', 'manage_search', 'TRA CỨU', 'HỒ SƠ'), content)
content = re.sub(r'<img _ngcontent-c13=\"\" alt=\"image\"[\s\S]*?src=\"https://kekhaibaohiem.cc/assets/images/tailieu.svg\">', btn_html('icon-orange', 'video_library', 'TÀI LIỆU &', 'ỨNG DỤNG'), content)

# Now, let's replace company logos with actual known URLs.
# VIN BHXH
content = content.replace('https://kekhaibaohiem.cc/assets/images/vinbhxh_logo.svg', 'https://vin-bhxh.vn/assets/images/logo/logo.svg')
# VNPT
content = content.replace('https://kekhaibaohiem.cc/assets/images/dv2.svg', 'https://upload.wikimedia.org/wikipedia/commons/e/ec/VNPT_Logo.svg')
# MISA
content = content.replace('https://kekhaibaohiem.cc/assets/images/misa_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Misa_logo.png')
# FPT
content = content.replace('https://kekhaibaohiem.cc/assets/images/fpt.svg', 'https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_logo_2010.svg')
# Vietnam Post
content = content.replace('https://kekhaibaohiem.cc/assets/images/vnpost-01.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Vietnam_Post_Logo.svg')
# Viettel CA
content = content.replace('https://kekhaibaohiem.cc/assets/images/viettel ca-01.svg', 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_Viettel_2021.svg')
# Bkav
content = content.replace('https://kekhaibaohiem.cc/assets/images/tc2.svg', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Bkav_logo.svg')

# For the rest of the logos that are harder to find exact SVGs for, we can use placehold.co but with white background and their brand color, or just text.
# Let's just use placehold.co for the rest but styled nicely.
def replace_rest_logos(match):
    name = match.group(1).split('.')[0].replace('_logo', '').replace('-', ' ').upper()
    return f'https://placehold.co/200x80/ffffff/333333?text={name}'

content = re.sub(r'https://kekhaibaohiem\.cc/assets/images/([a-zA-Z0-9_\-\s]+)\.(?:svg|png|jpg)', replace_rest_logos, content)

with open(html_path, 'w', encoding='utf-8') as f:
    f.write(content)
print('UI Restoration complete.')
