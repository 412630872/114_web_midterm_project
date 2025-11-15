// 當 DOM 完全載入後執行整個程式
document.addEventListener('DOMContentLoaded',()=>{

  // --- 1. 生成導航列 (從隱藏的 #navbar-data 讀取) ---
  const navbarItems = document.querySelectorAll('#navbar-data li');
  const navbarUl = document.getElementById("navbar-items");
  navbarItems.forEach(item => {
    // 為每個 li 建立一個 .nav-item 與連結
    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a class="nav-link" href="${item.dataset.href}">${item.dataset.name}</a>`;
    navbarUl.appendChild(li);
  });

  // --- 2. 生成餐廳區塊 (從隱藏的 #restaurant-data 讀取) ---
  const restaurantDivs = document.querySelectorAll('#restaurant-data div');
  const restaurants = {};

  // 將相同 category 的餐廳收在同一陣列: restaurants[category] = [...]
  restaurantDivs.forEach(div => {
    const cat = div.dataset.category;
    if (!restaurants[cat]) restaurants[cat] = [];
    restaurants[cat].push({
      name: div.dataset.name,
      phone: div.dataset.phone,
      img: div.dataset.img,
      link: div.dataset.link
    });
  });

  // 把每個 category 產生一個 section，內含多張卡片
  const sectionsContainer = document.getElementById("restaurant-sections");
  for (let category in restaurants) {
const section = document.createElement("section");
section.id = category;
section.className = "category-section py-5";
    const container = document.createElement("div");
    container.className = "container";

    const title = document.createElement("h2");
    title.className = "category-title text-center mb-5";
    title.textContent = category;
    container.appendChild(title);

    const row = document.createElement("div");
    row.className = "row";

    restaurants[category].forEach(rest => {
      // 建立單張餐廳卡片 (含圖片、名稱、電話、連結)
      const col = document.createElement("div");
      col.className = "col-md-6 mb-4";
      col.innerHTML = `
        <div class="card h-100">
          <img src="${rest.img}" class="card-img-top" alt="${rest.name}">
          <div class="card-body">
            <h5 class="card-title">${rest.name}</h5>
            <p class="card-text">電話: ${rest.phone}</p>
            <a href="${rest.link}" class="btn btn-primary" target="_blank">連結</a>
          </div>
        </div>
      `;
      row.appendChild(col);
    });

    container.appendChild(row);
    section.appendChild(container);
    sectionsContainer.appendChild(section);
  }

  // --- 3. 生成表單 (動態建置欄位 + 驗證機制) ---
  const allRestaurants = Array.from(restaurantDivs).map(d=>d.dataset.name);
  const contactContainer = document.getElementById("contact-container");
  const form = document.createElement('form');
  form.id = "contactForm";
  form.noValidate = true; // 關閉瀏覽器預設驗證提示，改用自訂行為

  /**
   * 工具函式 createFieldHtml
   * 目的：建立一個含 label + control + feedback(p) 的欄位包裝元素
   * 傳入：{id, labelText, controlHtml}
   * 傳出：{wrap, control, feedback} 三個元素方便後續操作
   */
  function createFieldHtml({id, labelText, controlHtml}) {
    const wrap = document.createElement('div');
    wrap.className = 'mb-3';

    // label
    const label = document.createElement('label');
    label.className = 'form-label';
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);

    // control (input/select/textarea) 由 controlHtml 產生
    const temp = document.createElement('div');
    temp.innerHTML = controlHtml.trim();
    const control = temp.firstElementChild;
    control.id = id;
    control.classList.add('form-control'); // 預設加入 form-control，select 會再調整
    wrap.appendChild(control);

    // feedback p：顯示自訂錯誤文字（初始為空）
    const feedback = document.createElement('p');
    feedback.className = 'form-text text-danger';
    feedback.id = `${id}-feedback`;
    feedback.textContent = '';
    // 將 feedback 與 control 以 aria-describedby 連結（可及性）
    control.setAttribute('aria-describedby', feedback.id);

    // 若 control 是 select 或 textarea，調整 class
    if (control.tagName.toLowerCase() === 'select') {
      control.classList.remove('form-control');
      control.classList.add('form-select');
    }
    if (control.tagName.toLowerCase() === 'textarea') {
      control.classList.remove('form-control');
      control.classList.add('form-control');
    }

    wrap.appendChild(feedback);
    return {wrap, control, feedback};
  }

  // 建立暱稱欄位
  const nick = createFieldHtml({
    id: 'nickname',
    labelText: '暱稱',
    controlHtml: `<input type="text" />`
  });
  form.appendChild(nick.wrap);

  // 建立餐廳下拉（含空白選項）
  const restOptions = ['<option value="">-- 請選擇 --</option>'].concat(allRestaurants.map(n=>`<option value="${n}">${n}</option>`)).join('');
  const restField = createFieldHtml({
    id: 'restaurant',
    labelText: '餐廳名稱',
    controlHtml: `<select>${restOptions}</select>`
  });
  form.appendChild(restField.wrap);

  // --- 星星評分：視覺星群 + 隱藏欄位用於驗證 ---
  // ratingCategories: 三項評分
  const ratingCategories = ["服務", "衛生", "餐點滿意度"];
  const ratingsState = {}; // 存視覺目前的評分（1~5）
  const ratingHiddenInputs = {}; // 隱藏 input，用於 setCustomValidity 與表單驗證
  const ratingFeedbacks = {}; // 對應每個星群的 feedback <p>

  ratingCategories.forEach(cat=>{
    ratingsState[cat] = 0; // 初始為 0 (未評分)

    // 外包裝 wrap
    const wrap = document.createElement('div');
    wrap.className = 'mb-3';

    // 顯示 label
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = cat;
    wrap.appendChild(label);

    // 星群容器 (視覺用途)
    const starContainer = document.createElement('div');
    starContainer.className = 'rating-star-container';
    starContainer.setAttribute('aria-label', cat + ' 評分');

    // feedback p（顯示錯誤文字），id 以 safeId 組成
    const fb = document.createElement('p');
    fb.className = 'form-text text-danger';
    const safeId = `rating-${cat.replace(/\s+/g,'-')}`.toLowerCase();
    fb.id = `${safeId}-feedback`;
    fb.textContent = '';
    ratingFeedbacks[cat] = fb;

    // 隱藏 input：把星星值寫入這個 input，讓表單驗證能使用 setCustomValidity
    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.id = `${safeId}-value`;
    hidden.name = `${safeId}`; // 會是表單的一部分
    hidden.value = '0'; // 初始 0 表示未評分
    hidden.setAttribute('aria-describedby', fb.id);
    hidden.setAttribute('aria-invalid', 'false');
    ratingHiddenInputs[cat] = hidden;

    // 建立 5 顆星（span），**不加入 tabindex / 不綁 keydown**（移除鍵盤支援）
    for(let i=1;i<=5;i++){
      const star = document.createElement('span');
      star.className = 'rating-star';
      star.dataset.value = i;
      // 不再加入 tabindex 或 role 屬性（移除鍵盤支援）
      star.setAttribute('aria-label', `${i} 星`);
      star.innerHTML = '★';

      // click 選星：設定視覺、寫入 hidden，並清除該星群錯誤
      star.addEventListener('click', ()=>{
        setRating(cat, i);
        hidden.value = String(i);
        clearErrorRating(cat);
      });

      // 不再綁 keyboard 事件 (keydown)，因此無鍵盤控制

      starContainer.appendChild(star);
    }

    // 設定視覺星等函式：將 <= value 的星標記為 active，並更新 aria-checked（視覺與可及性資訊）
    function setRating(category, value){
      ratingsState[category] = value;
      const children = starContainer.children;
      for(let idx=0; idx<children.length; idx++){
        const s = children[idx];
        const val = Number(s.dataset.value);
        const isActive = val <= value;
        s.classList.toggle('active', isActive);
        // aria-checked 為視覺輔助資訊，保留但不做 keyboard 導向
        s.setAttribute('aria-checked', isActive ? 'true' : 'false');
      }
    }

    // 由於移除鍵盤支援，改用 mouseleave 作為「離開星群後檢查是否已選星」的時機
    starContainer.addEventListener('mouseleave', ()=>{
      // 使用短延遲讓 click 事件先完成（若使用者剛好點選）
      setTimeout(()=>{
        const current = ratingHiddenInputs[cat].value;
        if(!current || current === '0'){
          applyErrorRating(cat, `請為 ${cat} 評分`);
        } else {
          clearErrorRating(cat);
        }
      }, 0);
    });

    // append hidden input & starContainer & feedback to wrap
    wrap.appendChild(starContainer);
    wrap.appendChild(hidden);
    wrap.appendChild(fb);

    form.appendChild(wrap);
  });

  // 建立評論欄位
  const comment = createFieldHtml({
    id: 'comment',
    labelText: '評論',
    controlHtml: `<textarea rows="4"></textarea>`
  });
  form.appendChild(comment.wrap);

  // 建立送出按鈕（包含 spinner，模擬送出狀態）
  const submitDiv = document.createElement('div');
  submitDiv.className = 'mb-3';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary w-100';
  submitBtn.innerHTML = `<span class="btn-text">送出</span> <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>`;
  submitDiv.appendChild(submitBtn);
  form.appendChild(submitDiv);

  // 把表單放到頁面上
  contactContainer.appendChild(form);

  // ---------- 驗證邏輯：fields 陣列包含所有需驗證的 control ----------
  // 先把暱稱 / 餐廳 / 評論 三欄放入 fields
  const fields = [
    {
      el: nick.control,
      fb: nick.feedback,
      validator: () => {
        const v = nick.control.value.trim();
        return v ? '' : '請輸入暱稱';
      }
    },
    {
      el: restField.control,
      fb: restField.feedback,
      validator: () => {
        const v = restField.control.value;
        return v ? '' : '請選擇餐廳';
      }
    },
    {
      el: comment.control,
      fb: comment.feedback,
      validator: () => {
        const v = comment.control.value.trim();
        return v ? '' : '請輸入評論';
      }
    }
  ];

  // 再把每個星等的 hidden input 也加入 fields（以統一驗證邏輯）
  ratingCategories.forEach(cat=>{
    const hidden = ratingHiddenInputs[cat];
    const fb = ratingFeedbacks[cat];
    fields.push({
      el: hidden,
      fb: fb,
      validator: () => {
        const v = hidden.value;
        return (v && v !== '0') ? '' : `請為 ${cat} 評分`;
      }
    });
  });

  // applyError / clearError：對普通欄位（input/select/textarea）套用或清除錯誤
  function applyError(fieldObj, message) {
    const el = fieldObj.el;
    el.setCustomValidity(message);        // setCustomValidity（設定內建 validity message）
    fieldObj.fb.textContent = message;    // 視覺呈現（寫到 <p>）
    try {
      if(el.type !== 'hidden') el.classList.add('is-invalid'); // 加入紅框樣式
    } catch (e) {}
    el.setAttribute('aria-invalid', message ? 'true' : 'false'); // 可及性屬性
  }

  function clearError(fieldObj) {
    const el = fieldObj.el;
    el.setCustomValidity('');             // 清空 custom validity
    fieldObj.fb.textContent = '';         // 清空視覺文字
    try {
      if(el.type !== 'hidden') el.classList.remove('is-invalid');
    } catch (e) {}
    el.setAttribute('aria-invalid', 'false');
  }

  // rating-specific helpers：對星群套用/清除錯誤（因為星群沒有直接的 input UI）
  function applyErrorRating(category, message){
    const hidden = ratingHiddenInputs[category];
    const fb = ratingFeedbacks[category];
    hidden.setCustomValidity(message);    // 對 hidden input 設定 custom validity
    fb.textContent = message;             // 顯示在 feedback p
    hidden.setAttribute('aria-invalid','true');
    // 使 star container 有視覺上的 invalid 樣式 (在程式中注入 CSS)
    const safeId = `rating-${category.replace(/\s+/g,'-')}`.toLowerCase();
    const fbEl = document.getElementById(`${safeId}-feedback`);
    const starContainer = fbEl ? fbEl.previousElementSibling : null;
    if(starContainer) starContainer.classList.add('star-invalid');
  }

  function clearErrorRating(category){
    const hidden = ratingHiddenInputs[category];
    const fb = ratingFeedbacks[category];
    hidden.setCustomValidity('');
    fb.textContent = '';
    hidden.setAttribute('aria-invalid','false');
    const safeId = `rating-${category.replace(/\s+/g,'-')}`.toLowerCase();
    const fbEl = document.getElementById(`${safeId}-feedback`);
    const starContainer = fbEl ? fbEl.previousElementSibling : null;
    if(starContainer) starContainer.classList.remove('star-invalid');
  }

  // 為普通欄位 (visible controls) 綁定 blur 與 input/change 事件
  fields.forEach(f=>{
    // 若 control 尚未有 aria-describedby，就設定它連到 feedback
    if(!f.el.hasAttribute('aria-describedby') && f.fb && f.fb.id){
      f.el.setAttribute('aria-describedby', f.fb.id);
    }

    // visible controls：input / select / textarea
    if(f.el.tagName.toLowerCase() !== 'input' || f.el.type !== 'hidden'){
      // blur: 離開欄位時顯示錯誤（若有）
      f.el.addEventListener('blur', ()=>{
        const msg = f.validator();
        if(msg){
          applyError(f, msg);
        } else {
          clearError(f);
        }
      });

      // input 或 change: 即時更新（使用者輸入成功時就清除錯誤）
      const ev = f.el.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      f.el.addEventListener(ev, ()=>{
        const msg = f.validator();
        if(msg){
          // 若欄位已經是 invalid（曾經 blur 過），持續顯示訊息；否則暫不顯示文字，直到 blur
          if(f.el.classList.contains('is-invalid')){
            applyError(f, msg);
          } else {
            // 設定 customValidity 但不顯示文字，避免還沒 blur 就出現提示
            f.el.setCustomValidity(msg);
            f.fb.textContent = '';
          }
        } else {
          clearError(f);
        }
      });
    } else {
      // hidden inputs（rating）由星群事件與 mouseleave 負責更新，不直接綁 blur/input 事件
    }
  });

  // 若 CSS 尚未提供 star-invalid 樣式，動態注入一段 minimal style（可搬到 style.css）
  (function ensureStarInvalidStyle(){
    const id = 'star-invalid-style';
    if(!document.getElementById(id)){
      const s = document.createElement('style');
      s.id = id;
      s.textContent = `
        .rating-star-container.star-invalid { outline: 2px solid rgba(220,53,69,0.25); border-radius:6px; padding:6px; }
      `;
      document.head.appendChild(s);
    }
  })();

  // ---------- Submit 處理：檢查全部欄位，聚焦第一個錯誤；模擬 1 秒送出 ----------
  form.addEventListener('submit', e=>{
    e.preventDefault();

    // 驗證所有欄位，記錄第一個錯誤位置以便聚焦
    let firstInvalid = null;
    fields.forEach(f=>{
      const msg = f.validator();
      if(msg){
        applyError(f, msg);
        if(!firstInvalid) firstInvalid = f.el;
      } else {
        clearError(f);
      }
    });

    // 若有錯誤，將第一個錯誤聚焦：對 hidden rating 會聚焦其 feedback 或嘗試引導使用者點選
    if(firstInvalid){
      if(firstInvalid.type === 'hidden'){
        // 對 hidden rating，先 focus 到 feedback（讓 screen reader 宣告）
        const fbId = firstInvalid.getAttribute('aria-describedby');
        const fbEl = fbId ? document.getElementById(fbId) : null;
        if(fbEl){
          fbEl.tabIndex = -1;
          fbEl.focus();
        }
        // 嘗試讓星群第一顆可見星捲動到畫面（由於移除鍵盤支援，不再 focus 星星）
        const ratingGroup = document.querySelector(`#${firstInvalid.id}`).previousElementSibling;
        if(ratingGroup && ratingGroup.querySelector('.rating-star')){
          ratingGroup.scrollIntoView({behavior:'smooth', block:'center'});
        }
      } else {
        firstInvalid.focus();
      }
      if(firstInvalid.scrollIntoView) firstInvalid.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }

    // 若所有欄位通過驗證 -> 模擬送出 1 秒
    const spinner = submitBtn.querySelector('.spinner-border');
    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.setAttribute('disabled','true');
    spinner.classList.remove('d-none');
    btnText.textContent = '送出中...';

    setTimeout(()=>{
      spinner.classList.add('d-none');
      submitBtn.removeAttribute('disabled');
      btnText.textContent = '送出';

      // <-- 這裡改為使用 alert 顯示成功訊息 -->
      alert('我們已收到你的回饋，謝謝！');

      // 重設表單、星星顯示與 hidden rating 值
      form.reset();
      document.querySelectorAll('.rating-star').forEach(s => {
        s.classList.remove('active');
        s.setAttribute('aria-checked','false');
      });
      ratingCategories.forEach(cat=> ratingHiddenInputs[cat].value = '0');
      // 清除所有 error
      fields.forEach(f=>clearError(f));

      // 將 focus 回到暱稱欄位（方便繼續操作）
      try {
        const nickEl = document.getElementById('nickname');
        if(nickEl){ nickEl.focus(); }
      } catch (err) {}

    }, 1000);
  });

  const nightBtn = document.createElement('button');
nightBtn.textContent = '深色';
nightBtn.style.position = 'fixed';
nightBtn.style.bottom = '20px';
nightBtn.style.right = '20px';
nightBtn.style.zIndex = '9999';
nightBtn.style.padding = '10px 15px';
nightBtn.style.borderRadius = '50%';
nightBtn.style.border = 'none';
nightBtn.style.backgroundColor = '#007bff';
nightBtn.style.color = '#fff';
nightBtn.style.cursor = 'pointer';
nightBtn.style.fontSize = '1.2rem';
document.body.appendChild(nightBtn);

// 切換深夜模式
nightBtn.addEventListener('click', () => {
  document.body.classList.toggle('night-mode');
  if (document.body.classList.contains('night-mode')) {
    nightBtn.textContent = '淺色';
  }
});

}); // end DOMContentLoaded