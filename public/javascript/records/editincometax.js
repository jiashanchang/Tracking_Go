let url = location.href;
let id = url.split("/")[5];

async function getWriteOffRecordData() {
  let response = await fetch(`/property/incometax/${id}`, {
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
  let response = await fetch("/property/api/asset-and-liability-categories", {
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
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const editTax = document.getElementById("editTax");
editTax.addEventListener("click", () => {
  const incomeTax = document.getElementById("income-tax");
  const taxPay = document.getElementById("taxPay");
  const inputTaxDate = document.getElementById("inputTaxDate");
  const inputTaxAmount = document.getElementById("inputTaxAmount");
  const inputTaxRemark = document.getElementById("inputTaxRemark");
  if (inputTaxAmount.value != "") {
    fetch(`/property/incometax/${id}`, {
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
      .then(function (response) {
        return response.json();
      })
      .then(function (editSuccess) {
        if (editSuccess) {
          window.location.href = "/property";
        } else {
          warnForm.style.display = "block";
          warn.textContent = `${editSuccess.message}`;
          setTimeout(function () {
            warnForm.style.display = "none";
          }, 1500);
        }
      });
  } else {
    warnForm.style.display = "block";
    warn.textContent = "請輸入金額";
    setTimeout(function () {
      warnForm.style.display = "none";
    }, 1500);
  }
});