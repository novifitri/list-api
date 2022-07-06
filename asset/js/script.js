const sideToggle = document.getElementById("sidebar-toggle");
const closeSidebar = document.getElementById("close-sidebar");
const sidebar = document.querySelector(".sidebar");
const containers = document.querySelectorAll(".container");
const toggle = document.querySelector(".toggle");
const baseUrl = "https://api.publicapis.org/entries";
const search = document.getElementById("searchBtn");

let key = "Animals";
let allApis = [];

sideToggle.onclick = () => {
  sidebar.classList.toggle("slide");
  containers.forEach((content) => {
    content.classList.toggle("slide");
  });
};
toggle.onclick = () => {
  sidebar.classList.toggle("slide");
  containers.forEach((content) => {
    content.classList.toggle("slide");
  });
};
closeSidebar.onclick = () => {
  sidebar.classList.remove("slide");
  containers.forEach((content) => {
    content.classList.remove("slide");
  });
};
search.addEventListener("click", function (e) {
  e.preventDefault();
  const key = document.getElementById("keyword").value;
  if (key == "") {
    document.querySelector(".error").classList.add("show");
    console.log("oye");
    setTimeout(() => {
      document.querySelector(".error").classList.remove("show");
    }, 2000);
    return;
  }
  const result = allApis.filter((e) => e.API.toLowerCase().includes(key.toLowerCase()));
  renderCard(result);
  hitungAuth(result);
  document.getElementById("category").textContent = "";
  document.querySelector(".error").classList.remove("show");
});
async function getAllApis() {
  await fetch(baseUrl)
    .then((res) => res.json())
    .then((data) => {
      allApis = data.entries;
    })
    .catch((err) => console.log(err));
  return allApis;
}
async function getAllCategory(callback) {
  document.getElementById("free").textContent = "";
  document.getElementById("apikey").textContent = "";
  document.getElementById("oauth").textContent = "";
  document.getElementById("category").textContent = "";
  document.getElementById("total").textContent = "";

  const allData = await getAllApis();

  let hasil = [];
  allData.forEach((entry) => {
    if (!hasil.includes(entry.Category)) {
      hasil.push(entry.Category);
    }
  });
  const wadah = document.querySelectorAll(".sidebar ul li");
  for (const index in wadah) {
    wadah[index].innerHTML += `<span class="category-name">${hasil[index]}</span>`;
  }
  callback();
  addlistenertoList();
}
function exampleData() {
  const results = allApis.filter((entry) => {
    return entry.Category == key;
  });
  renderCard(results);
  hitungAuth(results);
  closeSide(); //menutup sidebar untuk smaller device
}

function renderCard(results) {
  const wadah = document.querySelector(".cards-api");
  const loading = document.querySelector(".loading");
  wadah.innerHTML = "";
  if (results.length == 0) {
    //jika gagal fetch data
    loading.firstElementChild.textContent = "Server error, coba beberapa saat lagi";
    console.log(loading.firstElementChild.textContent);
    return;
  }
  results.forEach((data) => {
    wadah.innerHTML += createCard(data);
  });
  loading.classList.add("hide");
  document.getElementById("total").textContent = results.length + " data";
}
function closeSide() {
  if (window.innerWidth < 768) {
    sidebar.classList.remove("slide");
    containers.forEach((content) => {
      content.classList.remove("slide");
    });
  }
}

function hitungAuth(data) {
  let noauth = 0;
  let apiKey = 0;
  let oauth = 0;
  data.forEach((item) => {
    switch (item.Auth) {
      case "apiKey":
        apiKey++;
        break;
      case "":
        noauth++;
        break;
      case "OAuth":
        oauth++;
        break;
    }
  });
  document.getElementById("free").textContent = noauth;
  document.getElementById("apikey").textContent = apiKey;
  document.getElementById("oauth").textContent = oauth;
}

document.addEventListener("DOMContentLoaded", function () {
  getAllCategory(exampleData);
});
function addlistenertoList() {
  const categories = document.querySelectorAll(".sidebar ul li");
  categories.forEach((category) => {
    category.onclick = () => {
      categories.forEach((item) => item.classList.remove("active"));
      const name = category.querySelector("span");
      key = name.textContent;
      exampleData();
      category.classList.add("active");
      document.getElementById("category").textContent = key;
    };
  });
}

function createCard(data) {
  return `<div class="card-api">
    <span>${data.Auth !== "" ? data.Auth : "no auth"}</span>
    <div class="api-info">
        <h4>${data.API}</h4>
        <p>${data.Description}</p>
    </div>     
    <div class="api-link">
        <a href="${data.Link}" target="_blank">visit</a>
    </div>             
</div>`;
}

function renderCategory(data) {
  return `<li>
            ${data.icon}
                <span>${data.name}</span>
            </li>`;
}
