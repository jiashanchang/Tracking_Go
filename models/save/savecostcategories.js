const costCategory = require("../costcategory");
const mongoose = require("mongoose");
const db = mongoose.connection;

db.once("open", () => {
  costCategory.create(
    {
      category: "租金",
    },
    {
      category: "交通",
    },
    {
      category: "修繕",
    },
    {
      category: "水電瓦斯",
    },
    {
      category: "保險",
    },
    {
      category: "伙食",
    },
    {
      category: "交際",
    },
    {
      category: "捐贈",
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