const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const costRecord = require("../models/costrecord");
const incomeRecord = require("../models/incomerecord");
const writeOffRecord = require("../models/writeoffrecord");
const taxRecord = require("../models/taxrecord");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

router.use(bodyParser.json());

router.get("/", (req, res) => {
  res.render("financialstatement");
});

router.get("/api/year/financialstatement", async (req, res) => {
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
      const costList = await costRecord.aggregate([
        {
          $match: {
            memberId: mongoose.Types.ObjectId(memberId),
            year: year,
          },
        },
        {
          $lookup: {
            from: "costcategories",
            as: "costCategory",
            localField: "_id",
            foreignField: "recordId",
          },
        },
        {
          $lookup: {
            from: "assetliabilitycategories",
            as: "assetOrLiability",
            localField: "_id",
            foreignField: "costRecordId",
          },
        },
        {
          $facet: {
            costCount: [{ $count: "total" }],
            costTotalAmount: [
              { $group: { _id: null, amount: { $sum: "$amount" } } },
            ],
            costEachData: [
              {
                $group: {
                  _id: { category: "$costCategory" },
                  amount: { $sum: "$amount" },
                },
              },
            ],
            assetOrLiability: [
              {
                $group: {
                  _id: { category: "$assetOrLiability" },
                  amount: { $sum: "$amount" },
                },
              },
            ],
          },
        },
      ]);

      const incomeList = await incomeRecord.aggregate([
        {
          $match: {
            memberId: mongoose.Types.ObjectId(memberId),
            year: year,
          },
        },
        {
          $lookup: {
            from: "incomecategories",
            as: "incomeCategory",
            localField: "_id",
            foreignField: "recordId",
          },
        },
        {
          $lookup: {
            from: "assetliabilitycategories",
            as: "assetOrLiability",
            localField: "_id",
            foreignField: "incomeRecordId",
          },
        },
        {
          $facet: {
            incomeCount: [{ $count: "total" }],
            incomeTotalAmount: [
              { $group: { _id: null, amount: { $sum: "$amount" } } },
            ],
            incomeEachData: [
              {
                $group: {
                  _id: { category: "$incomeCategory" },
                  amount: { $sum: "$amount" },
                },
              },
            ],
            assetOrLiability: [
              {
                $group: {
                  _id: { category: "$assetOrLiability" },
                  amount: { $sum: "$amount" },
                },
              },
            ],
          },
        },
      ]);

      const writeOffList = await writeOffRecord
        .find({ memberId: memberId, year: year })
        .populate("payId")
        .populate("receiveId")
        .lean()
        .sort({ createdAt: -1 });

      const incomeTaxList = await taxRecord
        .find({ memberId: memberId, year: year })
        .populate("taxPayId")
        .lean()
        .sort({ createdAt: -1 });

      return res.json({ costList, incomeList, writeOffList, incomeTaxList });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

module.exports = router;