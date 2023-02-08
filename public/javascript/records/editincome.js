let url = location.href;
let id = url.split("/")[5];

async function getIncomeRecordData() {
  let response = await fetch(`/property/income/${id}`, {
    method: "GET",
  })
  let incomeData = await response.json();
  if (incomeData.data) {
    document.getElementById("categoriesList").value = `${incomeData.data.categoryId.category}`;
    document.getElementById("inputIncomeDate").value = `${incomeData.data.createdAt}`;
    document.getElementById("inputIncomeAmount").value = `${incomeData.data.amount}`;
    document.getElementById("inputIncomeRemark").value = `${incomeData.data.remark}`;
  }
}

getIncomeRecordData();

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

// 修改收入
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const editIncome = document.getElementById("editIncome");
editIncome.addEventListener("click", () => {
  const selectCategories = document.getElementById("categoriesList");
  const receive = document.getElementById("receive")
  const inputIncomeDate = document.getElementById("inputIncomeDate");
  const inputIncomeAmount = document.getElementById("inputIncomeAmount");
  const inputIncomeRemark = document.getElementById("inputIncomeRemark");
  if (inputIncomeAmount.value != "") {
    fetch(`/property/income/${id}`, {
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