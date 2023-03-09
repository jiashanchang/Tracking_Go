const addCostCategory = document.querySelector(".addCostCategory");
const addCostMessage = document.querySelector(".addCostMessage");
const cancelAddCostCategory = document.getElementById("cancelAddCostCategory");

const editCostCategory = document.querySelector(".editCostCategory");
const editCostMessage = document.querySelector(".editCostMessage");
const cancelEditCostCategory = document.getElementById("cancelEditCostCategory");

const inputCostCategory = document.getElementById("inputCostCategory");
const addCostCategoryImg = document.getElementById("addCostCategoryImg");

addCostCategoryImg.addEventListener("click", () => {
  addCostCategory.style.display = "block";
});

cancelAddCostCategory.addEventListener("click", () => {
  addCostCategory.style.display = "none";
});

cancelEditCostCategory.addEventListener("click", () => {
  editCostCategory.style.display = "none";
});

// 取得支出分類選單
async function costCategories() {
  let response = await fetch(`/api/cost_categories`, {
    method: "GET",
  });
  let getCategories = await response.json();
  getCategories.data.forEach((item) => {
    if (item.memberId) {
      const costCategoriesElement = document.querySelector(".cost-category-list");
      const costCategoryDiv = document.createElement("div");
      const editImage = document.createElement("i");
      const deleteImage = document.createElement("i");
      editImage.className = "fas fa-edit";
      editImage.id = item._id;
      deleteImage.className = "fas fa-trash";
      deleteImage.id = item._id;
      costCategoryDiv.className = "costCategory";
      costCategoryDiv.innerHTML = item.category;
      costCategoriesElement.appendChild(costCategoryDiv);
      costCategoryDiv.appendChild(editImage);
      costCategoryDiv.appendChild(deleteImage);
    } else {
      const costCategoriesElement = document.querySelector(".cost-category-list");
      const costCategoryDiv = document.createElement("div");
      costCategoryDiv.className = "costCategory";
      costCategoryDiv.innerHTML = item.category;
      costCategoriesElement.appendChild(costCategoryDiv);
    }
  });
  document.querySelectorAll(".fa-edit").forEach((category) => {
    category.addEventListener("click", (event) => {
      inputCostCategory.value = "";
      const editCostCategory = document.querySelector(".editCostCategory");
      editCostCategory.style.display = "block";
      const costCategory = event.target.id;
      getCostCategory(costCategory);
    });
  });
  document.querySelectorAll(".fa-trash").forEach((category) => {
    category.addEventListener("click", (event) => {
      const costCategoryId = event.target.id;
      deleteCostCategory(costCategoryId);
    });
  });
}

costCategories();

// 取得支出分類id
async function getCostCategory(id) {
  let response = await fetch(`/api/cost_categories/${id}`, {
    method: "GET",
  })
  let getSuccess = await response.json();
  if (getSuccess) {
    const costCategoryId = getSuccess.data._id;
    const editCostCategoryBtn = document.getElementById("editCostCategoryBtn");
    editCostCategoryBtn.addEventListener("click", function () {
      updateCostCategory(costCategoryId);
    });
  }
};

// 修改支出分類
async function updateCostCategory(Id) {
  let response = await fetch(`/api/cost_categories/${Id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      costCategory: inputCostCategory.value,
    }),
  })
  let editSuccess = await response.json();
  if (editSuccess.ok) {
    window.location.reload();
  } else {
    editCostMessage.style.display = "flex";
    editCostMessage.textContent = `${editSuccess.message}`;
    setTimeout(function () {
      editCostMessage.style.display = "none";
    }, 1500);
  }
};

// 新增支出分類
const inputNewCostCategory = document.getElementById("inputNewCostCategory");
async function addNewCostCategory() {
  let response = await fetch(`/api/cost_categories`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      costCategory: inputNewCostCategory.value,
    }),
  });
  let newCostCategory = await response.json();
  if (newCostCategory.ok) {
    window.location.reload();
  } else {
    addCostMessage.style.display = "flex";
    addCostMessage.textContent = `${newCostCategory.message}`;
    setTimeout(function () {
      addCostMessage.style.display = "none";
    }, 1500);
  }
}

const addCostCategoryBtn = document.getElementById("addCostCategoryBtn");
addCostCategoryBtn.addEventListener("click", addNewCostCategory);

// 刪除支出分類
const warnForm = document.getElementById("warnForm");
const warn = document.getElementById("warn");
async function deleteCostCategory(Id) {
  let url = `/api/cost_categories/${Id}`;
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