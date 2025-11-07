const navbarItems = [
  { name: "首頁", href: "#home" },
  { name: "臺式", href: "#taiwanese" },
  { name: "義式", href: "#italian" },
  { name: "日式", href: "#japanese" },
  { name: "港式", href: "#hongkong" },
  { name: "美式", href: "#american" },
  { name: "表單", href: "#contact" }
];

const navbarUl = document.getElementById("navbar-items");
navbarItems.forEach(item => {
  const li = document.createElement("li");
  li.className = "nav-item";
  li.innerHTML = `<a class="nav-link" href="${item.href}">${item.name}</a>`;
  navbarUl.appendChild(li);
});

const categories = ["臺式","義式","日式","港式","美式"];
const btnContainer = document.getElementById("category-buttons");
categories.forEach(cat => {
  const btn = document.createElement("a");
  btn.className = "btn btn-secondary btn-lg m-1";
  btn.href = `#${cat.toLowerCase()}`;
  btn.textContent = cat;
  btnContainer.appendChild(btn);
});

const restaurants = {
  臺式: [
    {name:"力霸椒麻雞",phone:"02-2629-8046",img:"assets/6.jpg",link:"https://www.google.com/maps/place/%E5%8A%9B%E9%9C%B8%E6%A4%92%E9%BA%BB%E9%9B%9E/@25.177447,121.4470769,17z/data=!3m1!4b1!4m6!3m5!1s0x3442afede5025229:0xcbaf7bc7f41925bc!8m2!3d25.1774422!4d121.4496518!16s%2Fg%2F11q96j5l9p?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"},
    {name:"欣宏牛肉麵",phone:"02-2622-5205",img:"assets/5.jpg",link:"https://www.google.com/maps/place/%E6%AC%A3%E5%AE%8F%E7%89%9B%E8%82%89%E9%BA%B5/@25.1771346,121.446243,17z/data=!3m1!4b1!4m6!3m5!1s0x3442affee6b2a203:0xea753ea16308343a!8m2!3d25.1771298!4d121.4488179!16s%2Fg%2F11c20cf68p?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"}
  ],
  義式: [
    {name:"吃呼義料",phone:"02-2629-8046",img:"assets/9.jpg",link:"https://www.google.com/maps/place/%E5%90%83%E5%91%BC%E7%BE%A9%E6%96%99/@25.1770108,121.4458659,17z/data=!3m1!4b1!4m6!3m5!1s0x3442affee5be40cb:0x9a8825aa66c239a7!8m2!3d25.177006!4d121.4484408!16s%2Fg%2F1tmqcxvg?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"},
    {name:"Eat窩",phone:"02-2620-3898",img:"assets/10.jpg",link:"https://www.google.com/maps/place/Eat%E7%AA%A9/@25.1770566,121.4459646,17z/data=!3m1!4b1!4m6!3m5!1s0x3442afd1100d68a5:0xf6ca501396b54769!8m2!3d25.1770518!4d121.4485395!16s%2Fg%2F11tjbzfd4v?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"}
  ],
  日式: [
    {name:"領鮮平價日式料理",phone:"02-2620-1922",img:"assets/2.jpg",link:"https://www.google.com/maps/place/%E9%A0%98%E9%AE%AE%E5%B9%B3%E5%83%B9%E6%97%A5%E5%BC%8F%E6%96%99%E7%90%86/@25.1770832,121.4490779,17z/data=!4m6!3m5!1s0x3442afff22e2dd65:0x29cba4e1fe28c647!8m2!3d25.1762942!4d121.4476661!16s%2Fg%2F12m9bv_8j?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"},
    {name:"迴味食光和風食堂",phone:"02-2628-1319",img:"assets/1.jpg",link:"https://www.google.com/maps/place/%E8%BF%B4%E5%91%B3%E9%A3%9F%E5%85%89%E5%92%8C%E9%A2%A8%E9%A3%9F%E5%A0%82/@25.1770832,121.4490779,17z/data=!3m2!4b1!5s0x3442affe83712997:0x734b27db2f9ffc47!4m6!3m5!1s0x3442af41b6681c4f:0x1b6190acbd086c80!8m2!3d25.1770784!4d121.4516528!16s%2Fg%2F11h648c0xb?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"}
  ],
  港式: [
    {name:"珍寶港式燒臘",phone:"02-2620-3238",img:"assets/7.jpg",link:"https://www.google.com/maps/place/%E7%8F%8D%E5%AF%B6%E6%B8%AF%E5%BC%8F%E7%87%92%E8%87%98/@25.1774147,121.446062,17z/data=!4m6!3m5!1s0x3442affefaffd833:0xa1df53aead276407!8m2!3d25.1776847!4d121.4490331!16s%2Fg%2F11cjnnnp1n?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"},
    {name:"滄州燒臘快餐",phone:"02-2623-3433",img:"assets/8.jpg",link:"https://www.google.com/maps/place/%E6%BB%84%E5%B7%9E%E7%87%92%E8%87%98%E5%BF%AB%E9%A4%90/@25.1770239,121.4491624,17z/data=!4m6!3m5!1s0x3442b0020c4f2a9b:0xbad715167ec00127!8m2!3d25.1774099!4d121.4486369!16s%2Fg%2F11b_098fx5?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"}
  ],
  美式: [
    {name:"FiFi Natural．義式香草漢堡",phone:"02-2625-6579",img:"assets/3.jpg",link:"https://www.google.com/maps/place/FiFi+Natural%EF%BC%8E%E7%BE%A9%E5%BC%8F%E9%A6%99%E8%8D%89%E6%BC%A2%E5%A0%A1/@25.1770239,121.4491624,17z/data=!3m2!4b1!5s0x3442affe83712997:0x734b27db2f9ffc47!4m6!3m5!1s0x3442affe875c2719:0xde4abdce2d66a650!8m2!3d25.1770191!4d121.4517373!16s%2Fg%2F1tglwnyq?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"},
    {name:"The Peace Za 淡水手作披薩",phone:"02-2629-9661",img:"assets/4.jpg",link:"https://www.google.com/maps/place/The+Peace+Za+%E6%B7%A1%E6%B0%B4%E6%89%8B%E4%BD%9C%E6%8A%AB%E8%96%A9/@25.1744349,121.4498894,16.5z/data=!4m6!3m5!1s0x3442affef60733b1:0xa4b5c5e546b66a6b!8m2!3d25.1780128!4d121.4495796!16s%2Fg%2F11cjg91f72?authuser=0&entry=ttu&g_ep=EgoyMDI1MTEwMi4wIKXMDSoASAFQAw%3D%3D"}
  ]
};

