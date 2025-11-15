/* DOMContentLoaded - 主程式入口 */
document.addEventListener("DOMContentLoaded", () => {

  /* 建立 導覽列 */
  const navbarItems = document.querySelectorAll("#navbar-data li");
  const navbarUl = document.getElementById("navbar-items");

  navbarItems.forEach(item => {
    const li = document.createElement("li");
    li.className = "nav-item";
    li.innerHTML = `
      <a class="nav-link" href="${item.dataset.href}">
        ${item.dataset.name}
      </a>
    `;
    navbarUl.appendChild(li);
  });

  /* 生成餐廳類別區塊 */
  const restaurantDivs = document.querySelectorAll("#restaurant-data div");
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

  /* 動態建立表單 + 驗證 */
  const allRestaurants = Array.from(restaurantDivs).map(d => d.dataset.name);

  const contactContainer = document.getElementById("contact-container");
  const form = document.createElement("form");
  form.id = "contactForm";
  form.noValidate = true;

  /* 建立欄位 */
  function createFieldHtml({ id, labelText, controlHtml }) {
    const wrap = document.createElement("div");
    wrap.className = "mb-3";

    const label = document.createElement("label");
    label.className = "form-label";
    label.setAttribute("for", id);
    label.textContent = labelText;
    wrap.appendChild(label);

    const temp = document.createElement("div");
    temp.innerHTML = controlHtml.trim();

    const control = temp.firstElementChild;
    control.id = id;
    control.classList.add("form-control");
    wrap.appendChild(control);

    const feedback = document.createElement("p");
    feedback.className = "form-text text-danger";
    feedback.id = `${id}-feedback`;
    feedback.textContent = "";
    control.setAttribute("aria-describedby", feedback.id);

    if (control.tagName.toLowerCase() === "select") {
      control.classList.remove("form-control");
      control.classList.add("form-select");
    }

    wrap.appendChild(feedback);
    return { wrap, control, feedback };
  }

  /* 欄位：暱稱 */
  const nick = createFieldHtml({
    id: "nickname",
    labelText: "暱稱",
    controlHtml: `<input type="text" />`
  });
  form.appendChild(nick.wrap);

  /* 欄位：餐廳名稱 */
  const restOptions =
    [`<option value="">-- 請選擇 --</option>`]
      .concat(allRestaurants.map(n => `<option value="${n}">${n}</option>`))
      .join("");

  const restField = createFieldHtml({
    id: "restaurant",
    labelText: "餐廳名稱",
    controlHtml: `<select>${restOptions}</select>`
  });
  form.appendChild(restField.wrap);

  /* 欄位：星星評分 */
  const ratingCategories = ["服務", "衛生", "餐點滿意度"];
  const ratingsState = {};
  const ratingHiddenInputs = {};
  const ratingFeedbacks = {};

  ratingCategories.forEach(cat => {
    ratingsState[cat] = 0;

    const wrap = document.createElement("div");
    wrap.className = "mb-3";

    const label = document.createElement("label");
    label.className = "form-label";
    label.textContent = cat;
    wrap.appendChild(label);

    const starContainer = document.createElement("div");
    starContainer.className = "rating-star-container";

    const fb = document.createElement("p");
    fb.className = "form-text text-danger";
    const safeId = `rating-${cat.replace(/\s+/g, "-")}`.toLowerCase();
    fb.id = `${safeId}-feedback`;
    ratingFeedbacks[cat] = fb;

    const hidden = document.createElement("input");
    hidden.type = "hidden";
    hidden.id = `${safeId}-value`;
    hidden.name = safeId;
    hidden.value = "0";
    hidden.setAttribute("aria-describedby", fb.id);
    ratingHiddenInputs[cat] = hidden;

    /* 建立星星 */
    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      star.className = "rating-star";
      star.dataset.value = i;
      star.innerHTML = "★";

      star.addEventListener("click", () => {
        setRating(cat, i);
        hidden.value = String(i);
        clearErrorRating(cat);
        // 儲存該項評分到 localStorage
        try { localStorage.setItem(`rating-${cat}`, String(i)); } catch (err) {}
      });

      starContainer.appendChild(star);
    }

    function setRating(category, value) {
      ratingsState[category] = value;
      const children = starContainer.children;
      for (let idx = 0; idx < children.length; idx++) {
        const s = children[idx];
        const val = Number(s.dataset.value);
        s.classList.toggle("active", val <= value);
        s.setAttribute('aria-checked', val <= value ? 'true' : 'false');
      }
    }

    starContainer.addEventListener("mouseleave", () => {
      setTimeout(() => {
        if (hidden.value === "0") {
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

  /* 欄位：評論 */
  const comment = createFieldHtml({
    id: "comment",
    labelText: "評論",
    controlHtml: `<textarea rows="4"></textarea>`
  });
  form.appendChild(comment.wrap);

  /* 送出按鈕 */
  const submitDiv = document.createElement("div");
  submitDiv.className = "mb-3";

  const submitBtn = document.createElement("button");
  submitBtn.type = "submit";
  submitBtn.className = "btn btn-primary w-100";
  submitBtn.innerHTML = `
    <span class="btn-text">送出</span>
    <span class="spinner-border spinner-border-sm d-none" aria-hidden="true"></span>
  `;

  submitDiv.appendChild(submitBtn);
  form.appendChild(submitDiv);

  contactContainer.appendChild(form);

  /* 驗證流程 */
  const fields = [
    {
      el: nick.control,
      fb: nick.feedback,
      validator: () => nick.control.value.trim() ? "" : "請輸入暱稱"
    },
    {
      el: restField.control,
      fb: restField.feedback,
      validator: () => restField.control.value ? "" : "請選擇餐廳"
    },
    {
      el: comment.control,
      fb: comment.feedback,
      validator: () => comment.control.value.trim() ? "" : "請輸入評論"
    }
  ];

  ratingCategories.forEach(cat => {
    const hidden = ratingHiddenInputs[cat];
    const fb = ratingFeedbacks[cat];

    fields.push({
      el: hidden,
      fb,
      validator: () => hidden.value !== "0" ? "" : `請為 ${cat} 評分`
    });
  });

  function applyError(f, msg) {
    try { f.el.setCustomValidity(msg); } catch (e) {}
    if (f.fb) f.fb.textContent = msg;
    try { if (f.el.type !== "hidden") f.el.classList.add("is-invalid"); } catch (e) {}
  }

  function clearError(f) {
    try { f.el.setCustomValidity(""); } catch (e) {}
    if (f.fb) f.fb.textContent = "";
    try { if (f.el.type !== "hidden") f.el.classList.remove("is-invalid"); } catch (e) {}
  }

  function applyErrorRating(category, message) {
    const hidden = ratingHiddenInputs[category];
    const fb = ratingFeedbacks[category];
    try { hidden.setCustomValidity(message); } catch (e) {}
    fb.textContent = message;
    const starContainer = fb.previousElementSibling;
    if (starContainer) starContainer.classList.add("star-invalid");
  }

  function clearErrorRating(category) {
    const hidden = ratingHiddenInputs[category];
    const fb = ratingFeedbacks[category];
    try { hidden.setCustomValidity(""); } catch (e) {}
    fb.textContent = "";
    const starContainer = fb.previousElementSibling;
    if (starContainer) starContainer.classList.remove("star-invalid");
  }

  fields.forEach(f => {
    if (f.el.type !== "hidden") {
      f.el.addEventListener("blur", () => {
        const msg = f.validator();
        msg ? applyError(f, msg) : clearError(f);
      });

      const ev = f.el.tagName.toLowerCase() === "select" ? "change" : "input";
      f.el.addEventListener(ev, () => {
        const msg = f.validator();
        if (!msg) clearError(f);

        try { localStorage.setItem(f.el.id, f.el.value); } catch (err) {}
      });
    }
  });

  /* 送出表單動作 */
  form.addEventListener("submit", e => {
    e.preventDefault();

    let firstInvalid = null;
    fields.forEach(f => {
      const msg = f.validator();
      if (msg) {
        applyError(f, msg);
        if (!firstInvalid) firstInvalid = f.el;
      }
    });

    if (firstInvalid) {
      if (firstInvalid.type !== "hidden") firstInvalid.focus();
      return;
    }

    const spinner = submitBtn.querySelector(".spinner-border");
    const btnText = submitBtn.querySelector(".btn-text");

    submitBtn.disabled = true;
    spinner.classList.remove("d-none");
    btnText.textContent = "送出中...";

    setTimeout(() => {
      spinner.classList.add("d-none");
      btnText.textContent = "送出";
      submitBtn.disabled = false;

      alert("我們已收到你的回饋，謝謝！");

      form.reset();
      document.querySelectorAll(".rating-star").forEach(s => {
        s.classList.remove("active");
        s.setAttribute('aria-checked','false');
      });
      ratingCategories.forEach(cat => {
        ratingHiddenInputs[cat].value = "0";
      });

      fields.forEach(f => clearError(f));

      try {
        localStorage.removeItem('nickname');
        localStorage.removeItem('restaurant');
        localStorage.removeItem('comment');
        ratingCategories.forEach(cat => localStorage.removeItem(`rating-${cat}`));
      } catch (err) {}

      try { document.getElementById('nickname').focus(); } catch (err) {}

    }, 1000);
  });

  /* 深夜模式按鈕 */
  const nightBtn = document.createElement("button");
  nightBtn.type = 'button';
  nightBtn.className = 'theme-toggle-btn';
  nightBtn.textContent = "深色";
  nightBtn.style.position = "fixed";
  nightBtn.style.bottom = "20px";
  nightBtn.style.right = "20px";
  nightBtn.style.zIndex = "9999";
  nightBtn.style.padding = "10px 15px";
  nightBtn.style.borderRadius = "50%";
  nightBtn.style.border = "none";
  nightBtn.style.backgroundColor = "#007bff";
  nightBtn.style.color = "#fff";
  nightBtn.style.cursor = "pointer";
  nightBtn.style.fontSize = "1.2rem";
  document.body.appendChild(nightBtn);

  function applyThemeFromStorage() {
    try {
      const theme = localStorage.getItem('theme'); // 'dark' or 'light'
      if (theme === 'dark') {
        document.body.classList.add('night-mode');
        nightBtn.textContent = '淺色';
      } else {
        document.body.classList.remove('night-mode');
        nightBtn.textContent = '深色';
      }
    } catch (err) {
    }
  }

  nightBtn.addEventListener("click", () => {
    document.body.classList.toggle("night-mode");
    const isDark = document.body.classList.contains("night-mode");
    nightBtn.textContent = isDark ? "淺色" : "深色";
    try { localStorage.setItem('theme', isDark ? 'dark' : 'light'); } catch (err) {}
  });

  /* localStorage */
  try {
    const savedNick = localStorage.getItem('nickname');
    if (savedNick !== null) nick.control.value = savedNick;

    const savedRest = localStorage.getItem('restaurant');
    if (savedRest !== null) restField.control.value = savedRest;

    const savedComment = localStorage.getItem('comment');
    if (savedComment !== null) comment.control.value = savedComment;
  } catch (err) {
  }

  ratingCategories.forEach(cat => {
    try {
      const saved = localStorage.getItem(`rating-${cat}`);
      if (saved && saved !== '0') {
        const val = parseInt(saved, 10);
        const hidden = ratingHiddenInputs[cat];
        hidden.value = String(val);
        const starContainer = hidden.previousElementSibling;
        if (starContainer && starContainer.classList.contains('rating-star-container')) {
          Array.from(starContainer.children).forEach(s => {
            const sv = Number(s.dataset.value);
            s.classList.toggle('active', sv <= val);
            s.setAttribute('aria-checked', sv <= val ? 'true' : 'false');
          });
        }
      }
    } catch (err) {}
  });

  applyThemeFromStorage();

  [nick.control, restField.control, comment.control].forEach(input => {
    input.addEventListener('input', () => {
      try { localStorage.setItem(input.id, input.value); } catch (err) {}
    });

  });
});
