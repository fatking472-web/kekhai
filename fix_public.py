import sys
import re

html_path = 'd:/kekhaibaohiem/public/index.html'
with open(html_path, 'r', encoding='latin-1') as f:
    content = f.read()

# Remove banner
content = re.sub(r'<div _ngcontent-c13=\"\" class=\"banner\">.*?</div>\s*</div>', '', content, count=1, flags=re.DOTALL)

# Keep only the first menu-item-box in ul.ul-menu
def fix_menu(m):
    ul_content = m.group(1)
    items = re.findall(r'<li _ngcontent-c13=\"\" class=\"menu-item-box\">.*?</li>', ul_content, flags=re.DOTALL)
    if items:
        # Keep the first item only
        return '<ul _ngcontent-c13=\"\" class=\"ul-menu custom-menu-grid\">\n    ' + items[0] + '\n</ul>'
    return m.group(0)

content = re.sub(r'<ul _ngcontent-c13=\"\" class=\"ul-menu custom-menu-grid\">(.*?)</ul>', fix_menu, content, count=1, flags=re.DOTALL)

with open(html_path, 'w', encoding='latin-1') as f:
    f.write(content)

print('Done!')
