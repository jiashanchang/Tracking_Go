const daysOfWeek = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

// 取得支出紀錄
const costRecordList = document.querySelector(".costRecordList");
async function costList() {
  let response = await fetch("/property/api/cost/record", {
    method: "GET",
  })
  let records = await response.json();
  if (records.data) {
    for (let i = 0; i < records.data.length; i++) {
      const date = new Date(records.data[i].createdAt);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const divElement = document.createElement("div");
      divElement.className = "record";
      const dateElement = document.createElement("div");
      dateElement.className = "date";
      const dateTitle = document.createTextNode(records.data[i].createdAt + " " + dayOfWeek);
      const categoryElement = document.createElement("span");
      categoryElement.className = "category";
      const categoryTitle = document.createTextNode(records.data[i].categoryId.category);
      const payElement = document.createElement("span");
      payElement.className = "pay";
      const payTitle = document.createTextNode(records.data[i].pay);
      const amountElement = document.createElement("span");
      amountElement.className = "amount";
      const amountTitle = document.createTextNode("$" + records.data[i].amount.toLocaleString());
      const remarkElement = document.createElement("span");
      remarkElement.className = "remark";
      const remarkTitle = document.createTextNode(records.data[i].remark);

      const aElement = document.createElement("a");
      const updateImg = document.createElement("img");
      updateImg.className = "updateImg";
      updateImg.src = "/images/icon_pencil.jpg";
      aElement.setAttribute("href", `property/editcost/${records.data[i]._id}`);

      const deleteCostImg = document.createElement("img");
      deleteCostImg.id = records.data[i]._id;
      deleteCostImg.className = "deleteCostImg";
      deleteCostImg.src = "/images/icon_trash-bin.jpg";

      costRecordList.appendChild(divElement);

      divElement.appendChild(dateElement);
      dateElement.appendChild(dateTitle);

      divElement.appendChild(categoryElement);
      categoryElement.appendChild(categoryTitle);

      divElement.appendChild(payElement);
      payElement.appendChild(payTitle);

      divElement.appendChild(amountElement);
      amountElement.appendChild(amountTitle);

      divElement.appendChild(remarkElement);
      remarkElement.appendChild(remarkTitle);

      divElement.appendChild(aElement);
      aElement.appendChild(updateImg);

      divElement.appendChild(deleteCostImg);
    }
    document.querySelectorAll(".deleteCostImg").forEach((record) => {
      record.addEventListener("click", (event) => {
        const costRecordId = event.target.id;
        deleteCostRecord(costRecordId);
      });
    });
  }
}

costList();

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
  })
  let records = await response.json();
  if (records.data) {
    for (let i = 0; i < records.data.length; i++) {
      const date = new Date(records.data[i].createdAt);
      const dayOfWeek = daysOfWeek[date.getDay()];
      const divElement = document.createElement("div");
      divElement.className = "record";
      const dateElement = document.createElement("div");
      dateElement.className = "date";
      const dateTitle = document.createTextNode(records.data[i].createdAt + " " + dayOfWeek);
      const categoryElement = document.createElement("span");
      categoryElement.className = "category";
      const categoryTitle = document.createTextNode(records.data[i].categoryId.category);
      const receiveElement = document.createElement("span");
      receiveElement.className = "receive";
      const receiveTitle = document.createTextNode(records.data[i].receive);
      const amountElement = document.createElement("span");
      amountElement.className = "amount";
      const amountTitle = document.createTextNode("$" + records.data[i].amount.toLocaleString());
      const remarkElement = document.createElement("span");
      remarkElement.className = "remark";
      const remarkTitle = document.createTextNode(records.data[i].remark);

      const aElement = document.createElement("a");
      const updateImg = document.createElement("img");
      updateImg.className = "updateImg";
      updateImg.src = "/images/icon_pencil.jpg";
      aElement.setAttribute("href", `property/editincome/${records.data[i]._id}`);

      const deleteIncomeImg = document.createElement("img");
      deleteIncomeImg.id = records.data[i]._id;      
      deleteIncomeImg.className = "deleteIncomeImg";
      deleteIncomeImg.src = "/images/icon_trash-bin.jpg";

      incomeRecordList.appendChild(divElement);

      divElement.appendChild(dateElement);
      dateElement.appendChild(dateTitle);

      divElement.appendChild(categoryElement);
      categoryElement.appendChild(categoryTitle);

      divElement.appendChild(receiveElement);
      receiveElement.appendChild(receiveTitle);

      divElement.appendChild(amountElement);
      amountElement.appendChild(amountTitle);

      divElement.appendChild(remarkElement);
      remarkElement.appendChild(remarkTitle);

      divElement.appendChild(aElement);
      aElement.appendChild(updateImg);

      divElement.appendChild(deleteIncomeImg);

      document.querySelectorAll(".deleteIncomeImg").forEach((record) => {
        record.addEventListener("click", (event) => {
          const incomeRecordId = event.target.id;
          deleteIncomeRecord(incomeRecordId);
        });
      });
    }
  }
}

incomeList();

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