let url = location.href;
let id = url.split("/")[5];

async function getCostRecordData() {
  let response = await fetch(`/api/cost_records/${id}`, {
    method: "GET",
  })
  let costData = await response.json();
  if (costData.data) {
    document.getElementById("categoriesList").value = `${costData.data.categoryId.category}`;
    document.getElementById("pay").value = `${costData.data.payId.category}`;
    document.getElementById("inputCostDate").value = `${costData.data.createdAt}`;
    document.getElementById("inputCostAmount").value = `${costData.data.amount}`;
    document.getElementById("inputCostRemark").value = `${costData.data.remark}`;
  }
}

getCostRecordData();

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

// 修改支出
const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const editCost = document.getElementById("editCost");

async function editCostList() {
  const selectCategories = document.getElementById("categoriesList");
  const pay = document.getElementById("pay");
  const inputCostDate = document.getElementById("inputCostDate");
  const inputCostAmount = document.getElementById("inputCostAmount");
  const inputCostRemark = document.getElementById("inputCostRemark");
  if (inputCostAmount.value != "") {
    let fetchAPI = await fetch(`/api/cost_records/${id}`, {
      method: "PUT",
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
    let editSuccess = await fetchAPI.json();
    if (editSuccess) {
      hidden.style.display = "block";
      warnForm.style.display = "block";
      warn.style.color = "#8ce600";
      warn.textContent = "🅥 已修改此筆紀錄";
      setTimeout(function () {
        warnForm.style.display = "none";
        hidden.style.display = "none";
        window.location.href = "/property/cost-list";
      }, 1500);
    } else {
      warnForm.style.display = "block";
      warn.style.color = "red";
      warn.textContent = "⚠ " + `${editSuccess.message}`;
      setTimeout(function () {
        warnForm.style.display = "none";
      }, 1500);
    }
  } else {
    warnForm.style.display = "block";
    warn.style.color = "red";
    warn.textContent = "⚠ 請輸入金額";
    setTimeout(function () {
      warnForm.style.display = "none";
    }, 1500);
  }
}

editCost.addEventListener("click", editCostList);