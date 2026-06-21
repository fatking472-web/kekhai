const fs = require('fs');

const createSvg = (filename, color, iconPaths, title1, title2) => {
    let title2Color = title2.includes("ỨNG DẤNG") ? '#ffffff' : '#85b8eb';
    let title2Font = title2.includes("ỨNG DẤNG") ? '800' : '400';
    
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 60">
    <defs>
        <style>
            .icon { fill: ${color}; }
            .icon-stroke { stroke: ${color}; fill: none; stroke-width: 2.5; stroke-linecap: round; stroke-linejoin: round; }
            .title-bold { fill: #ffffff; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: 800; font-size: 19px; text-transform: uppercase; }
            .title-light { fill: ${title2Color}; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; font-weight: ${title2Font}; font-size: 17px; text-transform: uppercase; }
        </style>
    </defs>
    <g transform="translate(15, 10)">
        ${iconPaths}
    </g>
    <text x="75" y="28" class="title-bold">${title1}</text>
    <text x="75" y="50" class="title-light">${title2}</text>
</svg>`;
    fs.writeFileSync(`d:/kekhaibaohiem/public/assets/images/${filename}`, svg);
};

// 1. Kê khai hồ sġ (Pink doc + pen)
createSvg('btn_kekhai.svg', '#e33075', `
    <path class="icon-stroke" stroke-width="3" d="M22,2 H6 C3.8,2 2,3.8 2,6 V34 C2,36.2 3.8,38 6,38 H16"/>
    <path class="icon-stroke" d="M22,2 L32,12 V20"/>
    <path class="icon-stroke" d="M22,2 V12 H32"/>
    <line class="icon-stroke" x1="8" y1="12" x2="16" y2="12"/>
    <line class="icon-stroke" x1="8" y1="20" x2="22" y2="20"/>
    <line class="icon-stroke" x1="8" y1="28" x2="16" y2="28"/>
    <circle class="icon" cx="30" cy="30" r="12" />
    <path fill="#fff" d="M28,26 l4,4 l-4,4 l-4,-4 z M26,32 l1,2 l-2,1 z"/>
`, 'KÊ KHAI', 'HỒ SĢ');

// 2. Đóng BHXH điện tử (Yellow doc + coin)
createSvg('btn_dong.svg', '#f8cc1b', `
    <path class="icon-stroke" stroke-width="3" d="M22,2 H6 C3.8,2 2,3.8 2,6 V34 C2,36.2 3.8,38 6,38 H16"/>
    <path class="icon-stroke" d="M22,2 L32,12 V20"/>
    <path class="icon-stroke" d="M22,2 V12 H32"/>
    <line class="icon-stroke" x1="8" y1="12" x2="16" y2="12"/>
    <line class="icon-stroke" x1="8" y1="20" x2="22" y2="20"/>
    <line class="icon-stroke" x1="8" y1="28" x2="16" y2="28"/>
    <circle class="icon" cx="30" cy="30" r="12" />
    <text x="30" y="36" fill="#0f2a4a" font-size="16" font-family="sans-serif" font-weight="bold" text-anchor="middle">$</text>
`, 'ĐÓNG', 'BHXH ĐIỆN TỖ');

// 3. Tra cứu hồ sġ (Green monitor + glass)
createSvg('btn_tracuu.svg', '#8dc63f', `
    <rect class="icon-stroke" stroke-width="3" x="2" y="6" width="36" height="24" rx="2"/>
    <line class="icon-stroke" stroke-width="3" x1="12" y1="36" x2="28" y2="36"/>
    <line class="icon-stroke" stroke-width="3" x1="20" y1="30" x2="20" y2="36"/>
    <circle class="icon" cx="30" cy="30" r="12" />
    <circle fill="none" stroke="#0f2a4a" stroke-width="2" cx="28" cy="28" r="4"/>
    <line stroke="#0f2a4a" stroke-width="2" x1="31" y1="31" x2="35" y2="35"/>
`, 'TRA C8nUu', 'HỐ S��');

// 4. Dịch vụ công trực tuyến (Blue globe + laptop)
createSvg('btn_dichvucong.svg', '#5b9bd5', `
    <circle class="icon-stroke" stroke-width="2" cx="16" cy="18" r="14"/>
    <ellipse class="icon-stroke" stroke-width="2" cx="16" cy="18" rx="6" ry="14"/>
    <line class="icon-stroke" stroke-width="2" x1="2" y1="18" x2="30" y2="18"/>
    <rect class="icon-stroke" fill="#0f2a4a" stroke-width="2" x="22" y="24" width="18" height="12" rx="1"/>
    <path class="icon" d="M18,38 h26 v2 h-26 z"/>
    <circle fill="#fff" cx="31" cy="30" r="2"/>
`, 'DỊCH V�h CÔNG', 'TRỰC TUYẾN');

// 5. Tài liệu & ứng dụng (Orange book)
createSvg('btn_tailieu.svg', '#e47d25', `
    <path class="icon-stroke" stroke-width="3" d="M6,6 H20 V34 H6 Z"/>
    <path class="icon-stroke" stroke-width="3" d="M20,6 C26,6 34,10 34,10 V38 C34,38 26,34 20,34"/>
    <path class="icon-stroke" d="M10,12 h6"/>
    <path class="icon-stroke" d="M10,18 h6"/>
    <circle class="icon" cx="27" cy="24" r="9"/>
    <polygon fill="#fff" points="25,20 25,28 31,24"/>
`, 'TÀI LIỆU &', 'ỠNG D�hNG');

console.log('5 SVGs generated successfully!');
