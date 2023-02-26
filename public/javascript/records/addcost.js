// 取得支出分類選單
async function searchCategories() {
  let response = await fetch(`/api/cost_categories`, {
    method: "GET",
  });
  let getCategories = await response.json();
  if (getCategories) {
    for (let i = 0; i < getCategories.data.length; i++) {
      const categoriesListElement = document.getElementById("categoriesList");
      const categories = document.createElement("option");
      categories.setAttribute("class", "categories");
      const categoriesTitle = document.createTextNode(getCategories.data[i].category);
      categoriesListElement.appendChild(categories);
      categories.appendChild(categoriesTitle);
    }
  }
}

searchCategories();

// 取得資產負債分類選單
async function assetLiabilityCategories() {
  let response = await fetch(`/api/asset_and_liability_categories`, {
    method: "GET",
  });
  let getCategories = await response.json();
  if (getCategories) {
    for (let i = 0; i < getCategories.data.length; i++) {
      const payListElement = document.getElementById("pay");
      const categories = document.createElement("option");
      categories.setAttribute("class", "categories");
      const categoriesTitle = document.createTextNode(getCategories.data[i].category);
      payListElement.appendChild(categories);
      categories.appendChild(categoriesTitle);
    }
  }
}

assetLiabilityCategories();

// 日期默認今天
let date = new Date();
let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();
if (month < 10) {
  month = "0" + month;
}
if (day < 10) {
  day = "0" + day;
}
let today = year + "-" + month + "-" + day;
document.getElementById("inputCostDate").value = today;

// 新增支出
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const addCost = document.getElementById("addCost");
addCost.addEventListener("click", () => {
  const selectCategories = document.getElementById("categoriesList");
  const pay = document.getElementById("pay");
  const inputCostDate = document.getElementById("inputCostDate");
  const inputCostAmount = document.getElementById("inputCostAmount");
  const inputCostRemark = document.getElementById("inputCostRemark");
  fetch(`/api/cost_records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      costCategory: selectCategories.value,
      costPay: pay.value,
      costDate: inputCostDate.value,
      costAmount: inputCostAmount.value,
      costRemark: inputCostRemark.value,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (addSuccess) {
      if (addSuccess.ok) {
        window.location.href = "/property";
      } else {
        warnForm.style.display = "block";
        warn.textContent = `${addSuccess.message}`;
        setTimeout(function () {
          warnForm.style.display = "none";
        }, 1500);
      }
    });
});