const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const costCategory = require("../models/costcategory");
const costRecord = require("../models/costrecord");
const incomeCategory = require("../models/incomecategory");
const incomeRecord = require("../models/incomerecord");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

router.use(bodyParser.json());

router.get("/financialanalysis", (req, res) => {
  res.render("financialanalysis");
});

// 月支出
router.get("/api/monthly/cost", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const month = req.query.month;
    const newMonth = month.slice(-2);
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      await costCategory
        .find()
        .lean()
        .then((matchRecord) => {
          costRecord
            .find({ memberId: memberId, month: newMonth })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              let totalCost = 0;
              records.forEach((record) => (totalCost += record.amount));
              return res.json({ data: records, totalCost: totalCost });
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

// 月收入
router.get("/api/monthly/income", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const month = req.query.month;
    const newMonth = month.slice(-2);
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      await incomeCategory
        .find()
        .lean()
        .then((matchRecord) => {
          incomeRecord
            .find({ memberId: memberId, month: newMonth })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              let totalIncome = 0;
              records.forEach((record) => (totalIncome += record.amount));
              return res.json({ data: records, totalIncome: totalIncome });
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

// 年支出
router.get("/api/yearly/cost", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const year = req.query.year.slice(0, -1);
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      await costCategory
        .find()
        .lean()
        .then((matchRecord) => {
          costRecord
            .find({ memberId: memberId, year: year })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              let totalCost = 0;
              records.forEach((record) => (totalCost += record.amount));
              return res.json({ data: records, totalCost: totalCost });
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

// 年收入
router.get("/api/yearly/income", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const year = req.query.year.slice(0, -1);
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      await incomeCategory
        .find()
        .lean()
        .then((matchRecord) => {
          incomeRecord
            .find({ memberId: memberId, year: year })
            .populate("categoryId")
            .lean()
            .sort({ createdAt: -1 })
            .then((records) => {
              let totalIncome = 0;
              records.forEach((record) => (totalIncome += record.amount));
              return res.json({ data: records, totalIncome: totalIncome });
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

// 月結餘
router.get("/api/monthly/net", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const month = req.query.month;
    const newMonth = month.slice(-2);
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      const costAmountList = await costRecord.aggregate([
        {
          $match: {
            memberId: mongoose.Types.ObjectId(memberId),
            month: newMonth,
          },
        },
      ]);
      const incomeAmountList = await incomeRecord.aggregate([
        {
          $match: {
            memberId: mongoose.Types.ObjectId(memberId),
            month: newMonth,
          },
        },
      ]);
      return res.json({ data: { costAmountList, incomeAmountList } });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 年結餘
router.get("/api/yearly/net", async (req, res) => {
  try {
    const cookies = req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const year = req.query.year.slice(0, -1);
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      const costAmountList = await costRecord.aggregate([
        {
          $match: { memberId: mongoose.Types.ObjectId(memberId), year: year },
        },
      ]);
      const incomeAmountList = await incomeRecord.aggregate([
        {
          $match: { memberId: mongoose.Types.ObjectId(memberId), year: year },
        },
      ]);
      return res.json({ data: { costAmountList, incomeAmountList } });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

module.exports = router;