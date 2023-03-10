let url = location.href;
let id = url.split("/")[5];

async function getIncomeRecordData() {
  let response = await fetch(`/api/income_records/${id}`, {
    method: "GET",
  })
  let incomeData = await response.json();
  if (incomeData.data) {
    document.getElementById("categoriesList").value = `${incomeData.data.categoryId.category}`;
    document.getElementById("receive").value = `${incomeData.data.receiveId.category}`;
    document.getElementById("inputIncomeDate").value = `${incomeData.data.createdAt}`;
    document.getElementById("inputIncomeAmount").value = `${incomeData.data.amount}`;
    document.getElementById("inputIncomeRemark").value = `${incomeData.data.remark}`;
  }
}

getIncomeRecordData();

// 取得收入分類選單
async function searchCategories() {
  let response = await fetch(`/api/income_categories`, {
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
      const receiveListElement = document.getElementById("receive");
      const categories = document.createElement("option");
      categories.setAttribute("class", "categories");
      const categoriesTitle = document.createTextNode(getCategories.data[i].category);
      receiveListElement.appendChild(categories);
      categories.appendChild(categoriesTitle);
    }
  }
}

assetLiabilityCategories();

// 修改收入
const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const editIncome = document.getElementById("editIncome");

async function editIncomeList() {
  const selectCategories = document.getElementById("categoriesList");
  const receive = document.getElementById("receive");
  const inputIncomeDate = document.getElementById("inputIncomeDate");
  const inputIncomeAmount = document.getElementById("inputIncomeAmount");
  const inputIncomeRemark = document.getElementById("inputIncomeRemark");
  if (inputIncomeAmount.value != "") {
    let fetchAPI = await fetch(`/api/income_records/${id}`, {
      method: "PUT",
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
    let editSuccess = await fetchAPI.json();
    if (editSuccess) {
      hidden.style.display = "block";
      warnForm.style.display = "block";
      warn.style.color = "#8ce600";
      warn.textContent = "🅥 已修改此筆紀錄";
      setTimeout(function () {
        warnForm.style.display = "none";
        hidden.style.display = "none";
        window.location.href = "/property/income-list";
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

editIncome.addEventListener("click", editIncomeList);