const sectionsContainer = document.getElementById("restaurant-sections");
for (let category in restaurants) {
  const section = document.createElement("section");
  section.id = category;
  section.className = "py-5" + (category==="taiwanese"||category==="japanese"||category==="american"?" bg-light":"");

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
          <a href="${rest.link}" class="btn btn-primary">連結</a>
        </div>
      </div>
    `;
    row.appendChild(col);
  });

  container.appendChild(row);
  section.appendChild(container);
  sectionsContainer.appendChild(section);
}

// 收集所有餐廳名稱（陣列）
let allRestaurants = [];
for (let category in restaurants) {
  restaurants[category].forEach(r => {
    allRestaurants.push(r.name);
  });
}

// 生成表單
const contactContainer = document.getElementById("contact-container");
const form = document.createElement("form");
form.id = "contactForm";

// 1. 暱稱
const nicknameDiv = document.createElement("div");
nicknameDiv.className = "mb-3";
const nicknameLabel = document.createElement("label");
nicknameLabel.className = "form-label";
nicknameLabel.setAttribute("for", "nickname");
nicknameLabel.textContent = "暱稱";
const nicknameInput = document.createElement("input");
nicknameInput.type = "text";
nicknameInput.className = "form-control";
nicknameInput.id = "nickname";
nicknameInput.required = true;
nicknameDiv.appendChild(nicknameLabel);
nicknameDiv.appendChild(nicknameInput);
form.appendChild(nicknameDiv);

// 2. 餐廳名稱（使用下拉選單）
const restaurantDiv = document.createElement("div");
restaurantDiv.className = "mb-3";
const restaurantLabel = document.createElement("label");
restaurantLabel.className = "form-label";
restaurantLabel.setAttribute("for", "restaurant");
restaurantLabel.textContent = "餐廳名稱";
const restaurantSelect = document.createElement("select");
restaurantSelect.className = "form-select";
restaurantSelect.id = "restaurant";
restaurantSelect.required = true;

// 生成選項
const ratingCategories = ["服務", "衛生", "餐點滿意度"];
ratingCategories.forEach(cat => {
  const div = document.createElement("div");
  div.className = "mb-3";

  const label = document.createElement("label");
  label.className = "form-label";
  label.textContent = cat;
  div.appendChild(label);

  const circleContainer = document.createElement("div");
  circleContainer.className = "rating-circle-container";

  for (let i = 1; i <= 5; i++) {
    const circle = document.createElement("span");
    circle.className = "rating-circle";
    circle.dataset.value = i;
    circle.textContent = i;

    // 點擊選擇分數
    circle.addEventListener("click", () => {
      Array.from(circleContainer.children).forEach(c => c.classList.remove("active"));
      circle.classList.add("active");
    });

    // 滑鼠移入即時預覽
    circle.addEventListener("mouseover", () => {
      Array.from(circleContainer.children).forEach(c => {
        c.classList.toggle("hovered", c.dataset.value <= i);
      });
    });

    // 滑鼠移出取消預覽
    circle.addEventListener("mouseout", () => {
      Array.from(circleContainer.children).forEach(c => c.classList.remove("hovered"));
    });

    circleContainer.appendChild(circle);
  }

  div.appendChild(circleContainer);
  form.appendChild(div);
});


// 4. 評論
const commentDiv = document.createElement("div");
commentDiv.className = "mb-3";
const commentLabel = document.createElement("label");
commentLabel.className = "form-label";
commentLabel.setAttribute("for", "comment");
commentLabel.textContent = "評論";
const commentTextarea = document.createElement("textarea");
commentTextarea.className = "form-control";
commentTextarea.id = "comment";
commentTextarea.rows = 4;
commentTextarea.required = true;
commentDiv.appendChild(commentLabel);
commentDiv.appendChild(commentTextarea);
form.appendChild(commentDiv);

// 送出按鈕
const submitBtn = document.createElement("button");
submitBtn.type = "submit";
submitBtn.className = "btn btn-primary w-100";
submitBtn.textContent = "送出";
form.appendChild(submitBtn);

// 放入 container
contactContainer.appendChild(form);