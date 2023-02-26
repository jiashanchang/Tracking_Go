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
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const editCost = document.getElementById("editCost");
editCost.addEventListener("click", () => {
  const selectCategories = document.getElementById("categoriesList");
  const pay = document.getElementById("pay");
  const inputCostDate = document.getElementById("inputCostDate");
  const inputCostAmount = document.getElementById("inputCostAmount");
  const inputCostRemark = document.getElementById("inputCostRemark");
  if (inputCostAmount.value != "") {
    fetch(`/api/cost_records/${id}`, {
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