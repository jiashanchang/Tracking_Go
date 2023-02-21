const assetLiabilityCategory = require("../assetliabilitycategory");
const mongoose = require("mongoose");
const db = mongoose.connection;

db.once("open", () => {
  assetLiabilityCategory.create(
    {
      category: "現金",
    },
    {
      category: "銀行存款",
    },
    {
      category: "其他應收款",
    },
    {
      category: "預付款項",
    },
    {
      category: "存出保證金",
    },
    {
      category: "短期借款",
    },
    {
      category: "其他應付款",
    },
    {
      category: "預收款項",
    },
    {
      category: "長期借款",
    },
    {
      category: "存入保證金",
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