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
  let response = await fetch("/property/api/cost/record", {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

costList().then((records) => {
  const pageNumber = document.querySelector(".costPageNumber");
  const buttonNumber = Math.ceil(records.length / 8);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allCostButton = document.querySelectorAll(".costPageNumber span");

  for (let j = 0; j < allCostButton.length; j++) {
    allCostButton[j].addEventListener(
      "click",
      costPage.bind(this, j + 1, records)
    );
  }
  costPage(1, records);
});

function costPage(page, data) {
  const onePage = 8;
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
    <span class="remark">${data[i].remark}</span>
    <a href="property/editcost/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
    <img id=${data[i]._id} class="deleteCostImg" src="/images/icon_trash-bin.jpg" />
    </div>`;
  }
  document.querySelector(".costRecordList").innerHTML = str;
  document.querySelectorAll(".deleteCostImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const costRecordId = event.target.id;
      deleteCostRecord(costRecordId);
    });
  });
}

// 刪除支出紀錄
async function deleteCostRecord(Id) {
  let url = `property/cost/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  }
}

// 取得收入紀錄
const incomeRecordList = document.querySelector(".incomeRecordList");
async function incomeList() {
  let response = await fetch("/property/api/income/record", {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

incomeList().then((records) => {
  const pageNumber = document.querySelector(".incomePageNumber");
  const buttonNumber = Math.ceil(records.length / 8);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allIncomeButton = document.querySelectorAll(".incomePageNumber span");
  for (let j = 0; j < allIncomeButton.length; j++) {
    allIncomeButton[j].addEventListener(
      "click",
      incomePage.bind(this, j + 1, records)
    );
  }
  incomePage(1, records);
});

function incomePage(page, data) {
  const onePage = 8;
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
    <span class="remark">${data[i].remark}</span>
    <a href="property/editincome/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
    <img id=${data[i]._id} class="deleteIncomeImg" src="/images/icon_trash-bin.jpg" />
    </div>`;
  }
  document.querySelector(".incomeRecordList").innerHTML = str;
  document.querySelectorAll(".deleteIncomeImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const incomeRecordId = event.target.id;
      deleteIncomeRecord(incomeRecordId);
    });
  });
}

// 刪除收入紀錄
async function deleteIncomeRecord(Id) {
  let url = `property/income/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  }
}

// 取得沖帳紀錄
const writeOffRecordList = document.querySelector(".writeOffRecordList");
async function writeOffList() {
  let response = await fetch("/property/api/writeoff/record", {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

writeOffList().then((records) => {
  const pageNumber = document.querySelector(".writeOffPageNumber");
  const buttonNumber = Math.ceil(records.length / 8);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allWriteOffButton = document.querySelectorAll(".writeOffPageNumber span");

  for (let j = 0; j < allWriteOffButton.length; j++) {
    allWriteOffButton[j].addEventListener(
      "click",
      writeOffPage.bind(this, j + 1, records)
    );
  }
  writeOffPage(1, records);
});

function writeOffPage(page, data) {
  const onePage = 8;
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
    <span class="payId">${data[i].payId.category}</span>
    <span class="receiveId">${data[i].receiveId.category}</span>
    <span class="amount">$ ${data[i].amount.toLocaleString()}</span>
    <span class="remark">${data[i].remark}</span>
    <a href="property/editwriteoff/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
    <img id=${data[i]._id} class="deleteWriteOffImg" src="/images/icon_trash-bin.jpg" />
    </div>`;
  }
  document.querySelector(".writeOffRecordList").innerHTML = str;
  document.querySelectorAll(".deleteWriteOffImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const writeOffRecordId = event.target.id;
      deleteWriteOffRecord(writeOffRecordId);
    });
  });
}

// 刪除沖帳紀錄
async function deleteWriteOffRecord(Id) {
  let url = `property/writeoff/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  }
}

// 取得所得稅紀錄
const incomeTaxRecordList = document.querySelector(".incomeTaxRecordList");
async function taxList() {
  let response = await fetch("/property/api/incometax/record", {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

taxList().then((records) => {
  const pageNumber = document.querySelector(".incomeTaxPageNumber");
  const buttonNumber = Math.ceil(records.length / 8);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allTaxButton = document.querySelectorAll(".incomeTaxPageNumber span");

  for (let j = 0; j < allTaxButton.length; j++) {
    allTaxButton[j].addEventListener(
      "click",
      taxPage.bind(this, j + 1, records)
    );
  }
  taxPage(1, records);
});

function taxPage(page, data) {
  const onePage = 8;
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
    <span class="remark">${data[i].remark}</span>
    <a href="property/editincometax/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
    <img id=${data[i]._id} class="deleteTaxImg" src="/images/icon_trash-bin.jpg" />
    </div>`;
  }
  incomeTaxRecordList.innerHTML = str;
  document.querySelectorAll(".deleteTaxImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const taxRecordId = event.target.id;
      deleteTaxRecord(taxRecordId);
    });
  });
}

// 刪除所得稅紀錄
async function deleteTaxRecord(Id) {
  let url = `property/incometax/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  }
}