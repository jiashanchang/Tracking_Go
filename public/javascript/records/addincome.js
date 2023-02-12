// 取得分類選單
async function searchCategories() {
  let response = await fetch("/property/api/incomecategories", {
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
document.getElementById("inputIncomeDate").value = today;
document.getElementById("inputIncomeAmount").value = 0;

// 新增收入
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const addIncome = document.getElementById("addIncome");
addIncome.addEventListener("click", () => {
  const selectCategories = document.getElementById("categoriesList");
  const receive = document.getElementById("receive");
  const inputIncomeDate = document.getElementById("inputIncomeDate");
  const inputIncomeAmount = document.getElementById("inputIncomeAmount");
  const inputIncomeRemark = document.getElementById("inputIncomeRemark");
  fetch("/property/api/add/incomerecord", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      incomeCategory: selectCategories.value,
      incomeReceive: receive.value,
      incomeDate: inputIncomeDate.value,
      incomeAmount: inputIncomeAmount.value,
      incomeRemark: inputIncomeRemark.value,
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