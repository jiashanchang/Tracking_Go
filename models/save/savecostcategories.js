const costCategory = require("../costcategory");
const mongoose = require("mongoose");
const db = mongoose.connection;

db.once("open", () => {
  costCategory.create(
    {
      category: "租金支出",
    },
    {
      category: "文具用品",
    },
    {
      category: "旅費",
    },
    {
      category: "運費",
    },
    {
      category: "郵電費",
    },
    {
      category: "修繕費",
    },
    {
      category: "廣告費",
    },
    {
      category: "水電瓦斯費",
    },
    {
      category: "保險費",
    },
    {
      category: "交際費",
    },
    {
      category: "捐贈",
    },
    {
      category: "稅捐",
    },
    {
      category: "伙食費",
    },
    {
      category: "訓練費",
    },
    {
      category: "其他費用",
    },
    {
      category: "利息支出",
    },
    {
      category: "其他損失",
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