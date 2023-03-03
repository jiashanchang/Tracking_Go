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

// 取得沖帳紀錄
const writeOffRecordList = document.querySelector(".writeOffRecordList");
async function writeOffList() {
  let response = await fetch(`/api/writeoff_records`, {
    method: "GET",
  });
  let records = await response.json();
  records = records.data;
  return records;
}

writeOffList().then((records) => {
  const pageNumber = document.querySelector(".writeOffPageNumber");
  const buttonNumber = Math.ceil(records.length / 52);
  let str = "";
  for (let j = 0; j < buttonNumber; j++) {
    str += `<span>${j + 1}</span>`;
  }
  pageNumber.innerHTML = str;
  const allWriteOffButton = document.querySelectorAll(".writeOffPageNumber span");

  for (let j = 0; j < allWriteOffButton.length; j++) {
    allWriteOffButton[j].addEventListener("click", writeOffPage.bind(this, j + 1, records));
  }
  writeOffPage(1, records);
});

function writeOffPage(page, data) {
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
      <span class="payId">${data[i].payId.category}</span>
      <span class="receiveId">${data[i].receiveId.category}</span>
      <span class="amount">$ ${data[i].amount.toLocaleString()}</span>
      <div class="remark">${data[i].remark}</div>
      <a href="editwriteoff/${data[i]._id}"><img src="/images/icon_pencil.jpg" class="updateImg"></a>   
      <img id=${data[i]._id} class="deleteWriteOffImg" src="/images/icon_trash-bin.jpg" />
      </div>`;
  }
  document.querySelector(".writeOffRecordList").innerHTML = str;

  const allWriteOffButton = document.querySelectorAll(".writeOffPageNumber span");
  allWriteOffButton.forEach((button, index) => {
    if (index === page - 1) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  allWriteOffButton.forEach((button, index) => {
    button.addEventListener("click", () => {
      writeOffPage(index + 1, data);
    });
  });

  document.querySelectorAll(".deleteWriteOffImg").forEach((record) => {
    record.addEventListener("click", (event) => {
      const writeOffRecordId = event.target.id;
      deleteWriteOffRecord(writeOffRecordId);
    });
  });
}

// 刪除沖帳紀錄
async function deleteWriteOffRecord(Id) {
  let url = `/api/writeoff_records/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  }
}