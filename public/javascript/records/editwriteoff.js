let url = location.href;
let id = url.split("/")[5];

async function getWriteOffRecordData() {
  let response = await fetch(`/api/writeoff_records/${id}`, {
    method: "GET",
  });
  let writeOffData = await response.json();
  if (writeOffData.data) {
    document.getElementById("debitCategory").value = `${writeOffData.data.payId.category}`;
    document.getElementById("creditCategory").value = `${writeOffData.data.receiveId.category}`;
    document.getElementById("inputWriteOffDate").value = `${writeOffData.data.createdAt}`;
    document.getElementById("inputWriteOffAmount").value = `${writeOffData.data.amount}`;
    document.getElementById("inputWriteOffRemark").value = `${writeOffData.data.remark}`;
  }
}

getWriteOffRecordData();

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

// 修改沖帳
const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const editWriteOff = document.getElementById("editWriteOff");

async function editWriteOffList() {
  const debitCategory = document.getElementById("debitCategory");
  const creditCategory = document.getElementById("creditCategory");
  const inputWriteOffDate = document.getElementById("inputWriteOffDate");
  const inputWriteOffAmount = document.getElementById("inputWriteOffAmount");
  const inputWriteOffRemark = document.getElementById("inputWriteOffRemark");
  if (inputWriteOffAmount.value != "") {
    let fetchAPI = await fetch(`/api/writeoff_records/${id}`, {
      method: "PUT",
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
    let editSuccess = await fetchAPI.json();
    if (editSuccess) {
      hidden.style.display = "block";
      warnForm.style.display = "block";
      warn.style.color = "#8ce600";
      warn.textContent = "🅥 已修改此筆紀錄";
      setTimeout(function () {
        warnForm.style.display = "none";
        hidden.style.display = "none";
        window.location.href = "/property/writeoff-list";
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

editWriteOff.addEventListener("click", editWriteOffList);