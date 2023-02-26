// 取得資產負債分類選單
async function assetLiabilityCategories() {
  let response = await fetch(`/api/asset_and_liability_categories`, {
    method: "GET",
  });
  let getCategories = await response.json();
  if (getCategories) {
    for (let i = 0; i < 2; i++) {
      const payListElement = document.getElementById("taxPay");
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
document.getElementById("inputTaxDate").value = today;

// 新增所得稅
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const addTax = document.getElementById("addTax");
addTax.addEventListener("click", () => {
  const incomeTax = document.getElementById("income-tax");
  const taxPay = document.getElementById("taxPay");
  const inputTaxDate = document.getElementById("inputTaxDate");
  const inputTaxAmount = document.getElementById("inputTaxAmount");
  const inputTaxRemark = document.getElementById("inputTaxRemark");
  fetch(`/api/tax_records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      incomeTax: incomeTax.value,
      taxPay: taxPay.value,
      taxDate: inputTaxDate.value,
      taxAmount: inputTaxAmount.value,
      taxRemark: inputTaxRemark.value,
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