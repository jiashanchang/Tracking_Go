// 取得分類選單
async function searchCategories() {
  let response = await fetch("/property/api/costcategories", {
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
document.getElementById("inputCostAmount").value = 0;

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
  fetch("/property/api/add/costrecord", {
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