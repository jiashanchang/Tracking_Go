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

// 取得收入紀錄
const incomeRecordList = document.querySelector(".incomeRecordList");
async function incomeList() {
  let response = await fetch(`/api/income_records`, {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

incomeList().then((records) => {
  const pageNumber = document.querySelector(".incomePageNumber");
  const buttonNumber = Math.ceil(records.length / 52);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allIncomeButton = document.querySelectorAll(".incomePageNumber span");
  for (let j = 0; j < allIncomeButton.length; j++) {
    allIncomeButton[j].addEventListener("click", incomePage.bind(this, j + 1, records));
  }
  incomePage(1, records);
});

function incomePage(page, data) {
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
      <span class="receive">${data[i].receiveId.category}</span>
      <span class="amount">$ ${data[i].amount.toLocaleString()}</span>
      <div class="remark">${data[i].remark}</div>
      <a href="editincome/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
      <img id=${data[i]._id} class="deleteIncomeImg" src="/images/icon_trash-bin.jpg" />
      </div>`;
  }
  document.querySelector(".incomeRecordList").innerHTML = str;

  const allIncomeButton = document.querySelectorAll(".incomePageNumber span");
  allIncomeButton.forEach((button, index) => {
    if (index === page - 1) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  allIncomeButton.forEach((button, index) => {
    button.addEventListener("click", () => {
      incomePage(index + 1, data);
    });
  });

  document.querySelectorAll(".deleteIncomeImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const incomeRecordId = event.target.id;
      deleteIncomeRecord(incomeRecordId);
    });
  });
}

// 刪除收入紀錄
async function deleteIncomeRecord(Id) {
  let url = `/api/income_records/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  }
}

// 搜尋收入關鍵字
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
const searchCategoryInput = document.getElementById("search-category");
const searchCategoryButton = document.getElementById("btn-search");

searchCategoryButton.addEventListener("click", async () => {
  const category = searchCategoryInput.value;
  const response = await fetch(`/api/income_records?search=${category}`, {
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
  const pageNumber = document.querySelector(".incomePageNumber");
  const buttonNumber = Math.ceil(keyword.length / 52);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allIncomeButton = document.querySelectorAll(".incomePageNumber span");

  for (let j = 0; j < allIncomeButton.length; j++) {
    allIncomeButton[j].addEventListener(
      "click",
      incomePage.bind(this, j + 1, keyword)
    );
  }
  incomePage(1, keyword);
});