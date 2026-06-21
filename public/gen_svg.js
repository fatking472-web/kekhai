const fs = require('fs');

let svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-400 -400 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="glow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,255,255,0.15)"/>
      <stop offset="100%" stop-color="transparent"/>
    </radialGradient>
  </defs>
  <!-- Base background (transparent) -->
  <rect x="-400" y="-400" width="800" height="800" fill="url(#glow)" />
  <g stroke="rgba(255,255,255,0.15)" fill="none" stroke-width="1.5">
    <!-- Central circles -->
    <circle r="40" stroke-width="2" />
    <circle r="120" stroke-width="3" />
    <circle r="130" stroke-width="1" />
    <circle r="190" stroke-width="2" />
    <circle r="200" stroke-width="4" />
    <circle r="280" stroke-width="1" stroke-dasharray="6 6" />
    <circle r="300" stroke-width="3" />
    <circle r="380" stroke-width="2" />
    
    <!-- 14-point Star -->
    <g fill="rgba(255,255,255,0.05)">`;

// Generate 14-point star
let starPoints = [];
for(let i=0; i<28; i++) {
  let angle = (i * Math.PI) / 14;
  let r = i % 2 === 0 ? 120 : 40;
  starPoints.push(`${Math.sin(angle) * r},${-Math.cos(angle) * r}`);
}
svg += `<polygon points="${starPoints.join(' ')}" />`;

// Add geometric details (triangles/rays)
svg += `</g>\n<g>`;
for(let i=0; i<14; i++) {
  let angle = (i * 360) / 14;
  svg += `<g transform="rotate(${angle})">
    <path d="M -15 -130 L 0 -190 L 15 -130 Z" fill="rgba(255,255,255,0.08)" stroke-width="1"/>
    <circle cx="0" cy="-240" r="10" />
    <circle cx="0" cy="-240" r="4" fill="rgba(255,255,255,0.15)" />
    <path d="M 0 -300 L 0 -380" stroke-dasharray="4 4"/>
  </g>`;
}
svg += `</g></g></svg>`;

fs.writeFileSync('d:/kekhaibaohiem/public/assets/images/trong_dong_bg.svg', svg);
console.log('SVG generated!');
