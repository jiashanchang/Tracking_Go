const daysOfWeek = [
  "星期日",
  "星期一",
  "星期二",
  "星期三",
  "星期四",
  "星期五",
  "星期六",
];

let index = 1;

// 取得所得稅紀錄
const incomeTaxRecordList = document.querySelector(".incomeTaxRecordList");
async function taxList() {
  let response = await fetch(`/api/tax_records`, {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

taxList().then((records) => {
  const pageNumber = document.querySelector(".incomeTaxPageNumber");
  const buttonNumber = Math.ceil(records.length / 52);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allTaxButton = document.querySelectorAll(".incomeTaxPageNumber span");

  for (let j = 0; j < allTaxButton.length; j++) {
    allTaxButton[j].addEventListener("click", taxPage.bind(this, j + 1, records));
  }
  taxPage(1, records);
});

function taxPage(page, data) {
  const onePage = 52;
  const startPage = (page - 1) * onePage;
  const endPage = page * onePage;
  let str = "";
  for (let i = startPage; i < endPage; i++) {
    if (i >= data.length) {
      break;
    }
    const date = new Date(data[i].createdAt);
    const dayOfWeek = daysOfWeek[date.getDay()];
    const formattedDate = data[i].createdAt.replace(/-/g, "/");
    str += `<div class="record">
      <div class="date">${formattedDate} ${dayOfWeek}</div>
      <span class="income-tax">${data[i].incomeTax}</span>
      <span class="pay">${data[i].taxPayId.category}</span>
      <span class="amount">$ ${data[i].amount.toLocaleString()}</span>
      <div class="remark">${data[i].remark}</div>
      <a href="editincometax/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
      <img id=${data[i]._id} class="deleteTaxImg" src="/images/icon_trash-bin.jpg" />
      </div>`;
  }
  incomeTaxRecordList.innerHTML = str;

  const allTaxButton = document.querySelectorAll(".incomeTaxPageNumber span");
  allTaxButton.forEach((button, index) => {
    if (index === page - 1) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  allTaxButton.forEach((button, index) => {
    button.addEventListener("click", () => {
      taxPage(index + 1, data);
    });
  });

  document.querySelectorAll(".deleteTaxImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const taxRecordId = event.target.id;
      deleteTaxRecord(taxRecordId);
    });
  });
}

const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");

// 刪除所得稅紀錄
async function deleteTaxRecord(Id) {
  let url = `/api/tax_records/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    hidden.style.display = "block";
    warnForm.style.display = "block";
    warn.style.color = "#8ce600";
    warn.textContent = "🅥 紀錄刪除成功";
    setTimeout(function () {
      warnForm.style.display = "none";
      hidden.style.display = "none";
      window.location.reload();
    }, 1000);
  }
}

// 搜尋所得稅關鍵字
const searchCategoryInput = document.getElementById("search-category");
const searchCategoryButton = document.getElementById("btn-search");

searchCategoryButton.addEventListener("click", async () => {
  const category = searchCategoryInput.value;
  let response = await fetch(`/api/tax_records?search=${category}`, {
    method: "GET",
  });
  let keyword = await response.json();
  if (!keyword || !keyword.data || keyword.data.length === 0) {
    warnForm.style.display = "block";
    warn.style.color = "red";
    warn.textContent = "⚠ 查無此關鍵字";
    setTimeout(function () {
      warnForm.style.display = "none";
    }, 1000);
    return;
  }
  keyword = keyword.data;
  const pageNumber = document.querySelector(".incomeTaxPageNumber");
  const buttonNumber = Math.ceil(keyword.length / 52);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allTaxButton = document.querySelectorAll(".incomeTaxPageNumber span");

  for (let j = 0; j < allTaxButton.length; j++) {
    allTaxButton[j].addEventListener(
      "click",
      taxPage.bind(this, j + 1, keyword)
    );
  }
  taxPage(1, keyword);
});

// 所得稅分類
async function searchCategories() {
  const categories = ["所得稅費用", "所得稅利益"];
  const categoriesListElement = document.getElementById("category-list");
  categories.forEach((category) => {
    const categoriesItem = document.createElement("li");
    const categoriesTitle = document.createTextNode(category);
    categoriesItem.setAttribute("class", "categories");
    categoriesItem.appendChild(categoriesTitle);
    categoriesItem.addEventListener("click", chooseCategories);
    categoriesListElement.appendChild(categoriesItem);
  });
}

searchCategories()

// 選擇所得稅分類
function chooseCategories() {
  const categoriesValue = document.getElementById("search-category");
  categoriesValue.value = this.textContent;
}

document.onclick = function (event) {
  const categoriesList = document.getElementById("category-list");
  if (event.target.id != "search-category") {
    categoriesList.style.display = "none";
  } else {
    categoriesList.style.display = "flex";
  }
};