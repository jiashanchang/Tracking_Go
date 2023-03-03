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
      const data = await costCategory.find();
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
      const data = await incomeCategory.find();
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

module.exports = router;