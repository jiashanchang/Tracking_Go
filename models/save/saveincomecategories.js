const incomeCategory = require("../incomecategory");
const mongoose = require("mongoose");
const db = mongoose.connection;

db.once("open", () => {
  incomeCategory.create(
    {
      category: "薪水",
    },
    {
      category: "買賣",
    },
    {
      category: "投資",
    },
    {
      category: "副業",
    },
    {
      category: "其他",
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