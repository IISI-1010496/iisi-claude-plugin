/**
 * TDX Form Silent Fill Script
 * 採用靜默填充技術，不觸發 UI 彈窗
 */
(async () => {
  /* 此處由 Agent 在執行前注入 const data = { ... }; */
  if (typeof data === 'undefined') {
    console.error("Data object is missing.");
    return;
  }

  const setVal = (el, val) => {
    if (!el) return;
    el.value = val;
    ['input', 'change', 'blur'].forEach(e => el.dispatchEvent(new Event(e, { bubbles: true })));
  };

  const items = Array.from(document.querySelectorAll('div[role="listitem"]'));

  items.forEach(item => {
    const text = item.innerText;
    
    // 1. 文字與區域填寫
    if (text.includes('電子郵件')) setVal(item.querySelector('input'), data.email);
    else if (text.includes('填單日期')) setVal(item.querySelector('input[type="date"]'), data.date);
    else if (text.includes('廠商承辦人')) setVal(item.querySelector('input'), data.vendor);
    else if (text.includes('緊急聯絡電話')) setVal(item.querySelector('input'), data.phone);
    else if (text.includes('維護作業內容')) setVal(item.querySelector('textarea'), data.content);
    
    // 2. 多選/單選項目 (使用文字匹配)
    const options = item.querySelectorAll('div[role="checkbox"], div[role="radio"]');
    options.forEach(opt => {
      if (data.allTargets.some(t => opt.innerText.includes(t))) {
        if (opt.getAttribute('aria-checked') !== 'true') opt.click();
      }
    });

    // 3. 時間區塊 (處理內嵌日期與 AM/PM)
    if (text.includes('時間')) {
      const t = text.includes('開始') ? data.startTime : data.endTime;
      setVal(item.querySelector('input[type="date"]'), data.date);
      setVal(item.querySelector('input[aria-label="小時"]'), t.h);
      setVal(item.querySelector('input[aria-label="分鐘"]'), t.m);
      const ampm = item.querySelector('div[role="listbox"][aria-label*="上午"]');
      if (ampm && !ampm.innerText.includes(t.p)) {
        ampm.click();
        setTimeout(() => {
          const opt = Array.from(document.querySelectorAll('div[role="option"]')).find(o => o.innerText.includes(t.p));
          if (opt) opt.click();
        }, 150);
      }
    }

    // 4. 下拉選單靜默填充 (不彈出 UI)
    if (text.includes('網站平台維護公告')) {
      const lb = item.querySelector('div[role="listbox"]');
      if (lb) {
        const d = lb.querySelector('.vR7_yc, .MocG8c');
        if (d) { d.innerText = data.announcement; d.classList.remove('isPlaceholder'); }
        const hi = item.querySelector('input[type="hidden"]');
        if (hi) { hi.value = data.announcement; hi.dispatchEvent(new Event('change', { bubbles: true })); }
      }
    }
  });
  console.log("TDX Form Filled Successfully");
})();
