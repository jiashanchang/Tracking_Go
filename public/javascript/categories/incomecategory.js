const addIncomeCategory = document.querySelector(".addIncomeCategory");
const addIncomeMessage = document.querySelector(".addIncomeMessage");
const cancelAddIncomeCategory = document.getElementById("cancelAddIncomeCategory");

const editIncomeCategory = document.querySelector(".editIncomeCategory");
const editIncomeMessage = document.querySelector(".editIncomeMessage");
const cancelEditIncomeCategory = document.getElementById("cancelEditIncomeCategory");

const inputIncomeCategory = document.getElementById("inputIncomeCategory");
const addIncomeCategoryImg = document.getElementById("addIncomeCategoryImg");

addIncomeCategoryImg.addEventListener("click", () => {
  addIncomeCategory.style.display = "block";
});

cancelAddIncomeCategory.addEventListener("click", () => {
  addIncomeCategory.style.display = "none";
});

cancelEditIncomeCategory.addEventListener("click", () => {
  editIncomeCategory.style.display = "none";
});

// 取得收入分類選單
async function incomeCategories() {
  let response = await fetch(`/api/income_categories`, {
    method: "GET",
  });
  let getCategories = await response.json();
  getCategories.data.forEach((item) => {
    if (item.memberId) {
      const incomeCategoriesElement = document.querySelector(".income-category-list");
      const incomeCategoryDiv = document.createElement("div");
      const editImage = document.createElement("i");
      const deleteImage = document.createElement("i");
      editImage.className = "fas fa-edit";
      editImage.id = item._id;
      deleteImage.className = "fas fa-trash";
      deleteImage.id = item._id;
      incomeCategoryDiv.className = "incomeCategory";
      incomeCategoryDiv.innerHTML = item.category;
      incomeCategoriesElement.appendChild(incomeCategoryDiv);
      incomeCategoryDiv.appendChild(editImage);
      incomeCategoryDiv.appendChild(deleteImage);
    } else {
      const incomeCategoriesElement = document.querySelector(".income-category-list");
      const incomeCategoryDiv = document.createElement("div");
      incomeCategoryDiv.className = "costCategory";
      incomeCategoryDiv.innerHTML = item.category;
      incomeCategoriesElement.appendChild(incomeCategoryDiv);
    }
  });
  document.querySelectorAll(".fa-edit").forEach((category) => {
    category.addEventListener("click", (event) => {
      inputIncomeCategory.value = "";
      const editIncomeCategory = document.querySelector(".editIncomeCategory");
      editIncomeCategory.style.display = "block";
      const incomeCategory = event.target.id;
      getIncomeCategory(incomeCategory);
    });
  });
  document.querySelectorAll(".fa-trash").forEach((category) => {
    category.addEventListener("click", (event) => {
      const incomeCategoryId = event.target.id;
      deleteIncomeCategory(incomeCategoryId);
    });
  });
}

incomeCategories();

// 取得收入分類id
async function getIncomeCategory(id) {
  let response = await fetch(`/api/income_categories/${id}`, {
    method: "GET",
  })
  let getSuccess = await response.json();
  if (getSuccess) {
    const incomeCategoryId = getSuccess.data._id;
    const editIncomeCategoryBtn = document.getElementById("editIncomeCategoryBtn");
    editIncomeCategoryBtn.addEventListener("click", function () {
      updateIncomeCategory(incomeCategoryId);
    });
  }
};

// 修改收入分類
async function updateIncomeCategory(Id) {
  let response = await fetch(`/api/income_categories/${Id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      incomeCategory: inputIncomeCategory.value,
    }),
  })
  let editSuccess = await response.json();
  if (editSuccess.ok) {
    window.location.reload();
  } else {
    editIncomeMessage.style.display = "flex";
    editIncomeMessage.textContent = `${editSuccess.message}`;
    setTimeout(function () {
      editIncomeMessage.style.display = "none";
    }, 1500);
  }
};

// 新增收入分類
const inputNewIncomeCategory = document.getElementById("inputNewIncomeCategory");
async function addNewIncomeCategory() {
  let response = await fetch(`/api/income_categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      incomeCategory: inputNewIncomeCategory.value,
    }),
  });
  let newIncomeCategory = await response.json();
  if (newIncomeCategory.ok) {
    window.location.reload();
  } else {
    addIncomeMessage.style.display = "flex";
    addIncomeMessage.textContent = `${newIncomeCategory.message}`;
    setTimeout(function () {
      addIncomeMessage.style.display = "none";
    }, 1500);
  }
}

const addIncomeCategoryBtn = document.getElementById("addIncomeCategoryBtn");
addIncomeCategoryBtn.addEventListener("click", addNewIncomeCategory);

// 刪除收入分類
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
async function deleteIncomeCategory(Id) {
  let url = `/api/income_categories/${Id}`;
  let response = await fetch(url, {
    method: "DELETE",
  });
  let deleteSuccess = await response.json();
  if (deleteSuccess.ok) {
    window.location.reload();
  } else {
    warnForm.style.display = "block";
    warn.style.color = "red";
    warn.textContent = "⚠ " + `${deleteSuccess.message}`;
    setTimeout(function () {
      warnForm.style.display = "none";
    }, 1000);
  }
}