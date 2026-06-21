import os

logos = {
    "dv2.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- VNPT CA logo - blue text -->
  <text x="60" y="40" font-family="Arial Black, Arial" font-size="22" font-weight="900" fill="#003399" letter-spacing="-1">VNPT</text>
  <rect x="125" y="18" width="36" height="36" rx="4" fill="#003399"/>
  <text x="143" y="44" text-anchor="middle" font-family="Arial" font-size="18" font-weight="bold" fill="white">CA</text>
  <text x="100" y="68" text-anchor="middle" font-family="Arial" font-size="9" fill="#003399">An toàn lưu giữ dịch</text>
</svg>""",

    "dv3.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- ThaiSon Soft logo -->
  <circle cx="60" cy="38" r="22" fill="none" stroke="#e63" stroke-width="3"/>
  <circle cx="60" cy="38" r="14" fill="#e63" opacity="0.2"/>
  <path d="M50,38 Q60,22 70,38 Q60,54 50,38Z" fill="#e63"/>
  <text x="95" y="35" font-family="Arial" font-size="13" font-weight="bold" fill="#333">ThaiSon</text>
  <text x="95" y="52" font-family="Arial" font-size="10" fill="#e63">SOFT</text>
</svg>""",

    "dv4.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- EFY logo - red/pink brand -->
  <text x="30" y="48" font-family="Arial Black, Arial" font-size="30" font-weight="900" fill="#cc1144">EFY</text>
  <path d="M110,20 L130,40 L110,60 L90,40 Z" fill="#cc1144" opacity="0.2"/>
  <path d="M110,25 L125,40 L110,55 L95,40 Z" fill="none" stroke="#cc1144" stroke-width="2"/>
  <text x="140" y="48" font-family="Arial" font-size="16" fill="#333">Tech</text>
</svg>""",

    "ts24corp.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- TS24 CORP logo -->
  <text x="10" y="52" font-family="Arial Black, Arial" font-size="32" font-weight="900" fill="#003399" letter-spacing="-2">TS24</text>
  <text x="115" y="52" font-family="Arial" font-size="20" font-weight="bold" fill="#333">CORP</text>
</svg>""",

    "vnpost-01.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- Vietnam Post - orange/yellow logo -->
  <polygon points="28,60 42,20 56,60" fill="#FF6600"/>
  <polygon points="44,55 58,20 72,55" fill="#FF9900"/>
  <text x="85" y="42" font-family="Arial Black, Arial" font-size="14" font-weight="900" fill="#FF6600">VIETNAM</text>
  <text x="85" y="60" font-family="Arial Black, Arial" font-size="14" font-weight="900" fill="#FF6600">POST</text>
</svg>""",

    "viettel ca-01.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- Viettel-CA logo -->
  <text x="10" y="38" font-family="Arial Black, Arial" font-size="20" font-weight="900" fill="#cc0000" letter-spacing="-0.5">VIETTEL</text>
  <text x="10" y="58" font-family="Arial" font-size="11" fill="#cc0000">DỊCH VỤ CHỮ KÝ SỐ VIETTEL</text>
  <rect x="145" y="22" width="40" height="30" rx="4" fill="#cc0000"/>
  <text x="165" y="43" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">CA</text>
</svg>""",

    "tc2.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- Bkav CA logo -->
  <path d="M20,55 L20,20 Q20,15 25,15 L45,15 Q55,15 55,25 Q55,32 48,35 Q58,38 58,48 Q58,60 45,60 L25,60 Q20,60 20,55Z" fill="#003399"/>
  <text x="70" y="48" font-family="Arial Black, Arial" font-size="24" font-weight="900" fill="#003399">Bkav</text>
  <rect x="148" y="22" width="38" height="30" rx="4" fill="#003399"/>
  <text x="167" y="43" text-anchor="middle" font-family="Arial" font-size="16" font-weight="bold" fill="white">CA</text>
</svg>""",

    "misa_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- MISA logo - red M with circle -->
  <circle cx="35" cy="38" r="25" fill="#cc0000" opacity="0.15"/>
  <text x="22" y="52" font-family="Arial Black, Arial" font-size="36" font-weight="900" fill="#cc0000">M</text>
  <text x="68" y="38" font-family="Arial Black, Arial" font-size="24" font-weight="900" fill="#cc0000">ISA</text>
  <text x="20" y="70" font-family="Arial" font-size="8" fill="#333">TIN CẬY-TIỆN ÍCH-TẬN TÌNH</text>
</svg>""",

    "CyberLotus.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- Cyber Lotus logo -->
  <path d="M25,55 Q15,38 25,22 Q35,10 45,22 Q55,10 65,22 Q75,10 75,38 Q65,55 50,65 Q35,55 25,55Z" fill="#cc0044" opacity="0.2"/>
  <path d="M35,50 Q25,38 35,25 Q45,15 55,25 Q60,15 68,25 Q70,38 60,50 Q50,60 42,55Z" fill="none" stroke="#cc0044" stroke-width="2"/>
  <text x="85" y="38" font-family="Arial Black, Arial" font-size="14" font-weight="bold" fill="#333">CYBER</text>
  <text x="85" y="56" font-family="Arial Black, Arial" font-size="14" font-weight="bold" fill="#cc0044">LOTUS</text>
  <text x="20" y="72" font-family="Arial" font-size="7" fill="#666">HỢP TÁC CÔNG NGHỆ SỐ TIN CẬY</text>
</svg>""",

    "ibh_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- IBH Insurance logo - blue parallelogram -->
  <polygon points="15,60 35,20 155,20 135,60" fill="#003399"/>
  <text x="85" y="47" text-anchor="middle" font-family="Arial Black, Arial" font-size="22" font-weight="900" fill="white" letter-spacing="2">IBH</text>
  <text x="145" y="60" font-family="Arial" font-size="10" fill="#003399">INSURANCE</text>
</svg>""",

    "ICARE.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- iCare logo - star/person icon -->
  <circle cx="40" cy="28" r="10" fill="#FFB400"/>
  <path d="M28,58 Q28,42 40,42 Q52,42 52,58Z" fill="#FFB400"/>
  <!-- Star arms -->
  <line x1="40" y1="15" x2="40" y2="8" stroke="#FFB400" stroke-width="3"/>
  <line x1="53" y1="22" x2="58" y2="17" stroke="#FFB400" stroke-width="3"/>
  <line x1="55" y1="35" x2="62" y2="35" stroke="#FFB400" stroke-width="3"/>
  <text x="75" y="36" font-family="Arial Italic, Arial" font-size="20" font-style="italic" fill="#003399">i</text>
  <text x="88" y="36" font-family="Arial Black, Arial" font-size="20" font-weight="900" fill="#003399">Care</text>
  <text x="75" y="58" font-family="Arial" font-size="9" fill="#003399">Bảo hiểm vi điện tử</text>
</svg>""",

    "mbhxh_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- mBHXH logo - m with house icon -->
  <rect x="15" y="20" width="42" height="42" rx="8" fill="#cc0044"/>
  <text x="36" y="51" text-anchor="middle" font-family="Arial Black, Arial" font-size="26" font-weight="900" fill="white">m</text>
  <text x="72" y="42" font-family="Arial Black, Arial" font-size="22" font-weight="900" fill="#cc0044">BHXH</text>
  <text x="72" y="60" font-family="Arial" font-size="9" fill="#333">Phần mềm bảo hiểm xã hội điện tử</text>
</svg>""",

    "1Office_logo.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- 1Office logo -->
  <rect x="15" y="15" width="42" height="50" rx="6" fill="#FF6600"/>
  <text x="36" y="50" text-anchor="middle" font-family="Arial Black, Arial" font-size="32" font-weight="900" fill="white">1</text>
  <text x="72" y="48" font-family="Arial Black, Arial" font-size="22" font-weight="bold" fill="#333">Office</text>
</svg>""",

    "easyCA.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- EasyCA logo - circular -->
  <circle cx="50" cy="38" r="28" fill="none" stroke="#0099cc" stroke-width="4"/>
  <circle cx="50" cy="38" r="22" fill="#0099cc" opacity="0.15"/>
  <text x="50" y="30" text-anchor="middle" font-family="Arial" font-size="9" fill="#0099cc">Easy</text>
  <text x="50" y="48" text-anchor="middle" font-family="Arial Black, Arial" font-size="18" font-weight="900" fill="#0099cc">CA</text>
  <text x="120" y="48" font-family="Arial" font-size="16" fill="#333">EasyCA</text>
</svg>""",

    "LogoNewtel_CA.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- NewtelCA logo -->
  <circle cx="40" cy="38" r="25" fill="none" stroke="#0066cc" stroke-width="3"/>
  <path d="M28,48 L28,28 L42,44 L56,28 L56,48" fill="none" stroke="#0066cc" stroke-width="2.5"/>
  <text x="75" y="35" font-family="Arial Black, Arial" font-size="15" font-weight="bold" fill="#333">NEWTEL</text>
  <rect x="75" y="42" width="48" height="20" rx="3" fill="#0066cc"/>
  <text x="99" y="57" text-anchor="middle" font-family="Arial" font-size="12" font-weight="bold" fill="white">CA</text>
</svg>""",

    "tc3.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- Viettel CA 2 -->
  <text x="10" y="38" font-family="Arial Black, Arial" font-size="20" font-weight="900" fill="#cc0000">VIETTEL</text>
  <rect x="10" y="46" width="180" height="2" fill="#cc0000" opacity="0.3"/>
  <text x="10" y="65" font-family="Arial" font-size="12" fill="#cc0000">DỊCH VỤ CHỮ KÝ SỐ</text>
</svg>""",

    "tc4.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- CAVN logo -->
  <text x="100" y="45" text-anchor="middle" font-family="Arial Black, Arial" font-size="26" font-weight="900" fill="#003399">CAVN</text>
  <text x="100" y="62" text-anchor="middle" font-family="Arial" font-size="10" fill="#666">Chứng thực số</text>
</svg>""",

    "nacencomm.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <text x="100" y="48" text-anchor="middle" font-family="Arial Black, Arial" font-size="18" font-weight="900" fill="#333">NACENCOMM</text>
</svg>""",

    "safecert.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <text x="10" y="38" font-family="Arial" font-size="14" font-weight="bold" font-style="italic" fill="#003399">SAFE</text>
  <text x="60" y="38" font-family="Arial Black, Arial" font-size="14" font-weight="900" fill="#003399">CERT</text>
  <text x="110" y="38" font-family="Arial" font-size="14" fill="#333"> CORP</text>
  <text x="10" y="55" font-family="Arial" font-size="8" fill="#666">WWW.SAFECERT.COM.VN</text>
</svg>""",

    "fpt.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- FPT logo - colorful -->
  <text x="15" y="56" font-family="Arial Black, Arial" font-size="46" font-weight="900" letter-spacing="-3">
    <tspan fill="#FF6600">F</tspan><tspan fill="#0066CC">P</tspan><tspan fill="#009900">T</tspan>
  </text>
  <circle cx="150" cy="38" r="6" fill="#FF6600" opacity="0.6"/>
  <circle cx="163" cy="38" r="6" fill="#0066CC" opacity="0.6"/>
  <circle cx="176" cy="38" r="6" fill="#009900" opacity="0.6"/>
</svg>""",

    "smartsign.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- SmartSign logo - S in circle -->
  <circle cx="35" cy="38" r="25" fill="none" stroke="#333" stroke-width="2"/>
  <text x="35" y="47" text-anchor="middle" font-family="Arial Black, Arial" font-size="28" font-weight="900" fill="#333">S</text>
  <text x="75" y="35" font-family="Arial Italic, Arial" font-size="18" font-style="italic" fill="#333">Smart</text>
  <text x="75" y="55" font-family="Arial Italic, Arial" font-size="18" font-style="italic" fill="#333">Sign</text>
  <text x="75" y="70" font-family="Arial" font-size="9" fill="#999">Trust your creation</text>
</svg>""",

    "efy.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- EFY-CA logo - circular key -->
  <circle cx="40" cy="38" r="25" fill="none" stroke="#cc4400" stroke-width="3"/>
  <circle cx="40" cy="38" r="16" fill="#cc4400" opacity="0.2"/>
  <text x="40" y="46" text-anchor="middle" font-family="Arial Black, Arial" font-size="16" font-weight="900" fill="#cc4400">EFY</text>
  <text x="80" y="38" font-family="Arial Black, Arial" font-size="22" font-weight="900" fill="#cc4400">EFY</text>
  <text x="80" y="56" font-family="Arial" font-size="14" fill="#333">-CA</text>
  <text x="80" y="70" font-family="Arial" font-size="8" fill="#666">www.efyca.vn</text>
</svg>""",

    "ngca.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- NCC-CA logo in blue/red -->
  <text x="15" y="52" font-family="Arial Black, Arial" font-size="34" font-weight="900">
    <tspan fill="#003399">NC</tspan><tspan fill="#cc0000">CA</tspan>
  </text>
</svg>""",

    "fastca.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- FASTCA logo - blue bg with arrow -->
  <rect x="10" y="10" width="180" height="60" rx="8" fill="#1a2a5a"/>
  <polygon points="25,40 50,20 50,35 100,35 100,45 50,45 50,60" fill="#ff6600"/>
  <text x="115" y="48" font-family="Arial Black, Arial" font-size="22" font-weight="900" fill="white">FASTCA</text>
</svg>""",

    "trustca.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- TrustCA logo - lock icon -->
  <rect x="15" y="30" width="30" height="26" rx="3" fill="#cc4400"/>
  <path d="M21,30 L21,24 Q21,15 30,15 Q39,15 39,24 L39,30" fill="none" stroke="#cc4400" stroke-width="4"/>
  <circle cx="30" cy="43" r="4" fill="white"/>
  <text x="55" y="38" font-family="Arial Black, Arial" font-size="20" font-weight="900" fill="#333">Trust</text>
  <text x="55" y="58" font-family="Arial Black, Arial" font-size="20" font-weight="900" fill="#cc4400">CA</text>
  <text x="55" y="70" font-family="Arial" font-size="8" fill="#666">by SAVIS GROUP</text>
</svg>""",

    "ica.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- I-CA logo - lock circle -->
  <circle cx="50" cy="38" r="28" fill="none" stroke="#333" stroke-width="3"/>
  <rect x="38" y="32" width="24" height="20" rx="3" fill="#333"/>
  <path d="M42,32 L42,28 Q42,22 50,22 Q58,22 58,28 L58,32" fill="none" stroke="#333" stroke-width="3"/>
  <circle cx="50" cy="42" r="3" fill="white"/>
  <text x="88" y="48" font-family="Arial Black, Arial" font-size="24" font-weight="900" fill="#333">I-CA</text>
</svg>""",

    "hiloca.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- HiLo-CA logo - orange circle -->
  <circle cx="35" cy="38" r="28" fill="none" stroke="#FF8800" stroke-width="3"/>
  <text x="35" y="30" text-anchor="middle" font-family="Arial" font-size="9" fill="#FF8800">CA</text>
  <text x="35" y="50" text-anchor="middle" font-family="Arial Black, Arial" font-size="18" font-weight="900" fill="#FF8800">Hi</text>
  <text x="70" y="48" font-family="Arial Black, Arial" font-size="24" font-weight="900" fill="#333">Hilo</text>
  <text x="115" y="48" font-family="Arial" font-size="20" fill="#FF8800">-CA</text>
</svg>""",

    "oneca.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- ONE-CA logo - red circle with 1 -->
  <circle cx="35" cy="38" r="28" fill="#cc0000"/>
  <text x="35" y="50" text-anchor="middle" font-family="Arial Black, Arial" font-size="28" font-weight="900" fill="white">1</text>
  <text x="75" y="48" font-family="Arial Black, Arial" font-size="26" font-weight="900" fill="#cc0000">NE-CA</text>
</svg>""",

    "eca.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 80">
  <rect width="200" height="80" fill="white"/>
  <!-- ECA logo - colorful letters -->
  <text x="15" y="58" font-family="Arial Black, Arial" font-size="48" font-weight="900">
    <tspan fill="#FF6600">E</tspan><tspan fill="#0066CC">C</tspan><tspan fill="#009900">A</tspan>
  </text>
</svg>""",

    "logo_text.svg": """<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 60">
  <rect width="200" height="60" fill="transparent"/>
  <!-- BHXH header logo text -->
  <text x="10" y="30" font-family="Arial Black, Arial" font-size="16" font-weight="900" fill="#ffffff">BẢO HIỂM XÃ HỘI</text>
  <text x="10" y="50" font-family="Arial" font-size="12" fill="#aaccff">VIỆT NAM</text>
</svg>""",

    "chart.png": None,  # Will handle separately
}

out_dir = r'D:\kekhaibaohiem\public\assets\images'
os.makedirs(out_dir, exist_ok=True)

for fname, content in logos.items():
    if content is None:
        continue
    path = os.path.join(out_dir, fname)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'Created: {fname}')

print('All logos created!')
