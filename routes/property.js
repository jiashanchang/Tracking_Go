const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const costCategory = require("../models/costcategory");
const costRecord = require("../models/costrecord");
const incomeCategory = require("../models/incomecategory");
const incomeRecord = require("../models/incomerecord");
const dotenv = require("dotenv");

dotenv.config();

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.render("property");
});

router.get("/records/addcost", (req, res) => {
  res.render("records/addcost");
});

router.get("/records/addincome", (req, res) => {
  res.render("records/addincome");
});

// 支出分類選單
router.get("/api/costcategories", async (req, res) => {
  const data = await costCategory.find();
  return res.json({ ok: true, data: data });
});

// 收入分類選單
router.get("/api/incomecategories", async (req, res) => {
  const data = await incomeCategory.find();
  return res.json({ ok: true, data: data });
});

// 取得支出紀錄
router.get("/api/cost/record", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id
    if (checkJWT) {
      await costCategory
        .find()
        .lean()
        .then((searchRecord) => {
          costRecord
            .find({ memberId: memberId })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              return res.json({ data: records });
            });
        });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得收入紀錄
router.get("/api/income/record", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id
    if (checkJWT) {
      await incomeCategory
        .find()
        .lean()
        .then((searchRecord) => {
          incomeRecord
            .find({ memberId: memberId })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              return res.json({ data: records });
            });
        });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 新增支出紀錄
router.post("/api/add/costrecord", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const categoriesData = await costCategory.find();
    const categoriesId = [];
    categoriesData.forEach((category) => {
      categoriesId.push(category._id);
    });

    for (let i = 0; i < categoriesData.length; i++) {
      if (categoriesData[i].category === req.body.costCategory) {
        if (req.body.costAmount != ""){
          await costRecord
            .create({
              memberId: checkJWT.id,
              categoryId: categoriesId[i],
              pay: req.body.costPay,
              createdAt: req.body.costDate,
              amount: req.body.costAmount,
              remark: req.body.costRemark,
            })
            .then((record) => {
              costCategory.findById(categoriesId[i]).then((category) => {
                category.recordId.push(record._id);
                category.save();
              });
            });
          return res.json({ ok: true });
        } else {
          return res.json({ error: true, message: "請填寫金額" });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 新增收入紀錄
router.post("/api/add/incomerecord", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const categoriesData = await incomeCategory.find();
    const categoriesId = [];
    categoriesData.forEach((category) => {
      categoriesId.push(category._id);
    });

    for (let i = 0; i < categoriesData.length; i++) {
      if (categoriesData[i].category === req.body.incomeCategory) {
        if (req.body.incomeAmount != ""){
          await incomeRecord
            .create({
              memberId: checkJWT.id,
              categoryId: categoriesId[i],
              receive: req.body.incomeReceive,
              createdAt: req.body.incomeDate,
              amount: req.body.incomeAmount,
              remark: req.body.incomeRemark,
            })
            .then((record) => {
              incomeCategory.findById(categoriesId[i]).then((category) => {
                category.recordId.push(record._id);
                category.save();
              });
            });
          return res.json({ ok: true });
        } else {
          return res.json({ error: true, message: "請填寫金額" });
        }
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得支出id
router.get("/cost/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      await costCategory
        .find()
        .lean()
        .then((searchRecord) => {
          costRecord
            .findOne({
              _id: req.params.id,
            })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              return res.json({ data: records });
            });
        });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得收入id
router.get("/income/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      await incomeCategory
        .find()
        .lean()
        .then((searchRecord) => {
          incomeRecord
            .findOne({
              _id: req.params.id,
            })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              return res.json({ data: records });
            });
        });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 選取要更新的支出紀錄id
router.get("/editcost/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const costRecords = await costRecord
        .findOne({
          _id: req.params.id,
        })
        .lean();
      res.render("records/editcost", {
        costRecords,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 選取要更新的收入紀錄id
router.get("/editincome/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const incomeRecords = await incomeRecord
        .findOne({
          _id: req.params.id,
        })
        .lean();
      res.render("records/editincome", {
        incomeRecords,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 更新支出紀錄
router.put("/cost/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const { id } = req.params;
      const update = req.body;
      await costRecord.findById(id).then((record) => {
        costCategory
          .findById(record.categoryId)
          .then((category) => {
            category.recordId = category.recordId.filter(record => record.toString() !== id);
            category.save();
          })
      });
      await costCategory.findOne({ category: update.costCategory }).then((category) => {
        update.costCategory = category._id;
        costRecord.findOneAndUpdate(
          { _id: req.params.id },
          {
            pay: update.costPay,
            createdAt: update.costDate,
            amount: update.costAmount,
            remark: update.costRemark,
          },
          { new: true }
        )
        .then((record) => {
          category.recordId.push(record._id);
          category.save();        
        })
        .catch(error => console.error(error));
      });
      return res.json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 更新收入紀錄
router.put("/income/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token
    if(!cookies){
      return res.json({
          "error": true,
          "message": "未登入系統，拒絕存取"
      })
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET)
    if (checkJWT) {
      const { id } = req.params
      const update = req.body
      await incomeRecord.findById(id)
        .then(record => {
          incomeCategory.findById(record.categoryId)
          .then(category => {
            category.recordId = category.recordId.filter(record => record.toString() !== id);
            category.save()
          })
      })
      await incomeCategory.findOne({ category: update.incomeCategory })
        .then(category => {
          update.incomeCategory = category._id
          incomeRecord.findOneAndUpdate({_id: req.params.id},
            {
              receive: update.incomeReceive,
              createdAt: update.incomeDate,
              amount: update.incomeAmount,
              remark: update.incomeRemark
            },
            { new: true }
          )
            .then(record => {
                category.recordId.push(record._id)
                category.save()
            })
            .catch(error => console.error(error));
        })
      return res.json({"ok": true})
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
})

// 刪除支出
router.delete("/cost/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const { id } = req.params
      await costRecord.findById(id)
        .then(record => {
            costCategory.findById(record.categoryId)
            .then(category => {
              category.recordId = category.recordId.filter(record => record.toString() !== id)
              category.save()
            })
            .catch(error => console.error(error));
            record.remove()
        })
      return res.json({"ok": true})
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 刪除收入
router.delete("/income/:id", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const { id } = req.params
      await incomeRecord.findById(id)
        .then(record => {
            incomeCategory.findById(record.categoryId)
            .then(category => {
              category.recordId = category.recordId.filter(record => record.toString() !== id)
              category.save()
            })
            .catch(error => console.error(error));
            record.remove()
        })
      return res.json({"ok": true})
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

module.exports = router;