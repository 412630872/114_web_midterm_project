// 當 DOM 完全載入後執行整個程式
document.addEventListener('DOMContentLoaded',()=>{

  // --- 1. 生成導航列 (從隱藏的 #navbar-data 讀取) ---
  const navbarItems = document.querySelectorAll('#navbar-data li');
  const navbarUl = document.getElementById("navbar-items");
  navbarItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a class="nav-link" href="${item.dataset.href}">${item.dataset.name}</a>`;
    navbarUl.appendChild(li);
  });

  // --- 2. 生成餐廳區塊 (從隱藏的 #restaurant-data 讀取) ---
  const restaurantDivs = document.querySelectorAll('#restaurant-data div');
  const restaurants = {};
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
  form.noValidate = true;

  function createFieldHtml({id, labelText, controlHtml}) {
    const wrap = document.createElement('div');
    wrap.className = 'mb-3';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.setAttribute('for', id);
    label.textContent = labelText;
    wrap.appendChild(label);

    const temp = document.createElement('div');
    temp.innerHTML = controlHtml.trim();
    const control = temp.firstElementChild;
    control.id = id;
    control.classList.add('form-control');
    wrap.appendChild(control);

    const feedback = document.createElement('p');
    feedback.className = 'form-text text-danger';
    feedback.id = `${id}-feedback`;
    feedback.textContent = '';
    control.setAttribute('aria-describedby', feedback.id);

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

  const nick = createFieldHtml({
    id: 'nickname',
    labelText: '暱稱',
    controlHtml: `<input type="text" />`
  });
  form.appendChild(nick.wrap);

  const restOptions = ['<option value="">-- 請選擇 --</option>'].concat(allRestaurants.map(n=>`<option value="${n}">${n}</option>`)).join('');
  const restField = createFieldHtml({
    id: 'restaurant',
    labelText: '餐廳名稱',
    controlHtml: `<select>${restOptions}</select>`
  });
  form.appendChild(restField.wrap);

  // 星星評分
  const ratingCategories = ["服務", "衛生", "餐點滿意度"];
  const ratingsState = {};
  const ratingHiddenInputs = {};
  const ratingFeedbacks = {};

  ratingCategories.forEach(cat=>{
    ratingsState[cat] = 0;
    const wrap = document.createElement('div');
    wrap.className = 'mb-3';

    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = cat;
    wrap.appendChild(label);

    const starContainer = document.createElement('div');
    starContainer.className = 'rating-star-container';
    starContainer.setAttribute('aria-label', cat + ' 評分');

    const fb = document.createElement('p');
    fb.className = 'form-text text-danger';
    const safeId = `rating-${cat.replace(/\s+/g,'-')}`.toLowerCase();
    fb.id = `${safeId}-feedback`;
    fb.textContent = '';
    ratingFeedbacks[cat] = fb;

    const hidden = document.createElement('input');
    hidden.type = 'hidden';
    hidden.id = `${safeId}-value`;
    hidden.name = `${safeId}`;
    hidden.value = '0';
    hidden.setAttribute('aria-describedby', fb.id);
    hidden.setAttribute('aria-invalid', 'false');
    ratingHiddenInputs[cat] = hidden;

    for(let i=1;i<=5;i++){
      const star = document.createElement('span');
      star.className = 'rating-star';
      star.dataset.value = i;
      star.setAttribute('aria-label', `${i} 星`);
      star.innerHTML = '★';

      star.addEventListener('click', ()=>{
        setRating(cat, i);
        hidden.value = String(i);
        clearErrorRating(cat);
        // 儲存到 localStorage
        localStorage.setItem(`rating-${cat}`, i);
      });

      starContainer.appendChild(star);
    }

    function setRating(category, value){
      ratingsState[category] = value;
      const children = starContainer.children;
      for(let idx=0; idx<children.length; idx++){
        const s = children[idx];
        const val = Number(s.dataset.value);
        const isActive = val <= value;
        s.classList.toggle('active', isActive);
        s.setAttribute('aria-checked', isActive ? 'true' : 'false');
      }
    }

    starContainer.addEventListener('mouseleave', ()=>{
      setTimeout(()=>{
        const current = ratingHiddenInputs[cat].value;
        if(!current || current === '0'){
          applyErrorRating(cat, `請為 ${cat} 評分`);
        } else {
          clearErrorRating(cat);
        }
      }, 0);
    });

    wrap.appendChild(starContainer);
    wrap.appendChild(hidden);
    wrap.appendChild(fb);
    form.appendChild(wrap);
  });

  const comment = createFieldHtml({
    id: 'comment',
    labelText: '評論',
    controlHtml: `<textarea rows="4"></textarea>`
  });
  form.appendChild(comment.wrap);

  const submitDiv = document.createElement('div');
  submitDiv.className = 'mb-3';
  const submitBtn = document.createElement('button');
  submitBtn.type = 'submit';
  submitBtn.className = 'btn btn-primary w-100';
  submitBtn.innerHTML = `<span class="btn-text">送出</span> <span class="spinner-border spinner-border-sm d-none" role="status" aria-hidden="true"></span>`;
  submitDiv.appendChild(submitBtn);
  form.appendChild(submitDiv);
  contactContainer.appendChild(form);

  // 驗證邏輯
  const fields = [
    {el: nick.control, fb: nick.feedback, validator: ()=>nick.control.value.trim() ? '' : '請輸入暱稱'},
    {el: restField.control, fb: restField.feedback, validator: ()=>restField.control.value ? '' : '請選擇餐廳'},
    {el: comment.control, fb: comment.feedback, validator: ()=>comment.control.value.trim() ? '' : '請輸入評論'}
  ];

  ratingCategories.forEach(cat=>{
    const hidden = ratingHiddenInputs[cat];
    const fb = ratingFeedbacks[cat];
    fields.push({
      el: hidden,
      fb: fb,
      validator: ()=> (hidden.value && hidden.value !== '0') ? '' : `請為 ${cat} 評分`
    });
  });

  function applyError(fieldObj, message) {
    const el = fieldObj.el;
    el.setCustomValidity(message);
    fieldObj.fb.textContent = message;
    try { if(el.type !== 'hidden') el.classList.add('is-invalid'); } catch(e){}
    el.setAttribute('aria-invalid', message ? 'true' : 'false');
  }

  function clearError(fieldObj) {
    const el = fieldObj.el;
    el.setCustomValidity('');
    fieldObj.fb.textContent = '';
    try { if(el.type !== 'hidden') el.classList.remove('is-invalid'); } catch(e){}
    el.setAttribute('aria-invalid','false');
  }

  function applyErrorRating(category, message){
    const hidden = ratingHiddenInputs[category];
    const fb = ratingFeedbacks[category];
    hidden.setCustomValidity(message);
    fb.textContent = message;
    hidden.setAttribute('aria-invalid','true');
    const fbEl = fb;
    const starContainer = fbEl ? fbEl.previousElementSibling : null;
    if(starContainer) starContainer.classList.add('star-invalid');
  }

  function clearErrorRating(category){
    const hidden = ratingHiddenInputs[category];
    const fb = ratingFeedbacks[category];
    hidden.setCustomValidity('');
    fb.textContent = '';
    hidden.setAttribute('aria-invalid','false');
    const fbEl = fb;
    const starContainer = fbEl ? fbEl.previousElementSibling : null;
    if(starContainer) starContainer.classList.remove('star-invalid');
  }

  fields.forEach(f=>{
    if(!f.el.hasAttribute('aria-describedby') && f.fb && f.fb.id){
      f.el.setAttribute('aria-describedby', f.fb.id);
    }
    if(f.el.tagName.toLowerCase() !== 'input' || f.el.type !== 'hidden'){
      f.el.addEventListener('blur', ()=>{
        const msg = f.validator();
        if(msg) applyError(f, msg); else clearError(f);
      });
      const ev = f.el.tagName.toLowerCase() === 'select' ? 'change' : 'input';
      f.el.addEventListener(ev, ()=>{
        const msg = f.validator();
        if(msg){
          if(f.el.classList.contains('is-invalid')) applyError(f,msg);
          else f.el.setCustomValidity(msg);
        } else clearError(f);
      });
    }
  });

  (function ensureStarInvalidStyle(){
    const id = 'star-invalid-style';
    if(!document.getElementById(id)){
      const s = document.createElement('style');
      s.id = id;
      s.textContent = `.rating-star-container.star-invalid { outline: 2px solid rgba(220,53,69,0.25); border-radius:6px; padding:6px; }`;
      document.head.appendChild(s);
    }
  })();

  form.addEventListener('submit', e=>{
    e.preventDefault();
    let firstInvalid = null;
    fields.forEach(f=>{
      const msg = f.validator();
      if(msg){
        applyError(f,msg);
        if(!firstInvalid) firstInvalid=f.el;
      } else clearError(f);
    });
    if(firstInvalid){
      if(firstInvalid.type==='hidden'){
        const fbId = firstInvalid.getAttribute('aria-describedby');
        const fbEl = fbId ? document.getElementById(fbId) : null;
        if(fbEl){ fbEl.tabIndex=-1; fbEl.focus(); }
        const ratingGroup = firstInvalid.previousElementSibling;
        if(ratingGroup && ratingGroup.querySelector('.rating-star')) ratingGroup.scrollIntoView({behavior:'smooth', block:'center'});
      } else firstInvalid.focus();
      if(firstInvalid.scrollIntoView) firstInvalid.scrollIntoView({behavior:'smooth', block:'center'});
      return;
    }

    const spinner = submitBtn.querySelector('.spinner-border');
    const btnText = submitBtn.querySelector('.btn-text');
    submitBtn.setAttribute('disabled','true');
    spinner.classList.remove('d-none');
    btnText.textContent = '送出中...';

    setTimeout(()=>{
      spinner.classList.add('d-none');
      submitBtn.removeAttribute('disabled');
      btnText.textContent = '送出';
      alert('我們已收到你的回饋，謝謝！');

      form.reset();
      document.querySelectorAll('.rating-star').forEach(s=>{
        s.classList.remove('active');
        s.setAttribute('aria-checked','false');
      });
      ratingCategories.forEach(cat=> ratingHiddenInputs[cat].value='0');
      fields.forEach(f=>clearError(f));

      // 清除 localStorage
      localStorage.removeItem('nickname');
      localStorage.removeItem('restaurant');
      localStorage.removeItem('comment');
      ratingCategories.forEach(cat=>localStorage.removeItem(`rating-${cat}`));

      nick.control.focus();
    },1000);
  });

  // ------------------- dark/light 模式 -------------------
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

  nightBtn.addEventListener('click', () => {
    document.body.classList.toggle('night-mode');
    if(document.body.classList.contains('night-mode')) nightBtn.textContent='淺色';
    else nightBtn.textContent='深色';
    localStorage.setItem('theme', document.body.classList.contains('night-mode')?'dark':'light');
  });

  // 載入 localStorage 資料
  if(localStorage.getItem('nickname')) nick.control.value = localStorage.getItem('nickname');
  if(localStorage.getItem('restaurant')) restField.control.value = localStorage.getItem('restaurant');
  if(localStorage.getItem('comment')) comment.control.value = localStorage.getItem('comment');

  ratingCategories.forEach(cat=>{
    const saved = localStorage.getItem(`rating-${cat}`);
    if(saved){
      const val = parseInt(saved);
      ratingHiddenInputs[cat].value = val;
      const starContainer = ratingHiddenInputs[cat].previousElementSibling;
      Array.from(starContainer.children).forEach((s,idx)=>{
        s.classList.toggle('active', idx<val);
        s.setAttribute('aria-checked', idx<val ? 'true' : 'false');
      });
    }
  });

  const theme = localStorage.getItem('theme');
  if(theme==='dark'){
    document.body.classList.add('night-mode');
    nightBtn.textContent='淺色';
  }

  // 即時儲存表單內容
  [nick.control, restField.control, comment.control].forEach(input=>{
    input.addEventListener('input',()=>localStorage.setItem(input.id, input.value));
  });

});
