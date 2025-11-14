document.addEventListener('DOMContentLoaded',()=>{

  // --- 1. 生成導航列 ---
  const navbarItems = document.querySelectorAll('#navbar-data li');
  const navbarUl = document.getElementById("navbar-items");
  navbarItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `<a class="nav-link" href="${item.dataset.href}">${item.dataset.name}</a>`;
    navbarUl.appendChild(li);
  });

  // --- 2. 生成餐廳區塊 ---
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
    section.className = "py-5";

    const container = document.createElement("div");
    container.className = "container";

    const title = document.createElement("h2");
    title.className = "text-center mb-5";
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

  // --- 3. 生成表單 ---
  const allRestaurants = Array.from(restaurantDivs).map(d=>d.dataset.name);
  const contactContainer = document.getElementById("contact-container");
  const form = document.createElement("form");
  form.id = "contactForm";
  form.noValidate = true; // 我們使用自訂驗證，不要瀏覽器預設泡泡

  // 暱稱
  const nicknameDiv = document.createElement("div");
  nicknameDiv.className = "mb-3";
  nicknameDiv.innerHTML = `
    <label for="nickname" class="form-label">暱稱</label>
    <input type="text" class="form-control" id="nickname" />
    <div class="invalid-feedback text-danger">請輸入暱稱</div>
  `;
  form.appendChild(nicknameDiv);

  // 餐廳下拉
  const restaurantDiv = document.createElement("div");
  restaurantDiv.className = "mb-3";
  // 加一個空值選項，方便做「未選擇」的驗證（若你希望預設選第一個可移除）
  restaurantDiv.innerHTML = `
    <label for="restaurant" class="form-label">餐廳名稱</label>
    <select class="form-select" id="restaurant">
      <option value="">-- 請選擇 --</option>
      ${allRestaurants.map(n=>`<option value="${n}">${n}</option>`).join('')}
    </select>
    <div class="invalid-feedback text-danger">請選擇餐廳</div>
  `;
  form.appendChild(restaurantDiv);

  // 星星評分
  const ratingCategories = ["服務", "衛生", "餐點滿意度"];
  // 我們也會收集每個分類的選取值，方便未來擴充
  const ratingsState = {};
  ratingCategories.forEach(cat=>{
    ratingsState[cat] = 0;

    const div = document.createElement("div");
    div.className = "mb-3";
    const label = document.createElement("label");
    label.className = "form-label";
    label.textContent = cat;
    div.appendChild(label);

    const starContainer = document.createElement("div");
    starContainer.className = "rating-star-container";
    let selectedValue = 0;

    for(let i=1;i<=5;i++){
      const star = document.createElement("span");
      star.className = "rating-star";
      star.dataset.value = i;
      star.innerHTML = "★";

      star.addEventListener("click",()=>{ selectedValue=i; ratingsState[cat] = i; updateStars(); });
      star.addEventListener("mouseover",()=>{ updateStars(i); });
      star.addEventListener("mouseout",()=>{ updateStars(); });

      starContainer.appendChild(star);
    }

    function updateStars(hoverValue=0){
      Array.from(starContainer.children).forEach(s=>{
        const val = Number(s.dataset.value);
        s.classList.toggle("active", hoverValue? val<=hoverValue : val<=selectedValue);
      });
    }

    div.appendChild(starContainer);
    form.appendChild(div);
  });

  // 評論
  const commentDiv = document.createElement("div");
  commentDiv.className = "mb-3";
  commentDiv.innerHTML = `
    <label for="comment" class="form-label">評論</label>
    <textarea class="form-control" id="comment" rows="4"></textarea>
    <div class="invalid-feedback text-danger">請輸入評論</div>
  `;
  form.appendChild(commentDiv);

  // 送出
  const submitBtn = document.createElement("button");
  submitBtn.type="submit";
  submitBtn.className="btn btn-primary w-100";
  submitBtn.textContent="送出";
  form.appendChild(submitBtn);
  
  contactContainer.appendChild(form);

  // ===== 新：自訂驗證與 alert 顯示 =====
  function showError(message){
    // 你可以把 alert 換成更漂亮的自訂浮動提示（目前依照需求用原生 alert）
    alert(message);
  }

  form.addEventListener("submit", e=>{
    e.preventDefault();

    const nicknameInput = document.getElementById('nickname');
    const restaurantSelect = document.getElementById('restaurant');
    const commentTextarea = document.getElementById('comment');

    const nickname = nicknameInput.value.trim();
    const restaurant = restaurantSelect.value;
    const comment = commentTextarea.value.trim();

    // 清除先前的錯誤樣式（如果有）
    nicknameInput.classList.remove('is-invalid');
    restaurantSelect.classList.remove('is-invalid');
    commentTextarea.classList.remove('is-invalid');

    // 驗證：暱稱
    if(!nickname){
      nicknameInput.classList.add('is-invalid');
      showError('請輸入暱稱'); // 自訂錯誤提示
      nicknameInput.focus();
      return;
    }

    // 驗證：餐廳（如果你希望預設選第一個並跳過這驗證，可把此段移除）
    if(!restaurant){
      restaurantSelect.classList.add('is-invalid');
      showError('請選擇餐廳'); // 自訂錯誤提示
      restaurantSelect.focus();
      return;
    }

    // 驗證：評論
    if(!comment){
      commentTextarea.classList.add('is-invalid');
      showError('請輸入評論'); // 自訂錯誤提示
      commentTextarea.focus();
      return;
    }

    // 若驗證都通過，顯示成功 alert（替代原本的 thankModal）
    alert('我們已收到你的回饋，謝謝！');

    // 重設表單（並清空星等狀態）
    form.reset();
    // 清除星星顯示（若有）
    document.querySelectorAll('.rating-star').forEach(s => s.classList.remove('active'));
    // 若你有儲存 ratingsState 需要同步清空：
    for (let k in ratingsState) ratingsState[k] = 0;
  });

});
