const fs = require('fs');
const path = require('path');

const cssPath = path.join(__dirname, 'public', 'register-flow.css');
let css = fs.readFileSync(cssPath, 'utf8');

css = css.replace(/(\d+)px/g, (match, p1) => {
  const val = parseInt(p1, 10);
  if (val >= 8 && val !== 100) { // Keep 100% or 100px for some things? Wait, let's just scale everything >= 8.
    // Actually, header is 100px. 100 * 0.8 = 80px. That's fine.
    // width: min(1350px, 100%) -> 1350 * 0.8 = 1080px. Let's make 1350px explicitly 1140px.
    if (val === 1350) return '1140px';
    return Math.round(val * 0.8) + 'px';
  }
  return match;
});

fs.writeFileSync(cssPath, css);
console.log("Scaled CSS by 0.8");
