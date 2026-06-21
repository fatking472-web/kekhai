import re
import os

def update_file(html_path):
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()

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
        color: white;
    }
    .custom-btn-text .light {
        font-weight: 300;
        font-size: 16px;
        color: white;
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

    # 1. Replace globe banner
    banner_img_tag = '<img _ngcontent-c13="" alt="image" class="banner-img" \n                                    src="https://kekhaibaohiem.cc/assets/images/bg_01.svg"\n                                    style="width: auto; max-width: 100%; height: 450px; display: block; margin: 0 auto; object-fit: contain; border: none;">'
    content = content.replace(banner_img_tag, '<div class="custom-banner"></div>')
    
    # Also fallback regex just in case spacing is different
    content = re.sub(r'<img[^>]*src="https://kekhaibaohiem\.cc/assets/images/bg_01\.svg"[^>]*>', '<div class="custom-banner"></div>', content)

    # 2. Replace pie chart
    chart_img = '<img src="https://kekhaibaohiem.cc/images/chart.png"\n                                                style="width: 200px; height: 200px; margin: 0 auto; display: block; object-fit: contain;">'
    content = content.replace(chart_img, '<div class="custom-pie-chart"></div>')
    content = re.sub(r'<img[^>]*src="https://kekhaibaohiem\.cc/images/chart\.png"[^>]*>', '<div class="custom-pie-chart"></div>', content)

    # 3. Replace buttons
    def btn_html(icon_class, icon_name, text_bold, text_light):
        return f'<div class="custom-btn"><i class="material-icons custom-btn-icon {icon_class}">{icon_name}</i><div class="custom-btn-text"><span class="bold">{text_bold}</span><span class="light">{text_light}</span></div></div>'

    # The 6 buttons:
    img1 = '<img _ngcontent-c13="" alt="image"\n                                                    src="https://kekhaibaohiem.cc/assets/images/kekhai.svg">'
    content = content.replace(img1, btn_html('icon-pink', 'edit_document', 'KÊ KHAI', 'HỒ SƠ'))

    # Base64 button
    base64_str = 'data:image/svg+xml;base64,77u/PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNTMuMTIgNDYuNTEiPgo8ZGVmcz4KPHN0eWxlPgouY2xzLTF7ZmlsbDojZmZmO30KLmNscy0ye2ZpbGw6I2I0OGRmZjt9Ci50ZXh0LXRpY2hob3AtYm9sZCB7CiAgZmlsbDogI2ZmZjsKICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAiU2Vnb2UgVUkiLCBSb2JvdG8sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7CiAgZm9udC13ZWlnaHQ6IDkwMDsKICBmb250LXNpemU6IDIwcHg7CiAgbGV0dGVyLXNwYWNpbmc6IC0wLjVweDsKfQoudGV4dC10aWNoaG9wLWxpZ2h0IHsKICBmaWxsOiAjZmZmOwogIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICJTZWdvZSBVSSIsIFJvYm90bywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjsKICBmb250LXdlaWdodDogMzAwOwogIGZvbnQtc2l6ZTogMTlweDsKICBsZXR0ZXItc3BhY2luZzogLTAuNXB4Owp9Cjwvc3R5bGU+CjwvZGVmcz4KPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+CjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+CjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTM4LjExLDQ2LjUxSDM2Ljg0TDM2LDQ2LjRhMTAuNzksMTAuNzksMCwwLDEtOS4xNC04LjgzYy0uMDctLjQxLS4xMS0uODItLjE3LTEuMjJWMzUuMDlhMS43NCwxLjc0LDAsMCwwLDAtLjIsMTAuMjYsMTAuMjYsMCwwLDEsLjYtMi44MywxMC43OSwxMC43OSwwLDAsMSwyMC43NSw1LjY5LDEwLjgsMTAuOCwwLDAsMS04Ljc0LDguNkMzOC45Myw0Ni40MSwzOC41Miw0Ni40NSwzOC4xMSw0Ni41MVptLS42Mi0yLjExQTguNjcsOC42NywwLDEsMCwyOC44LDM1LjcsOC43MSw4LjcxLDAsMCwwLDM3LjQ5LDQ0LjM5WiIvPgo8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zNi43NSwyOC4zOWMwLC4yMiwwLC40MiwwLC42MkEuNjMuNjMsMCwxLDAsMzgsMjljMC0uMjEsMC0uNDIsMC0uNjNBNy4zNCw3LjM0LDAsMCwxLDQ0LjgxLDM1aC0uNzVhLjY0LjY0LDAsMCwwLS42My42My42My42MywwLDAsMCwuNjMuNjRoLjc4YTcuMzQsNy4zNCwwLDAsMS02LjcxLDYuODNjMC0uMjUsMC0uNDksMC0uNzNhLjY0LjY0LDAsMSwwLTEuMjcsMGMwLC4yNCwwLC40OSwwLC43M2E3LjM2LDcuMzYsMCwwLDEtNi43Mi02Ljc0Yy4yNSwwLC41LDAsLjc1LDBhLjU3LjU3LDAsMCwwLC41Mi0uMzguNi42LDAsMCwwLS4wOS0uNjUuNjQuNjQsMCwwLDAtLjUyLS4yNGgtLjYzQTcuMzMsNy4zMywwLDAsMSwzNi43NSwyOC4zOVptLjcsNi40NWEyLjU3LDIuNTcsMCwwLDAtLjE2LS4yMWwtMy0zYTEuNTIsMS41MiwwLDAsMC0uMTktLjE3LjYxLjYxLDAsMCwwLS42Ny0uMDUuNTQuNTQsMCwwLDAtLjMzLjU4LDEsMSwwLDAsMCwuMjYuNWMxLjE3LDEuMTksMi4zNiwyLjM3LDMuNTQsMy41NWEuNjYuNjYsMCwwLDAsMS4wOCwwbDItMmExLjM0LDEuMzQsMCwwLDAsLjE0LS4xNi42My42MywwLDAsMC0uMzgtMSwuNjYuNjYsMCwwLDAtLjY0LjIyWiIvPgo8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zNS44MywwQTEuNzksMS43OSwwLDAsMSwzNywxLjk0YzAsMi43MiwwLDUuNDMsMCw4LjE1LDAsMS4zMS0uNTUsMS44Ni0xLjg3LDEuODYtLjc5LDAtMS41OCwwLTIuMzcsMGExLjQ5LDEuNDksMCwwLDEtMS42LTEuNTVjMC0zLDAtNS45LDAtOC44NUExLjYsMS42LDAsMCwxLDMyLjQxLDBaIi8+CjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTExLjQzLDBhMS43NywxLjc3LDAsMCwxLDEuMjMsMS45M2MwLDIuNzMsMCw1LjQ2LDAsOC4xOSwwLDEuMjYtLjU2LDEuODItMS44MSwxLjgzSDguNjFhMS41NywxLjU3LDAsMCwxLTEuNzktMS44cTAtMy4yLDAtNi40YzAtLjYsMC0xLjIsMC0xLjhBMS43NSwxLjc1LDAsMCwxLDgsMFoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjIsMjMuNzdjLjU2LDAsMS4xMSwwLDEuNjcsMGExLDEsMCwwLDEsMS4xMiwxLjA4cTAsMS43MSwwLDMuNDJhMSwxLDAsMCwxLTEsMS4wN3EtMS43NS4wNi0zLjUxLDBhMSwxLDAsMCwxLTEuMDYtMS4xNHEwLTEuNjQsMC0zLjI5YTEsMSwwLDAsMSwxLjE1LTEuMTVaIi8+CjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTI1LjMzLDQwLjYySDcuMjFjLTEuNDMsMC0yLjA4LS42Ni0yLjA4LTIuMDlxMC03Ljg3LDAtMTUuNzVjMC0xLjQzLjY2LTIuMDgsMi4xLTIuMDhIMzYuNjZhMS43OSwxLjc5LDAsMCwxLDIuMDYsMiwxMy4yOCwxMy4yOCwwLDAsMSwxLjkuMzIsMTMsMTMsMCwwLDEsMy4zLDEuMzFxMC03LjUsMC0xNWMwLS4xMywwLS4yNiwwLS4zOUE0LDQsMCwwLDAsNDAsNXYuNTFjMCwxLjU4LDAsMy4xNiwwLDQuNzRhNC40Niw0LjQ2LDAsMCwxLTQuNSw0LjZjLS45MSwwLTEuODEsMC0yLjcyLDBhNC40OCw0LjQ4LDAsMCwxLTQuNTEtNC42NGMwLTEuNTgsMC0zLjE2LDAtNC43NFY1SDE1LjY0YzAsMS43NCwwLDMuNDUsMCw1LjE2QTQuNDksNC40OSwwLDAsMSwxMSwxNC44N0g4LjU0QTQuNDcsNC40NywwLDAsMSwzLjksMTAuMThxMC0yLjM1LDAtNC42OVY1YTQuMDgsNC4wOCwwLDAsMC0yLjMyLjgzQTQuMTgsNC4xOCwwLDAsMCwwLDkuMzVRMCwxOS42NSwwLDMwYzAsMy41NSwwLDcuMTEsMCwxMC42NmE0LjIzLDQuMjMsMCwwLDAsLjgxLDIuNjcsNC4wNyw0LjA3LDAsMCwwLDMuNDIsMS42M0gyOC4xOEExMi43NywxMi43NywwLDAsMSwyNS4zMyw0MC42MloiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMuNTksMzIuNjVjLTEuMSwwLTIuMTksMC0zLjI5LDBhMS4wNiwxLjA2LDAsMCwwLTEuMTQsMS4xNnEwLDEuNjQsMCwzLjI5YTEuMDUsMS4wNSwwLDAsMCwxLjE1LDEuMTVjLjU0LDAsMS4wOCwwLDEuNjIsMGgxLjYyYTEuMTYsMS4xNiwwLDAsMCwxLS40M2MwLS4yOC0uMDgtLjU2LS4xMS0uODRsLS4wNS0uNDJWMzQuOTFsMC0uMTEsMC0uMTF2MGExMi4zNSwxMi4zNSwwLDAsMSwuMi0xLjQ5QTEuMDcsMS4wNywwLDAsMCwyMy41OSwzMi42NVoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjQuNDMsMzQuN2wwLC4xMSwwLC4xMXYxLjY2bC4wNS40MmMwLC4yNy4wNy41NS4xMS44NGExLjMxLDEuMzEsMCwwLDAsLjItLjc1cTAtMS42MiwwLTMuMjRhMS40MiwxLjQyLDAsMCwwLS4xNC0uNjMsMTIuMzUsMTIuMzUsMCwwLDAtLjIsMS40OVoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTMuMDksMjMuNzdoMS42MmExLDEsMCwwLDEsMS4xNSwxLjA5cTAsMS43MSwwLDMuNDJhMSwxLDAsMCwxLTEuMDgsMS4wN3EtMS43MSwwLTMuNDIsMGExLDEsMCwwLDEtMS4wOC0xLjE2cTAtMS42NCwwLTMuMjlhMSwxLDAsMCwxLDEuMTQtMS4xNFoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTMsMzguMjVjLS41NCwwLTEuMDgsMC0xLjYyLDBhMSwxLDAsMCwxLTEuMTItMS4xMnEwLTEuNjcsMC0zLjMzYTEsMSwwLDAsMSwxLjEtMS4xNHExLjY5LDAsMy4zOCwwYTEsMSwwLDAsMSwxLjEsMS4wNnEwLDEuNzMsMCwzLjQ2YTEsMSwwLDAsMS0xLjEyLDEuMDhIMTNaIi8+Cjx0ZXh0IHg9IjU2IiB5PSIxOSIgY2xhc3M9InRleHQtdGljaGhvcC1ib2xkIj5Uw41DSCBI4buiUDwvdGV4dD4KPHRleHQgeD0iNTYiIHk9IjQyIiBjbGFzcz0idGV4dC10aWNoaG9wLWxpZ2h0Ij7EkEnhu4ZOIFThu6w8L3RleHQ+CjwvZz48L2c+PC9zdmc+DQo='
    img2 = f'<img\n                                                    _ngcontent-c13="" alt="image"\n                                                    src="{base64_str}">'
    content = content.replace(img2, btn_html('icon-purple', 'event_available', 'TÍCH HỢP', 'ĐIỆN TỬ'))

    img3 = '<img\n                                                    _ngcontent-c13="" alt="image"\n                                                    src="https://kekhaibaohiem.cc/assets/images/thanhtoanbhxhdientu-01.svg">'
    content = content.replace(img3, btn_html('icon-yellow', 'request_quote', 'ĐÓNG', 'BHXH ĐIỆN TỬ'))

    img4 = '<img\n                                                    _ngcontent-c13="" alt="image"\n                                                    src="https://kekhaibaohiem.cc/assets/images/dichvucong-01.svg">'
    content = content.replace(img4, btn_html('icon-blue', 'language', 'DỊCH VỤ CÔNG', 'TRỰC TUYẾN'))

    img5 = '<img\n                                                    _ngcontent-c13="" alt="image"\n                                                    src="https://kekhaibaohiem.cc/assets/images/tracuu.svg">'
    content = content.replace(img5, btn_html('icon-green', 'manage_search', 'TRA CỨU', 'HỒ SƠ'))

    img6 = '<img\n                                                    _ngcontent-c13="" alt="image"\n                                                    src="https://kekhaibaohiem.cc/assets/images/tailieu.svg">'
    content = content.replace(img6, btn_html('icon-orange', 'video_library', 'TÀI LIỆU &', 'ỨNG DỤNG'))
    
    # 4. Fallback replacing of buttons with regex for single line formats
    content = re.sub(r'<img[^>]*src="https://kekhaibaohiem\.cc/assets/images/kekhai\.svg"[^>]*>', btn_html('icon-pink', 'edit_document', 'KÊ KHAI', 'HỒ SƠ'), content)
    content = re.sub(r'<img[^>]*src="data:image/svg\+xml;base64,77u/PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXhCb3g9IjAgMCAxNTMuMTIgNDYuNTEiPgo8ZGVmcz4KPHN0eWxlPgouY2xzLTF7ZmlsbDojZmZmO30KLmNscy0ye2ZpbGw6I2I0OGRmZjt9Ci50ZXh0LXRpY2hob3AtYm9sZCB7CiAgZmlsbDogI2ZmZjsKICBmb250LWZhbWlseTogLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0ZW1Gb250LCAiU2Vnb2UgVUkiLCBSb2JvdG8sIEhlbHZldGljYSwgQXJpYWwsIHNhbnMtc2VyaWY7CiAgZm9udC13ZWlnaHQ6IDkwMDsKICBmb250LXNpemU6IDIwcHg7CiAgbGV0dGVyLXNwYWNpbmc6IC0wLjVweDsKfQoudGV4dC10aWNoaG9wLWxpZ2h0IHsKICBmaWxsOiAjZmZmOwogIGZvbnQtZmFtaWx5OiAtYXBwbGUtc3lzdGVtLCBCbGlua01hY1N5c3RlbUZvbnQsICJTZWdvZSBVSSIsIFJvYm90bywgSGVsdmV0aWNhLCBBcmlhbCwgc2Fucy1zZXJpZjsKICBmb250LXdlaWdodDogMzAwOwogIGZvbnQtc2l6ZTogMTlweDsKICBsZXR0ZXItc3BhY2luZzogLTAuNXB4Owp9Cjwvc3R5bGU+CjwvZGVmcz4KPGcgaWQ9IkxheWVyXzIiIGRhdGEtbmFtZT0iTGF5ZXIgMiI+CjxnIGlkPSJMYXllcl8xLTIiIGRhdGEtbmFtZT0iTGF5ZXIgMSI+CjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTM4LjExLDQ2LjUxSDM2Ljg0TDM2LDQ2LjRhMTAuNzksMTAuNzksMCwwLDEtOS4xNC04LjgzYy0uMDctLjQxLS4xMS0uODItLjE3LTEuMjJWMzUuMDlhMS43NCwxLjc0LDAsMCwwLDAtLjIsMTAuMjYsMTAuMjYsMCwwLDEsLjYtMi44MywxMC43OSwxMC43OSwwLDAsMSwyMC43NSw1LjY5LDEwLjgsMTAuOCwwLDAsMS04Ljc0LDguNkMzOC45Myw0Ni40MSwzOC41Miw0Ni40NSwzOC4xMSw0Ni41MVptLS42Mi0yLjExQTguNjcsOC42NywwLDEsMCwyOC44LDM1LjcsOC43MSw4LjcxLDAsMCwwLDM3LjQ5LDQ0LjM5WiIvPgo8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zNi43NSwyOC4zOWMwLC4yMiwwLC40MiwwLC42MkEuNjMuNjMsMCwxLDAsMzgsMjljMC0uMjEsMC0uNDIsMC0uNjNBNy4zNCw3LjM0LDAsMCwxLDQ0LjgxLDM1aC0uNzVhLjY0LjY0LDAsMCwwLS42My42My42My42MywwLDAsMCwuNjMuNjRoLjc4YTcuMzQsNy4zNCwwLDAsMS02LjcxLDYuODNjMC0uMjUsMC0uNDksMC0uNzNhLjY0LjY0LDAsMSwwLTEuMjcsMGMwLC4yNCwwLC40OSwwLC43M2E3LjM2LDcuMzYsMCwwLDEtNi43Mi02Ljc0Yy4yNSwwLC41LDAsLjc1LDBhLjU3LjU3LDAsMCwwLC41Mi0uMzguNi42LDAsMCwwLS4wOS0uNjUuNjQuNjQsMCwwLDAtLjUyLS4yNGgtLjYzQTcuMzMsNy4zMywwLDAsMSwzNi43NSwyOC4zOVptLjcsNi40NWEyLjU3LDIuNTcsMCwwLDAtLjE2LS4yMWwtMy0zYTEuNTIsMS41MiwwLDAsMC0uMTktLjE3LjYxLjYxLDAsMCwwLS42Ny0uMDUuNTQuNTQsMCwwLDAtLjMzLjU4LDEsMSwwLDAsMCwuMjYuNWMxLjE3LDEuMTksMi4zNiwyLjM3LDMuNTQsMy41NWEuNjYuNjYsMCwwLDAsMS4wOCwwbDItMmExLjM0LDEuMzQsMCwwLDAsLjE0LS4xNi42My42MywwLDAsMC0uMzgtMSwuNjYuNjYsMCwwLDAtLjY0LjIyWiIvPgo8cGF0aCBjbGFzcz0iY2xzLTIiIGQ9Ik0zNS44MywwQTEuNzksMS43OSwwLDAsMSwzNywxLjk0YzAsMi43MiwwLDUuNDMsMCw4LjE1LDAsMS4zMS0uNTUsMS44Ni0xLjg3LDEuODYtLjc5LDAtMS41OCwwLTIuMzcsMGExLjQ5LDEuNDksMCwwLDEtMS42LTEuNTVjMC0zLDAtNS45LDAtOC44NUExLjYsMS42LDAsMCwxLDMyLjQxLDBaIi8+CjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTExLjQzLDBhMS43NywxLjc3LDAsMCwxLDEuMjMsMS45M2MwLDIuNzMsMCw1LjQ2LDAsOC4xOSwwLDEuMjYtLjU2LDEuODItMS44MSwxLjgzSDguNjFhMS41NywxLjU3LDAsMCwxLTEuNzktMS44cTAtMy4yLDAtNi40YzAtLjYsMC0xLjIsMC0xLjhBMS43NSwxLjc1LDAsMCwxLDgsMFoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjIsMjMuNzdjLjU2LDAsMS4xMSwwLDEuNjcsMGExLDEsMCwwLDEsMS4xMiwxLjA4cTAsMS43MSwwLDMuNDJhMSwxLDAsMCwxLTEsMS4wN3EtMS43NS4wNi0zLjUxLDBhMSwxLDAsMCwxLTEuMDYtMS4xNHEwLTEuNjQsMC0zLjI5YTEsMSwwLDAsMSwxLjE1LTEuMTVaIi8+CjxwYXRoIGNsYXNzPSJjbHMtMiIgZD0iTTI1LjMzLDQwLjYySDcuMjFjLTEuNDMsMC0yLjA4LS42Ni0yLjA4LTIuMDlxMC03Ljg3LDAtMTUuNzVjMC0xLjQzLjY2LTIuMDgsMi4xLTIuMDhIMzYuNjZhMS43OSwxLjc5LDAsMCwxLDIuMDYsMiwxMy4yOCwxMy4yOCwwLDAsMSwxLjkuMzIsMTMsMTMsMCwwLDEsMy4zLDEuMzFxMC03LjUsMC0xNWMwLS4xMywwLS4yNiwwLS4zOUE0LDQsMCwwLDAsNDAsNXYuNTFjMCwxLjU4LDAsMy4xNiwwLDQuNzRhNC40Niw0LjQ2LDAsMCwxLTQuNSw0LjZjLS45MSwwLTEuODEsMC0yLjcyLDBhNC40OCw0LjQ4LDAsMCwxLTQuNTEtNC42NGMwLTEuNTgsMC0zLjE2LDAtNC43NFY1SDE1LjY0YzAsMS43NCwwLDMuNDUsMCw1LjE2QTQuNDksNC40OSwwLDAsMSwxMSwxNC44N0g4LjU0QTQuNDcsNC40NywwLDAsMSwzLjksMTAuMThxMC0yLjM1LDAtNC42OVY1YTQuMDgsNC4wOCwwLDAsMC0yLjMyLjgzQTQuMTgsNC4xOCwwLDAsMCwwLDkuMzVRMCwxOS42NSwwLDMwYzAsMy41NSwwLDcuMTEsMCwxMC42NmE0LjIzLDQuMjMsMCwwLDAsLjgxLDIuNjcsNC4wNyw0LjA3LDAsMCwwLDMuNDIsMS42M0gyOC4xOEExMi43NywxMi43NywwLDAsMSwyNS4zMyw0MC42MloiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjMuNTksMzIuNjVjLTEuMSwwLTIuMTksMC0zLjI5LDBhMS4wNiwxLjA2LDAsMCwwLTEuMTQsMS4xNnEwLDEuNjQsMCwzLjI5YTEuMDUsMS4wNSwwLDAsMCwxLjE1LDEuMTVjLjU0LDAsMS4wOCwwLDEuNjIsMGgxLjYyYTEuMTYsMS4xNiwwLDAsMCwxLS40M2MwLS4yOC0uMDgtLjU2LS4xMS0uODRsLS4wNS0uNDJWMzQuOTFsMC0uMTEsMC0uMTF2MGExMi4zNSwxMi4zNSwwLDAsMSwuMi0xLjQ5QTEuMDcsMS4wNywwLDAsMCwyMy41OSwzMi42NVoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMjQuNDMsMzQuN2wwLC4xMSwwLC4xMXYxLjY2bC4wNS40MmMwLC4yNy4wNy41NS4xMS44NGExLjMxLDEuMzEsMCwwLDAsLjItLjc1cTAtMS42MiwwLTMuMjRhMS40MiwxLjQyLDAsMCwwLS4xNC0uNjMsMTIuMzUsMTIuMzUsMCwwLDAtLjIsMS40OVoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTMuMDksMjMuNzdoMS42MmExLDEsMCwwLDEsMS4xNSwxLjA5cTAsMS43MSwwLDMuNDJhMSwxLDAsMCwxLTEuMDgsMS4wN3EtMS43MSwwLTMuNDIsMGExLDEsMCwwLDEtMS4wOC0xLjE2cTAtMS42NCwwLTMuMjlhMSwxLDAsMCwxLDEuMTQtMS4xNFoiLz4KPHBhdGggY2xhc3M9ImNscy0yIiBkPSJNMTMsMzguMjVjLS41NCwwLTEuMDgsMC0xLjYyLDBhMSwxLDAsMCwxLTEuMTItMS4xMnEwLTEuNjcsMC0zLjMzYTEsMSwwLDAsMSwxLjEtMS4xNHExLjY5LDAsMy4zOCwwYTEsMSwwLDAsMSwxLjEsMS4wNnEwLDEuNzMsMCwzLjQ2YTEsMSwwLDAsMS0xLjEyLDEuMDhIMTNaIi8+Cjx0ZXh0IHg9IjU2IiB5PSIxOSIgY2xhc3M9InRleHQtdGljaGhvcC1ib2xkIj5Uw41DSCBI4buiUDwvdGV4dD4KPHRleHQgeD0iNTYiIHk9IjQyIiBjbGFzcz0idGV4dC10aWNoaG9wLWxpZ2h0Ij7EkEnhu4ZOIFThu6w8L3RleHQ+CjwvZz48L2c+PC9zdmc+DQo="[^>]*>', btn_html('icon-purple', 'event_available', 'TÍCH HỢP', 'ĐIỆN TỬ'), content)
    content = re.sub(r'<img[^>]*src="https://kekhaibaohiem\.cc/assets/images/thanhtoanbhxhdientu-01\.svg"[^>]*>', btn_html('icon-yellow', 'request_quote', 'ĐÓNG', 'BHXH ĐIỆN TỬ'), content)
    content = re.sub(r'<img[^>]*src="https://kekhaibaohiem\.cc/assets/images/dichvucong-01\.svg"[^>]*>', btn_html('icon-blue', 'language', 'DỊCH VỤ CÔNG', 'TRỰC TUYẾN'), content)
    content = re.sub(r'<img[^>]*src="https://kekhaibaohiem\.cc/assets/images/tracuu\.svg"[^>]*>', btn_html('icon-green', 'manage_search', 'TRA CỨU', 'HỒ SƠ'), content)
    content = re.sub(r'<img[^>]*src="https://kekhaibaohiem\.cc/assets/images/tailieu\.svg"[^>]*>', btn_html('icon-orange', 'video_library', 'TÀI LIỆU &', 'ỨNG DỤNG'), content)

    # Replace company logos
    content = content.replace('https://kekhaibaohiem.cc/assets/images/vinbhxh_logo.svg', 'https://vin-bhxh.vn/assets/images/logo/logo.svg')
    content = content.replace('https://kekhaibaohiem.cc/assets/images/dv2.svg', 'https://upload.wikimedia.org/wikipedia/commons/e/ec/VNPT_Logo.svg')
    content = content.replace('https://kekhaibaohiem.cc/assets/images/misa_logo.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/4b/Misa_logo.png')
    content = content.replace('https://kekhaibaohiem.cc/assets/images/fpt.svg', 'https://upload.wikimedia.org/wikipedia/commons/1/11/FPT_logo_2010.svg')
    content = content.replace('https://kekhaibaohiem.cc/assets/images/vnpost-01.svg', 'https://upload.wikimedia.org/wikipedia/commons/4/49/Vietnam_Post_Logo.svg')
    content = content.replace('https://kekhaibaohiem.cc/assets/images/viettel ca-01.svg', 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Logo_Viettel_2021.svg')
    content = content.replace('https://kekhaibaohiem.cc/assets/images/tc2.svg', 'https://upload.wikimedia.org/wikipedia/commons/3/36/Bkav_logo.svg')

    # Replaces everything else
    def replace_rest_logos(match):
        name = match.group(1).split('.')[0].replace('_logo', '').replace('-', ' ').upper()
        return f'https://placehold.co/200x80/ffffff/333333?text={name}'

    content = re.sub(r'https://kekhaibaohiem\.cc/assets/images/([a-zA-Z0-9_\-\s]+)\.(?:svg|png|jpg)', replace_rest_logos, content)
    content = re.sub(r'https://kekhaibaohiem\.cc/images/([a-zA-Z0-9_\-\s]+)\.(?:svg|png|jpg)', replace_rest_logos, content)

    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(content)

update_file(r'D:\kekhaibaohiem\public\index.html')
update_file(r'D:\kekhaibaohiem\index.html')
update_file(r'D:\kekhaibaohiem\public\admin-login.html')
update_file(r'D:\kekhaibaohiem\public\dang-ky.html')

print('UI Restoration complete safely.')
