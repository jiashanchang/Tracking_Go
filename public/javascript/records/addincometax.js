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
const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const addTax = document.getElementById("addTax");

let isSubmitting = false;

async function addIncomeTaxList() {
  if (isSubmitting) {
    addTax.disabled = true;
    return;
  }

  isSubmitting = true;

  const incomeTax = document.getElementById("income-tax");
  const taxPay = document.getElementById("taxPay");
  const inputTaxDate = document.getElementById("inputTaxDate");
  const inputTaxAmount = document.getElementById("inputTaxAmount");
  const inputTaxRemark = document.getElementById("inputTaxRemark");
  let fetchAPI = await fetch(`/api/tax_records`, {
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
  let addSuccess = await fetchAPI.json();
  addTax.disabled = false;
  isSubmitting = false;
  if (addSuccess.ok) {
    hidden.style.display = "block";
    warnForm.style.display = "block";
    warn.style.color = "#8ce600";
    warn.textContent = "🅥 新增一筆所得稅";
    setTimeout(function () {
      warnForm.style.display = "none";
      hidden.style.display = "none";
      window.location.href = "/property/incometax-list";
    }, 1000);
  } else {
    warnForm.style.display = "block";
    warn.style.color = "red";
    warn.textContent = "⚠ " + `${addSuccess.message}`;
    setTimeout(function () {
      warnForm.style.display = "none";
    }, 1000);
  }
};

addTax.addEventListener("click", addIncomeTaxList);