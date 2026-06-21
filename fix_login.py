import os

def fix_file(filepath):
    if not os.path.exists(filepath):
        print(f"File {filepath} not found.")
        return
        
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
        
    # 1. Update the login button link and remove id so JS doesn't intercept
    # Find: <a href="#" id="btn-show-login"
    # Replace: <a href="dang-nhap.html" id="btn-show-login"
    # Wait, if JS intercepts, it will prevent default. Let's just remove the id or change to id="btn-dang-nhap-new"
    content = content.replace('<a href="#" id="btn-show-login"', '<a href="dang-nhap.html" id="btn-dang-nhap-new"')
    
    # 2. Remove the modal HTML completely
    start_tag = '<div class="cdk-overlay-container" id="modal-login"'
    if start_tag in content:
        start_idx = content.find(start_tag)
        # Find the matching closing div. 
        # A simple way since it's at the end before script tags:
        end_str = '</div>\n\n<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>'
        if end_str in content[start_idx:]:
            end_idx = content.find(end_str, start_idx)
            content = content[:start_idx] + content[end_idx + 7:] # keep \n\n<script...
            print(f"Removed modal in {filepath}")
        else:
            # alternative
            end_str2 = '</div>\n<script src="https://cdn.jsdelivr.net/npm/sweetalert2@11"></script>'
            if end_str2 in content[start_idx:]:
                end_idx = content.find(end_str2, start_idx)
                content = content[:start_idx] + content[end_idx + 7:]
                print(f"Removed modal in {filepath}")
            else:
                print(f"Could not find end of modal in {filepath}")
    else:
        print(f"Modal start tag not found in {filepath}")
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Updated {filepath}")

fix_file('d:\\kekhaibaohiem\\index.html')
fix_file('d:\\kekhaibaohiem\\public\\index.html')
