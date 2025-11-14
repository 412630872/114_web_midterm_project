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

  form.innerHTML = `
    <div class="mb-3">
      <label for="nickname" class="form-label">暱稱</label>
      <input type="text" class="form-control" id="nickname" required>
    </div>
    <div class="mb-3">
      <label for="restaurant" class="form-label">餐廳名稱</label>
      <select class="form-select" id="restaurant" required>
        ${allRestaurants.map(name=>`<option value="${name}">${name}</option>`).join('')}
      </select>
    </div>
    <div class="mb-3">
      <label for="comment" class="form-label">評論</label>
      <textarea class="form-control" id="comment" rows="4" required></textarea>
    </div>
    <button type="submit" class="btn btn-primary w-100">送出</button>
  `;
  contactContainer.appendChild(form);

  form.addEventListener("submit", e=>{
    e.preventDefault();
    const modal = new bootstrap.Modal(document.getElementById('thankModal'));
    modal.show();
    form.reset();
  });

});
