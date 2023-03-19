let url = location.href;
let id = url.split("/")[5];

async function getWriteOffRecordData() {
  let response = await fetch(`/api/tax_records/${id}`, {
    method: "GET",
  });
  let taxData = await response.json();
  if (taxData.data) {
    document.getElementById("income-tax").value = `${taxData.data.incomeTax}`;
    document.getElementById("taxPay").value = `${taxData.data.taxPayId.category}`;
    document.getElementById("inputTaxDate").value = `${taxData.data.createdAt}`;
    document.getElementById("inputTaxAmount").value = `${taxData.data.amount}`;
    document.getElementById("inputTaxRemark").value = `${taxData.data.remark}`;
  }
}

getWriteOffRecordData();

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

// 修改所得稅
const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const editTax = document.getElementById("editTax");

async function editIncomeTaxList() {
  const incomeTax = document.getElementById("income-tax");
  const taxPay = document.getElementById("taxPay");
  const inputTaxDate = document.getElementById("inputTaxDate");
  const inputTaxAmount = document.getElementById("inputTaxAmount");
  const inputTaxRemark = document.getElementById("inputTaxRemark");
  if (inputTaxAmount.value != "") {
    let fetchAPI = await fetch(`/api/tax_records/${id}`, {
      method: "PUT",
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
    let editSuccess = await fetchAPI.json();
    if (editSuccess) {
      hidden.style.display = "block";
      warnForm.style.display = "block";
      warn.style.color = "#8ce600";
      warn.textContent = "🅥 已更新此筆紀錄";
      setTimeout(function () {
        warnForm.style.display = "none";
        hidden.style.display = "none";
        window.location.href = "/property/incometax-list";
      }, 1000);
    } else {
      warnForm.style.display = "block";
      warn.style.color = "red";
      warn.textContent = "⚠ " + `${editSuccess.message}`;
      setTimeout(function () {
        warnForm.style.display = "none";
      }, 1000);
    }
  } else {
    warnForm.style.display = "block";
    warn.style.color = "red";
    warn.textContent = "⚠ 請輸入金額";
    setTimeout(function () {
      warnForm.style.display = "none";
    }, 1000);
  }
};

editTax.addEventListener("click", editIncomeTaxList);