const incomeCategory = require("../incomecategory");
const mongoose = require("mongoose");
const db = mongoose.connection;

db.once("open", () => {
  incomeCategory.create(
    {
      category: "薪資收入",
    },
    {
      category: "租賃收入",
    },
    {
      category: "股利收入",
    },
    {
      category: "利息收入",
    },
    {
      category: "其他收入",
    }
  )
  .then(() => {
    db.close();
    console.log("已建立新分類");
  })
  .catch((error) => {
    db.close();
    console.log("分類建立失敗");
  });
});