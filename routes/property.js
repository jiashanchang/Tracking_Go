const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");
const costCategory = require("../models/costcategory");
const costRecord = require("../models/costrecord");
const incomeCategory = require("../models/incomecategory");
const incomeRecord = require("../models/incomerecord");
const assetLiabilityCategory = require("../models/assetliabilitycategory");
const writeOffRecord = require("../models/writeoffrecord");
const taxRecord = require("../models/taxrecord");
const dotenv = require("dotenv");

dotenv.config();

router.use(bodyParser.json());

router.get("/property", (req, res) => {
  res.render("property");
});

router.get("/property/records/addcost", (req, res) => {
  res.render("records/addcost");
});

router.get("/property/records/addincome", (req, res) => {
  res.render("records/addincome");
});

router.get("/property/records/addwriteoff", (req, res) => {
  res.render("records/addwriteoff");
});

router.get("/property/records/addincometax", (req, res) => {
  res.render("records/addincometax");
});

// 取得支出紀錄
router.get("/api/cost_records", async (req, res) => {
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
    if (checkJWT) {
      const records = await costRecord
        .find({ memberId: memberId })
        .populate("categoryId")
        .populate("payId")
        .lean()
        .sort({ createdAt: -1 });
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得收入紀錄
router.get("/api/income_records", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      const records = await incomeRecord
        .find({ memberId: memberId })
        .populate("categoryId")
        .populate("receiveId")
        .lean()
        .sort({ createdAt: -1 });
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得沖帳紀錄
router.get("/api/writeoff_records", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      const records = await writeOffRecord
        .find({ memberId: memberId })
        .populate("payId")
        .populate("receiveId")
        .lean()
        .sort({ createdAt: -1 });
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得所得稅紀錄
router.get("/api/tax_records", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const memberId = checkJWT.id;
    if (checkJWT) {
      const records = await taxRecord
        .find({ memberId: memberId })
        .populate("taxPayId")
        .lean()
        .sort({ createdAt: -1 });
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 新增支出紀錄
router.post("/api/cost_records", async (req, res) => {
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

    const payCategoriesData = await assetLiabilityCategory.find();
    const payCategoriesId = [];
    payCategoriesData.forEach((category) => {
      payCategoriesId.push(category._id);
    });

    for (let i = 0; i < categoriesData.length; i++) {
      for (let j = 0; j < payCategoriesData.length; j++) {
        if (
          categoriesData[i].category === req.body.costCategory &&
          payCategoriesData[j].category === req.body.costPay
        ) {
          if (req.body.costAmount != "") {
            await costRecord
              .create({
                memberId: checkJWT.id,
                categoryId: categoriesId[i],
                payId: payCategoriesId[j],
                createdAt: req.body.costDate,
                year: req.body.costDate.slice(0, -6),
                month: req.body.costDate.slice(5, -3),
                amount: req.body.costAmount,
                remark: req.body.costRemark,
              })
              .then((record) => {
                costCategory.findById(categoriesId[i])
                  .then((category) => {
                    category.recordId.push(record._id);
                    category.save();
                  });
                assetLiabilityCategory.findById(payCategoriesId[j])
                  .then((category) => {
                    category.costRecordId.push(record._id);
                    category.save();
                  });
              });
            return res.json({ ok: true });
          } else {
            return res.json({ error: true, message: "請填寫金額" });
          }
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
router.post("/api/income_records", async (req, res) => {
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

    const receiveCategoriesData = await assetLiabilityCategory.find();
    const receiveCategoriesId = [];
    receiveCategoriesData.forEach((category) => {
      receiveCategoriesId.push(category._id);
    });

    for (let i = 0; i < categoriesData.length; i++) {
      for (let j = 0; j < receiveCategoriesData.length; j++) {
        if (
          categoriesData[i].category === req.body.incomeCategory &&
          receiveCategoriesData[j].category === req.body.incomeReceive
        ) {
          if (req.body.incomeAmount != "") {
            await incomeRecord
              .create({
                memberId: checkJWT.id,
                categoryId: categoriesId[i],
                receiveId: receiveCategoriesId[j],
                createdAt: req.body.incomeDate,
                year: req.body.incomeDate.slice(0, -6),
                month: req.body.incomeDate.slice(5, -3),
                amount: req.body.incomeAmount,
                remark: req.body.incomeRemark,
              })
              .then((record) => {
                incomeCategory.findById(categoriesId[i])
                  .then((category) => {
                    category.recordId.push(record._id);
                    category.save();
                  });
                assetLiabilityCategory.findById(receiveCategoriesId[j])
                  .then((category) => {
                    category.incomeRecordId.push(record._id);
                    category.save();
                  });
              });
            return res.json({ ok: true });
          } else {
            return res.json({ error: true, message: "請填寫金額" });
          }
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

// 新增沖帳紀錄
router.post("/api/writeoff_records", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const assetLiabilityData = await assetLiabilityCategory.find();
    const assetLiabilityId = [];
    assetLiabilityData.forEach((category) => {
      assetLiabilityId.push(category._id);
    });

    for (let i = 0; i < assetLiabilityData.length; i++) {
      for (let j = 0; j < assetLiabilityData.length; j++) {
        if (
          assetLiabilityData[i].category === req.body.debitCategory &&
          assetLiabilityData[j].category === req.body.creditCategory
        ) {
          if (req.body.writeOffAmount != "") {
            await writeOffRecord
              .create({
                memberId: checkJWT.id,
                payId: assetLiabilityId[i],
                receiveId: assetLiabilityId[j],
                createdAt: req.body.writeOffDate,
                year: req.body.writeOffDate.slice(0, -6),
                month: req.body.writeOffDate.slice(5, -3),
                amount: req.body.writeOffAmount,
                remark: req.body.writeOffRemark,
              })
              .then((record) => {
                assetLiabilityCategory
                  .findById(assetLiabilityId[i])
                  .then((category) => {
                    category.writeOffRecordId.push(record._id);
                    category.save();
                  });
                assetLiabilityCategory
                  .findById(assetLiabilityId[j])
                  .then((category) => {
                    category.writeOffRecordId.push(record._id);
                    category.save();
                  });
              });
            return res.json({ ok: true });
          } else {
            return res.json({ error: true, message: "請填寫金額" });
          }
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

// 新增所得稅紀錄
router.post("/api/tax_records", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({
        error: true,
        message: "未登入系統，拒絕存取",
      });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    const assetLiabilityData = await assetLiabilityCategory.find();
    const assetLiabilityId = [];
    assetLiabilityData.forEach((category) => {
      assetLiabilityId.push(category._id);
    });
    for (let i = 0; i < assetLiabilityData.length; i++) {
      if (assetLiabilityData[i].category === req.body.taxPay) {
        if (req.body.taxAmount != "") {
          await taxRecord.create({
            memberId: checkJWT.id,
            incomeTax: req.body.incomeTax,
            taxPayId: assetLiabilityId[i],
            createdAt: req.body.taxDate,
            year: req.body.taxDate.slice(0, -6),
            month: req.body.taxDate.slice(5, -3),
            amount: req.body.taxAmount,
            remark: req.body.taxRemark,
          })
          .then((record) => {
            assetLiabilityCategory
              .findById(assetLiabilityId[i])
              .then((category) => {
                category.taxRecordId.push(record._id);
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
router.get("/api/cost_records/:id", async (req, res) => {
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
      const records = await costRecord
        .findOne({ _id: req.params.id })
        .populate("categoryId")
        .populate("payId")
        .lean();
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得收入id
router.get("/api/income_records/:id", async (req, res) => {
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
      const records = await incomeRecord
        .findOne({ _id: req.params.id })
        .populate("categoryId")
        .populate("receiveId")
        .lean();
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得沖帳id
router.get("/api/writeoff_records/:id", async (req, res) => {
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
      const records = await writeOffRecord
        .findOne({ _id: req.params.id })
        .populate("payId")
        .populate("receiveId")
        .lean();
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 取得所得稅id
router.get("/api/tax_records/:id", async (req, res) => {
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
      const records = await taxRecord
        .findOne({ _id: req.params.id })
        .populate("taxPayId")
        .lean();
      return res.json({ data: records });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 網頁支出紀錄id
router.get("/property/editcost/:id", async (req, res) => {
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

// 網頁收入紀錄id
router.get("/property/editincome/:id", async (req, res) => {
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

// 網頁沖帳紀錄id
router.get("/property/editwriteoff/:id", async (req, res) => {
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
      const writeOffRecords = await writeOffRecord
        .findOne({
          _id: req.params.id,
        })
        .lean();
      res.render("records/editwriteOff", {
        writeOffRecords,
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 網頁所得稅紀錄id
router.get("/property/editincometax/:id", async (req, res) => {
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
      const taxRecords = await taxRecord
        .findOne({
          _id: req.params.id,
        })
        .lean();
      res.render("records/editincometax", {
        taxRecords,
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
router.put("/api/cost_records/:id", async (req, res) => {
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
        costCategory.findById(record.categoryId).then((category) => {
          category.recordId = category.recordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
        assetLiabilityCategory.findById(record.payId).then((category) => {
          category.costRecordId = category.costRecordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
      });
      const categoryId = await costCategory.findOne({category: update.costCategory});
      const payId = await assetLiabilityCategory.findOne({category: update.costPay});
      await costRecord.findOneAndUpdate(
        { _id: req.params.id },
        {
          categoryId: categoryId._id,
          payId: payId._id,
          createdAt: update.costDate,
          year: update.costDate.slice(0, -6),
          month: update.costDate.slice(5, -3),
          amount: update.costAmount,
          remark: update.costRemark,
        },
        { new: true }
      );
      categoryId.recordId.push(req.params.id);
      categoryId.save();
      payId.costRecordId.push(req.params.id);
      payId.save();
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
router.put("/api/income_records/:id", async (req, res) => {
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
      await incomeRecord.findById(id).then((record) => {
        incomeCategory.findById(record.categoryId).then((category) => {
          category.recordId = category.recordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
        assetLiabilityCategory.findById(record.receiveId).then((category) => {
          category.incomeRecordId = category.incomeRecordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
      });
      const categoryId = await incomeCategory.findOne({category: update.incomeCategory});
      const receiveId = await assetLiabilityCategory.findOne({category: update.incomeReceive});
      await incomeRecord.findOneAndUpdate(
        { _id: req.params.id },
        {
          categoryId: categoryId,
          receiveId: receiveId,
          createdAt: update.incomeDate,
          year: update.incomeDate.slice(0, -6),
          month: update.incomeDate.slice(5, -3),
          amount: update.incomeAmount,
          remark: update.incomeRemark,
        },
        { new: true }
      );
      categoryId.recordId.push(req.params.id);
      categoryId.save();
      receiveId.incomeRecordId.push(req.params.id);
      receiveId.save();
      return res.json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 更新沖帳紀錄
router.put("/api/writeoff_records/:id", async (req, res) => {
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
      await writeOffRecord.findById(id).then((record) => {
        assetLiabilityCategory.findById(record.payId).then((category) => {
          category.writeOffRecordId = category.writeOffRecordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
        assetLiabilityCategory.findById(record.receiveId).then((category) => {
          category.writeOffRecordId = category.writeOffRecordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
      });
      const payId = await assetLiabilityCategory.findOne({category: update.debitCategory});
      const receiveId = await assetLiabilityCategory.findOne({category: update.creditCategory});
      await writeOffRecord.findOneAndUpdate(
        { _id: req.params.id },
        {
          payId: payId,
          receiveId: receiveId,
          createdAt: update.writeOffDate,
          year: update.writeOffDate.slice(0, -6),
          month: update.writeOffDate.slice(5, -3),
          amount: update.writeOffAmount,
          remark: update.writeOffRemark,
        },
        { new: true }
      );
      payId.writeOffRecordId.push(req.params.id);
      payId.save();
      receiveId.writeOffRecordId.push(req.params.id);
      receiveId.save();
      return res.json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 更新所得稅紀錄
router.put("/api/tax_records/:id", async (req, res) => {
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
      await taxRecord.findById(id).then((record) => {
        assetLiabilityCategory.findById(record.taxPayId).then((category) => {
          category.taxRecordId = category.taxRecordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
      });
      const taxPayId = await assetLiabilityCategory.findOne({category: update.taxPay});
      await taxRecord.findOneAndUpdate(
        { _id: req.params.id },
        {
          incomeTax: update.incomeTax,
          taxPayId: taxPayId,
          createdAt: update.taxDate,
          year: update.taxDate.slice(0, -6),
          month: update.taxDate.slice(5, -3),
          amount: update.taxAmount,
          remark: update.taxRemark,
        },
        { new: true }
      );
      taxPayId.taxRecordId.push(req.params.id);
      taxPayId.save();
      return res.json({ ok: true });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 刪除支出
router.delete("/api/cost_records/:id", async (req, res) => {
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
      await costRecord.findById(id).then((record) => {
        costCategory.findById(record.categoryId).then((category) => {
          category.recordId = category.recordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
        assetLiabilityCategory
          .findById(record.payId)
          .then((category) => {
            category.costRecordId = category.costRecordId.filter(
              (record) => record.toString() !== id
            );
            category.save();
          })
        record.remove();
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

// 刪除收入
router.delete("/api/income_records/:id", async (req, res) => {
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
      await incomeRecord.findById(id).then((record) => {
        incomeCategory.findById(record.categoryId).then((category) => {
          category.recordId = category.recordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
        assetLiabilityCategory
          .findById(record.receiveId)
          .then((category) => {
            category.incomeRecordId = category.incomeRecordId.filter(
              (record) => record.toString() !== id
            );
            category.save();
          })
        record.remove();
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

// 刪除沖帳
router.delete("/api/writeoff_records/:id", async (req, res) => {
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
      await writeOffRecord.findById(id).then((record) => {
        assetLiabilityCategory.findById(record.payId).then((category) => {
          category.writeOffRecordId = category.writeOffRecordId.filter(
            (record) => record.toString() !== id
          );
          category.save();
        });
        assetLiabilityCategory
          .findById(record.receiveId)
          .then((category) => {
            category.writeOffRecordId = category.writeOffRecordId.filter(
              (record) => record.toString() !== id
            );
            category.save();
          })
        record.remove();
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

// 刪除所得稅
router.delete("/api/tax_records/:id", async (req, res) => {
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
      await taxRecord.findById(id).then((record) => {
        assetLiabilityCategory
          .findById(record.taxPayId)
          .then((category) => {
            category.taxRecordId = category.taxRecordId.filter(
              (record) => record.toString() !== id
            );
            category.save();
          })
        record.remove();
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

module.exports = router;