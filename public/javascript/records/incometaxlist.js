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

// 刪除所得稅紀錄
async function deleteTaxRecord(Id) {
  let url = `/api/tax_records/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  }
}