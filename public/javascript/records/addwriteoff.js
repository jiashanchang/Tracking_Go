// 取得借方資產負債分類選單
async function debitCategories() {
  let response = await fetch(`/api/asset_and_liability_categories`, {
    method: "GET",
  });
  let getCategories = await response.json();
  if (getCategories) {
    for (let i = 0; i < getCategories.data.length; i++) {
      const debitCategory = document.getElementById("debitCategory");
      const categories = document.createElement("option");
      categories.setAttribute("class", "categories");
      const categoriesTitle = document.createTextNode(getCategories.data[i].category);
      debitCategory.appendChild(categories);
      categories.appendChild(categoriesTitle);
    }
  }
}

debitCategories();

// 取得貸方資產負債分類選單
async function creditCategories() {
  let response = await fetch(`/api/asset_and_liability_categories`, {
    method: "GET",
  });
  let getCategories = await response.json();
  if (getCategories) {
    for (let i = 0; i < getCategories.data.length; i++) {
      const creditCategory = document.getElementById("creditCategory");
      const categories = document.createElement("option");
      categories.setAttribute("class", "categories");
      const categoriesTitle = document.createTextNode(getCategories.data[i].category);
      creditCategory.appendChild(categories);
      categories.appendChild(categoriesTitle);
    }
  }
}

creditCategories();

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
document.getElementById("inputWriteOffDate").value = today;

// 新增沖帳
const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const addWriteOff = document.getElementById("addWriteOff");

let isSubmitting = false;

async function addWriteOffList() {
  if (isSubmitting) {
    addWriteOff.disabled = true;
    return;
  }

  isSubmitting = true;

  const debitCategory = document.getElementById("debitCategory");
  const creditCategory = document.getElementById("creditCategory");
  const inputWriteOffDate = document.getElementById("inputWriteOffDate");
  const inputWriteOffAmount = document.getElementById("inputWriteOffAmount");
  const inputWriteOffRemark = document.getElementById("inputWriteOffRemark");
  let fetchAPI = await fetch(`/api/writeoff_records`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      debitCategory: debitCategory.value,
      creditCategory: creditCategory.value,
      writeOffDate: inputWriteOffDate.value,
      writeOffAmount: inputWriteOffAmount.value,
      writeOffRemark: inputWriteOffRemark.value,
    }),
  })
  let addSuccess = await fetchAPI.json();
  addWriteOff.disabled = false;
  isSubmitting = false;
  if (addSuccess.ok) {
    hidden.style.display = "block";
    warnForm.style.display = "block";
    warn.style.color = "#8ce600";
    warn.textContent = "🅥 新增一筆沖帳";
    setTimeout(function () {
      warnForm.style.display = "none";
      hidden.style.display = "none";
      window.location.href = "/property/writeoff-list";
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

addWriteOff.addEventListener("click", addWriteOffList);