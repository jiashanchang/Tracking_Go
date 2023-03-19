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

// 取得支出紀錄
const costRecordList = document.querySelector(".costRecordList");
async function costList() {
  let response = await fetch(`/api/cost_records`, {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

costList().then((records) => {
  const pageNumber = document.querySelector(".costPageNumber");
  const buttonNumber = Math.ceil(records.length / 52);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allCostButton = document.querySelectorAll(".costPageNumber span");

  for (let j = 0; j < allCostButton.length; j++) {
    allCostButton[j].addEventListener("click", costPage.bind(this, j + 1, records));
  }
  costPage(1, records);
});

function costPage(page, data) {
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
      <span class="category">${data[i].categoryId.category}</span>
      <span class="pay">${data[i].payId.category}</span>
      <span class="amount">$ ${data[i].amount.toLocaleString()}</span>
      <div class="remark">${data[i].remark}</div>
      <a href="editcost/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
      <img id=${data[i]._id} class="deleteCostImg" src="/images/icon_trash-bin.jpg" />
      </div>`;
  }
  document.querySelector(".costRecordList").innerHTML = str;

  const allCostButton = document.querySelectorAll(".costPageNumber span");
  allCostButton.forEach((button, index) => {
    if (index === page - 1) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  allCostButton.forEach((button, index) => {
    button.addEventListener("click", () => {
      costPage(index + 1, data);
    });
  });

  document.querySelectorAll(".deleteCostImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const costRecordId = event.target.id;
      deleteCostRecord(costRecordId);
    });
  });
}

const hidden = document.getElementById("hidden");
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");

// 刪除支出紀錄
async function deleteCostRecord(Id) {
  let url = `/api/cost_records/${Id}`;
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

// 搜尋支出關鍵字
const searchCategoryInput = document.getElementById("search-category");
const searchCategoryButton = document.getElementById("btn-search");

searchCategoryButton.addEventListener("click", async () => {
  const category = searchCategoryInput.value;
  let response = await fetch(`/api/cost_records?search=${category}`, {
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
  const pageNumber = document.querySelector(".costPageNumber");
  const buttonNumber = Math.ceil(keyword.length / 52);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allCostButton = document.querySelectorAll(".costPageNumber span");

  for (let j = 0; j < allCostButton.length; j++) {
    allCostButton[j].addEventListener(
      "click",
      costPage.bind(this, j + 1, keyword)
    );
  }
  costPage(1, keyword);
});

// 支出分類
async function searchCategories() {
  let response = await fetch(`/api/cost_categories`, {
    method: "GET",
  })
  let data = await response.json();
  const countCategories = data.data.length;
  for (let j = 0; j < countCategories; j++) {
    const categoriesListElement = document.getElementById("category-list");
    const categories = document.createElement("li");
    const categoriesTitle = document.createTextNode(data.data[j].category);
    categories.setAttribute("class", "categories");
    categories.appendChild(categoriesTitle);
    categories.addEventListener("click", chooseCategories);
    categoriesListElement.appendChild(categories);
  }
};

searchCategories();

// 選擇支出分類
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