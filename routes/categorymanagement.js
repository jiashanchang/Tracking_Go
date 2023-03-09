const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const costCategory = require("../models/costcategory");
const incomeCategory = require("../models/incomecategory");
const assetLiabilityCategory = require("../models/assetliabilitycategory");
const dotenv = require("dotenv");

dotenv.config();

router.use(bodyParser.json());

router.get("/categorymanagement", (req, res) => {
  res.render("categorymanagement");
});

router.get("/categorymanagement/cost-category", (req, res) => {
  res.render("categories/cost-category");
});

router.get("/categorymanagement/income-category", (req, res) => {
  res.render("categories/income-category");
});

// 取得支出分類選單
router.get("/api/cost_categories", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const data = await costCategory.find({
        $or: [
          { memberId: checkJWT.id },
          { memberId: { $exists: false } }
        ]
      });
      return res.json({ ok: true, data: data });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得收入分類選單
router.get("/api/income_categories", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const data = await incomeCategory.find({
        $or: [
          { memberId: checkJWT.id },
          { memberId: { $exists: false } }
        ]
      });
      return res.json({ ok: true, data: data });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得資產負債分類選單
router.get("/api/asset_and_liability_categories", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    if (checkJWT) {
      const data = await assetLiabilityCategory.find();
      return res.json({ ok: true, data: data });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 新增支出分類
router.post("/api/cost_categories", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    const existingCostCategory = await costCategory.find({
      $or: [{ memberId: checkJWT.id }, { memberId: { $exists: false } }],
    });
    if (checkJWT) {
      if (req.body.costCategory !== "") {
        let categoryExists = false;
        for (let i = 0; i < existingCostCategory.length; i++) {
          if (existingCostCategory[i].category === req.body.costCategory) {
            categoryExists = true;
            break;
          }
        }
        if (categoryExists) {
          return res.json({
            error: true,
            message: "該支出分類已存在",
          });
        } else {
          await costCategory.create({
            category: req.body.costCategory,
            memberId: memberId,
          });
          return res.json({ ok: true });
        }
      } else {
        return res.json({
          error: true,
          message: "請輸入分類名稱",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 新增收入分類
router.post("/api/income_categories", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    const existingIncomeCategory = await incomeCategory.find({
      $or: [{ memberId: checkJWT.id }, { memberId: { $exists: false } }],
    });
    if (checkJWT) {
      if (req.body.incomeCategory !== "") {
        let categoryExists = false;
        for (let i = 0; i < existingIncomeCategory.length; i++) {
          if (existingIncomeCategory[i].category === req.body.incomeCategory) {
            categoryExists = true;
            break;
          }
        }
        if (categoryExists) {
          return res.json({
            error: true,
            message: "該收入分類已存在",
          });
        } else {
          await incomeCategory.create({
            category: req.body.incomeCategory,
            memberId: memberId,
          });
          return res.json({ ok: true });
        }
      } else {
        return res.json({
          error: true,
          message: "請輸入分類名稱",
        });
      }
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得支出分類id
router.get("/api/cost_categories/:id", async (req, res) => {
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
      const categories = await costCategory
        .findOne({ _id: req.params.id })
        .lean();
      return res.json({ data: categories });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得收入分類id
router.get("/api/income_categories/:id", async (req, res) => {
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
      const categories = await incomeCategory
        .findOne({ _id: req.params.id })
        .lean();
      return res.json({ data: categories });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 更新支出分類
router.put("/api/cost_categories/:id", async (req, res) => {
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
      const update = req.body;
      const existCostCategory = await costCategory.findOne({
        category: update.costCategory,
      });
      if (update.costCategory === "") {
        return res.json({
          error: true,
          message: "請輸入分類名稱",
        });
      } else {
        if (existCostCategory && existCostCategory._id.toString() !== req.params.id) {
          return res.json({
            error: true,
            message: "此分類已重複",
          });
        } else {
          await costCategory.findOneAndUpdate(
            { _id: req.params.id },
            {
              category: update.costCategory,
            },
            { new: true }
          );
        }
      }
      return res.json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 更新收入分類
router.put("/api/income_categories/:id", async (req, res) => {
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
      const update = req.body;
      const existIncomeCategory = await incomeCategory.findOne({
        category: update.incomeCategory,
      });
      if (update.incomeCategory === "") {
        return res.json({
          error: true,
          message: "請輸入分類名稱",
        });
      } else {
        if (existIncomeCategory && existIncomeCategory._id.toString() !== req.params.id) {
          return res.json({
            error: true,
            message: "此分類已重複",
          });
        } else {
          await incomeCategory.findOneAndUpdate(
            { _id: req.params.id },
            {
              category: update.incomeCategory,
            },
            { new: true }
          );
        }
      }
      return res.json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 刪除支出分類
router.delete("/api/cost_categories/:id", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    const eachCostCategory = await costCategory.findOne({
      _id: req.params.id,
      memberId: memberId,
    });
    if (!eachCostCategory) {
      return res.json({
        error: true,
        message: "該支出分類不存在",
      });
    }
    if (eachCostCategory.recordId.length !== 0) {
      return res.json({
        error: true,
        message: "該支出分類仍有記帳資料，無法刪除",
      });
    }
    await eachCostCategory.remove();
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 刪除收入分類
router.delete("/api/income_categories/:id", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    const eachIncomeCategory = await incomeCategory.findOne({
      _id: req.params.id,
      memberId: memberId,
    });
    if (!eachIncomeCategory) {
      return res.json({
        error: true,
        message: "該收入分類不存在",
      });
    }
    if (eachIncomeCategory.recordId.length !== 0) {
      return res.json({
        error: true,
        message: "該收入分類仍有記帳資料，無法刪除",
      });
    }
    await eachIncomeCategory.remove();
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

module.exports = router;