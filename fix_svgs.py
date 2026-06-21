import os

# Correct: no background rect, just icon + text on transparent
# The <li> has height:116px, background:#113160
# The <img> has height:45px, margin:30px auto 0
# The SVG viewBox should be 153.12 x 46.51 (same as the original proportions in the base64 img)
# Icon on left ~40px wide, text on right
# Colors from screenshot:
# kekhai: pink/red icon #FF4081
# tich hop: purple #B48DFF (already inline base64, skip)
# dong bhxh: yellow #FFD54F
# dich vu cong: blue #81D4FA
# tra cuu: green #AED581
# tai lieu: orange #FF8A65

logos = {}

logos["kekhai.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.12 46.51">
<defs><style>
.tb { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:900; font-size:20px; }
.tl { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:300; font-size:19px; }
</style></defs>
<!-- Document + pencil icon in pink #FF4081 -->
<g transform="translate(4,3)">
  <rect x="0" y="0" width="26" height="32" rx="2" fill="none" stroke="#FF4081" stroke-width="2"/>
  <line x1="4" y1="9" x2="22" y2="9" stroke="#FF4081" stroke-width="1.5"/>
  <line x1="4" y1="15" x2="22" y2="15" stroke="#FF4081" stroke-width="1.5"/>
  <line x1="4" y1="21" x2="14" y2="21" stroke="#FF4081" stroke-width="1.5"/>
  <path d="M16,26 L24,18 L28,22 L20,30Z" fill="#FF4081"/>
  <line x1="24" y1="18" x2="26" y2="16" stroke="#FF4081" stroke-width="1.5"/>
</g>
<text x="42" y="19" class="tb">KÊ KHAI</text>
<text x="42" y="42" class="tl">HỒ SƠ</text>
</svg>"""

logos["thanhtoanbhxhdientu-01.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.12 46.51">
<defs><style>
.tb { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:900; font-size:20px; }
.tl { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:300; font-size:19px; }
</style></defs>
<!-- Document + dollar sign - yellow -->
<g transform="translate(2,2)">
  <rect x="0" y="0" width="26" height="32" rx="2" fill="none" stroke="#FFD54F" stroke-width="2"/>
  <line x1="4" y1="9" x2="22" y2="9" stroke="#FFD54F" stroke-width="1.5"/>
  <line x1="4" y1="15" x2="22" y2="15" stroke="#FFD54F" stroke-width="1.5"/>
  <circle cx="31" cy="30" r="11" fill="none" stroke="#FFD54F" stroke-width="2"/>
  <text x="27" y="35" font-family="Arial" font-size="14" font-weight="bold" fill="#FFD54F">$</text>
</g>
<text x="48" y="19" class="tb">ĐÓNG</text>
<text x="48" y="36" class="tl">BHXH</text>
<text x="48" y="47" class="tl" font-size="14">ĐIỆN TỬ</text>
</svg>"""

logos["dichvucong-01.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.12 46.51">
<defs><style>
.tb { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:900; font-size:20px; }
.tl { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:300; font-size:19px; }
</style></defs>
<!-- Globe - light blue -->
<g transform="translate(4,4)">
  <circle cx="17" cy="17" r="17" fill="none" stroke="#81D4FA" stroke-width="2"/>
  <ellipse cx="17" cy="17" rx="8" ry="17" fill="none" stroke="#81D4FA" stroke-width="1.5"/>
  <line x1="0" y1="17" x2="34" y2="17" stroke="#81D4FA" stroke-width="1.5"/>
  <path d="M3,10 Q17,14 31,10" fill="none" stroke="#81D4FA" stroke-width="1"/>
  <path d="M3,24 Q17,20 31,24" fill="none" stroke="#81D4FA" stroke-width="1"/>
</g>
<text x="46" y="17" class="tb">DỊCH VỤ</text>
<text x="46" y="33" class="tb">CÔNG</text>
<text x="46" y="47" class="tl" font-size="15">TRỰC TUYẾN</text>
</svg>"""

logos["tracuu.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.12 46.51">
<defs><style>
.tb { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:900; font-size:20px; }
.tl { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:300; font-size:19px; }
</style></defs>
<!-- Monitor + magnifying glass - green -->
<g transform="translate(2,3)">
  <rect x="0" y="0" width="27" height="19" rx="1.5" fill="none" stroke="#AED581" stroke-width="2"/>
  <line x1="7" y1="23" x2="20" y2="23" stroke="#AED581" stroke-width="1.5"/>
  <line x1="13.5" y1="19" x2="13.5" y2="23" stroke="#AED581" stroke-width="1.5"/>
  <line x1="4" y1="7" x2="18" y2="7" stroke="#AED581" stroke-width="1"/>
  <line x1="4" y1="12" x2="14" y2="12" stroke="#AED581" stroke-width="1"/>
  <circle cx="30" cy="25" r="7" fill="none" stroke="#AED581" stroke-width="2"/>
  <line x1="35" y1="30" x2="39" y2="34" stroke="#AED581" stroke-width="2" stroke-linecap="round"/>
</g>
<text x="48" y="19" class="tb">TRA CỨU</text>
<text x="48" y="42" class="tl">HỒ SƠ</text>
</svg>"""

logos["tailieu.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.12 46.51">
<defs><style>
.tb { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:900; font-size:20px; }
.tl { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:300; font-size:19px; }
</style></defs>
<!-- Play button circle - orange -->
<g transform="translate(2,4)">
  <circle cx="17" cy="17" r="17" fill="none" stroke="#FF8A65" stroke-width="2"/>
  <polygon points="12,9 12,25 26,17" fill="#FF8A65"/>
  <rect x="0" y="36" width="10" height="8" rx="1.5" fill="#FF8A65"/>
  <rect x="13" y="36" width="10" height="8" rx="1.5" fill="#FF8A65"/>
  <rect x="26" y="36" width="10" height="8" rx="1.5" fill="#FF8A65"/>
</g>
<text x="46" y="17" class="tb">TÀI LIỆU &amp;</text>
<text x="46" y="38" class="tl">ỨNG DỤNG</text>
</svg>"""

logos["kekhai.svg"] = """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 153.12 46.51">
<defs><style>
.tb { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:900; font-size:20px; }
.tl { fill:#fff; font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif; font-weight:300; font-size:19px; }
</style></defs>
<!-- Document + pencil icon - pink #FF4081 -->
<g transform="translate(4,4)">
  <rect x="0" y="0" width="22" height="28" rx="2" fill="none" stroke="#FF4081" stroke-width="2"/>
  <line x1="4" y1="8" x2="18" y2="8" stroke="#FF4081" stroke-width="1.5"/>
  <line x1="4" y1="13" x2="18" y2="13" stroke="#FF4081" stroke-width="1.5"/>
  <line x1="4" y1="18" x2="12" y2="18" stroke="#FF4081" stroke-width="1.5"/>
  <!-- pencil -->
  <rect x="14" y="20" width="7" height="18" rx="1" fill="#FF4081" transform="rotate(-45 17 29)"/>
  <polygon points="8,35 13,30 15,36" fill="#FF4081"/>
</g>
<text x="42" y="19" class="tb">KÊ KHAI</text>
<text x="42" y="42" class="tl">HỒ SƠ</text>
</svg>"""

out_dir = r'D:\kekhaibaohiem\public\assets\images'
for fname, content in logos.items():
    path = os.path.join(out_dir, fname)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Updated: {fname}')

print('Done!')
