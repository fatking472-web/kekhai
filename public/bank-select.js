// Autocomplete for bankName selection
(function() {
  const style = document.createElement('style');
  style.textContent = `
    .bank-autocomplete-wrapper {
      position: relative;
      width: 100%;
    }
    .bank-autocomplete-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      margin-top: 4px;
      background: #ffffff;
      border: 1px solid #dce3eb;
      border-radius: 8px;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      max-height: 250px;
      overflow-y: auto;
      z-index: 99999;
      box-sizing: border-box;
    }
    .bank-autocomplete-item {
      padding: 10px 14px;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 12px;
      border-bottom: 1px solid #f2f4f7;
      transition: background 0.2s;
    }
    .bank-autocomplete-item:hover {
      background: #f9fafb;
    }
    .bank-autocomplete-logo {
      width: 40px;
      height: 24px;
      object-fit: contain;
      border-radius: 2px;
      background: #f9fafb;
      padding: 2px;
      border: 1px solid #f2f4f7;
    }
    .bank-autocomplete-logo-placeholder {
      width: 40px;
      height: 24px;
      border-radius: 2px;
      background: #1083ff;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 8px;
      font-weight: bold;
      text-transform: uppercase;
    }
    .bank-autocomplete-text {
      display: flex;
      flex-direction: column;
      gap: 2px;
      text-align: left;
    }
    .bank-autocomplete-shortname {
      font-weight: bold;
      font-size: 14px;
      color: #1d2939;
    }
    .bank-autocomplete-fullname {
      font-size: 12px;
      color: #667085;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 250px;
    }
    .bank-autocomplete-arrow {
      position: absolute;
      right: 14px;
      top: 50%;
      transform: translateY(-50%);
      pointer-events: none;
      color: #98a2b3;
      font-size: 12px;
      transition: transform 0.2s;
    }
    .bank-autocomplete-wrapper.open .bank-autocomplete-arrow {
      transform: translateY(-50%) rotate(180deg);
    }
  `;
  document.head.appendChild(style);

  const fallbackBanks = [
    { shortName: 'Vietcombank', name: 'Ngân hàng TMCP Ngoại Thương Việt Nam', logo: 'https://cdn.vietqr.io/img/VCB.png' },
    { shortName: 'VietinBank', name: 'Ngân hàng TMCP Công Thương Việt Nam', logo: 'https://cdn.vietqr.io/img/ICB.png' },
    { shortName: 'BIDV', name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam', logo: 'https://cdn.vietqr.io/img/BIDV.png' },
    { shortName: 'Agribank', name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam', logo: 'https://cdn.vietqr.io/img/VBA.png' },
    { shortName: 'MBBank', name: 'Ngân hàng TMCP Quân đội', logo: 'https://cdn.vietqr.io/img/MB.png' },
    { shortName: 'Techcombank', name: 'Ngân hàng TMCP Kỹ Thương Việt Nam', logo: 'https://cdn.vietqr.io/img/TCB.png' },
    { shortName: 'VPBank', name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng', logo: 'https://cdn.vietqr.io/img/VPB.png' },
    { shortName: 'ACB', name: 'Ngân hàng TMCP Á Châu', logo: 'https://cdn.vietqr.io/img/ACB.png' },
    { shortName: 'TPBank', name: 'Ngân hàng TMCP Tiên Phong', logo: 'https://cdn.vietqr.io/img/TPB.png' },
    { shortName: 'Sacombank', name: 'Ngân hàng TMCP Sài Gòn Thương Tín', logo: 'https://cdn.vietqr.io/img/STB.png' },
    { shortName: 'HDBank', name: 'Ngân hàng TMCP Phát triển Nhà TP. Hồ Chí Minh', logo: 'https://cdn.vietqr.io/img/HDB.png' },
    { shortName: 'SHB', name: 'Ngân hàng TMCP Sài Gòn - Hà Nội', logo: 'https://cdn.vietqr.io/img/SHB.png' },
    { shortName: 'VIB', name: 'Ngân hàng TMCP Quốc tế Việt Nam', logo: 'https://cdn.vietqr.io/img/VIB.png' },
    { shortName: 'MSB', name: 'Ngân hàng TMCP Hàng Hải Việt Nam', logo: 'https://cdn.vietqr.io/img/MSB.png' },
    { shortName: 'OCB', name: 'Ngân hàng TMCP Phương Đông', logo: 'https://cdn.vietqr.io/img/OCB.png' },
    { shortName: 'SeABank', name: 'Ngân hàng TMCP Đông Nam Á', logo: 'https://cdn.vietqr.io/img/SEAB.png' },
    { shortName: 'LPBank', name: 'Ngân hàng TMCP Bưu điện Liên Việt', logo: 'https://cdn.vietqr.io/img/LPB.png' },
    { shortName: 'Eximbank', name: 'Ngân hàng TMCP Xuất Nhập Khẩu Việt Nam', logo: 'https://cdn.vietqr.io/img/EIB.png' },
    { shortName: 'PVcomBank', name: 'Ngân hàng TMCP Đại Chúng Việt Nam', logo: 'https://cdn.vietqr.io/img/PVC.png' },
    { shortName: 'BacABank', name: 'Ngân hàng TMCP Bắc Á', logo: 'https://cdn.vietqr.io/img/BAB.png' },
    { shortName: 'DongABank', name: 'Ngân hàng TMCP Đông Á', logo: 'https://cdn.vietqr.io/img/DOB.png' },
    { shortName: 'ABBANK', name: 'Ngân hàng TMCP An Bình', logo: 'https://cdn.vietqr.io/img/ABB.png' },
    { shortName: 'NamABank', name: 'Ngân hàng TMCP Nam Á', logo: 'https://cdn.vietqr.io/img/NAB.png' },
    { shortName: 'VietBank', name: 'Ngân hàng TMCP Việt Nam Thương Tín', logo: 'https://cdn.vietqr.io/img/VBB.png' },
    { shortName: 'NCB', name: 'Ngân hàng TMCP Quốc Dân', logo: 'https://cdn.vietqr.io/img/NCB.png' },
    { shortName: 'OceanBank', name: 'Ngân hàng Thương mại TNHH MTV Đại Dương', logo: 'https://cdn.vietqr.io/img/OCB.png' }
  ];

  let banksList = [...fallbackBanks];

  // Fetch from VietQR
  fetch('https://api.vietqr.io/v2/banks')
    .then(r => r.json())
    .then(res => {
      if (res && res.code === '00' && res.data && res.data.length > 0) {
        banksList = res.data.map(b => ({
          shortName: b.shortName || b.code,
          name: b.name,
          logo: b.logo
        }));
      }
    })
    .catch(err => console.log('Could not load online banks, using fallback list', err));

  function initBankInputs() {
    const inputs = document.querySelectorAll('input[name="bankName"]');
    inputs.forEach(input => {
      if (input.dataset.bankInit) return;
      input.dataset.bankInit = 'true';

      // Setup wrapper
      const wrapper = document.createElement('div');
      wrapper.className = 'bank-autocomplete-wrapper';
      input.parentNode.insertBefore(wrapper, input);
      wrapper.appendChild(input);

      // Arrow
      const arrow = document.createElement('span');
      arrow.className = 'bank-autocomplete-arrow';
      arrow.innerHTML = '&#9662;';
      wrapper.appendChild(arrow);

      // Dropdown
      const dropdown = document.createElement('div');
      dropdown.className = 'bank-autocomplete-dropdown';
      dropdown.style.display = 'none';
      wrapper.appendChild(dropdown);

      function renderList(query = '') {
        dropdown.innerHTML = '';
        const cleanQuery = query.toLowerCase().trim();
        const filtered = banksList.filter(b => 
          b.shortName.toLowerCase().includes(cleanQuery) || 
          b.name.toLowerCase().includes(cleanQuery)
        );

        if (filtered.length === 0) {
          const empty = document.createElement('div');
          empty.className = 'bank-autocomplete-item';
          empty.style.justifyContent = 'center';
          empty.style.color = '#98a2b3';
          empty.textContent = 'Không tìm thấy ngân hàng';
          dropdown.appendChild(empty);
          return;
        }

        filtered.forEach(bank => {
          const item = document.createElement('div');
          item.className = 'bank-autocomplete-item';

          const textDiv = document.createElement('div');
          textDiv.className = 'bank-autocomplete-text';

          const img = document.createElement('img');
          img.className = 'bank-autocomplete-logo';
          img.src = bank.logo;
          img.alt = bank.shortName;
          img.onerror = function() {
            img.style.display = 'none';
            if (!item.querySelector('.bank-autocomplete-logo-placeholder')) {
              const placeholder = document.createElement('div');
              placeholder.className = 'bank-autocomplete-logo-placeholder';
              placeholder.textContent = bank.shortName.slice(0, 3);
              item.insertBefore(placeholder, textDiv);
            }
          };

          const shortSpan = document.createElement('span');
          shortSpan.className = 'bank-autocomplete-shortname';
          shortSpan.textContent = bank.shortName;

          const nameSpan = document.createElement('span');
          nameSpan.className = 'bank-autocomplete-fullname';
          nameSpan.textContent = bank.name;

          textDiv.appendChild(shortSpan);
          textDiv.appendChild(nameSpan);

          item.appendChild(img);
          item.appendChild(textDiv);

          item.onmousedown = (e) => {
            e.preventDefault();
            input.value = bank.shortName;
            input.dispatchEvent(new Event('input', { bubbles: true }));
            input.dispatchEvent(new Event('change', { bubbles: true }));
            closeDropdown();
          };

          dropdown.appendChild(item);
        });
      }

      function showDropdown() {
        wrapper.classList.add('open');
        dropdown.style.display = 'block';
        renderList(input.value);
      }

      function closeDropdown() {
        wrapper.classList.remove('open');
        dropdown.style.display = 'none';
      }

      input.addEventListener('focus', showDropdown);
      input.addEventListener('click', showDropdown);
      input.addEventListener('input', () => {
        showDropdown();
        renderList(input.value);
      });
      input.addEventListener('blur', () => {
        setTimeout(closeDropdown, 200);
      });
    });
  }

  // Run on page load and dynamically check
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initBankInputs);
  } else {
    initBankInputs();
  }
  // Periodically check for dynamically added elements
  setInterval(initBankInputs, 1000);
})();
