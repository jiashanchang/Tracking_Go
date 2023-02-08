const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const Member = require("../models/member");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

router.use(bodyParser.json());
router.use(cookieParser());

router.get("/", (req, res) => {
  res.render("home", {
    layout: "home",
  });
});

router.get("/signup", (req, res) => {
  res.render("signup", {
    layout: "signup",
  });
});

router.get("/signin", (req, res) => {
  res.render("signin", {
    layout: "signin",
  });
});

// 取得會員資料
router.get("/api/member", async (req, res) => {
  try {
    const cookies = await req.cookies.token;
    if (!cookies) {
      return res.json({ data: null });
    }
    const checkJWT = jwt.verify(cookies, process.env.JWT_SECRET);
    req.id = checkJWT.id;
    req.name = checkJWT.name;
    req.email = checkJWT.email;
    return res.json({
      data: {
        id: req.id,
        name: req.name,
        email: req.email,
      },
    });
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 登入
router.post("/api/auth/signin", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Member.findOne({ email }).lean();
    if (!user) {
      return res.json({
        error: true,
        message: "無此帳號，請重新輸入",
      });
    } else if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN },
        { algorithms: "HS256" }
      );
      res.cookie("token", token, {
        maxAge: process.env.JWT_EXPIRES_IN,
        httpOnly: true,
      });
      return res.json({ ok: true });
    } else {
      return res.json({
        error: true,
        message: "信箱或密碼有誤",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 註冊
router.post("/api/auth/signup", async (req, res) => {
  try {
    let nameRule = /^[\u4e00-\u9fa5_a-zA-Z0-9_]{5,8}$/;
    let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
    let passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    let { name, email, password } = req.body;
    const user = await Member.findOne({ email }).lean();
    if (name == "" || email == "" || password == "") {
      return res.json({
        error: true,
        message: "請輸入姓名、信箱或密碼",
      });
    } else if (!nameRule.test(name)) {
      return res.json({
        error: true,
        message: "姓名格式錯誤",
      });
    } else if (!emailRule.test(email)) {
      return res.json({
        error: true,
        message: "電子信箱格式錯誤",
      });
    } else if (!passwordRule.test(password)) {
      return res.json({
        error: true,
        message: "密碼格式錯誤",
      });
    } else if (user) {
      return res.json({
        error: true,
        message: "已有此Email，請重新註冊",
      });
    } else {
      password = await bcrypt.hash(password, 10);
      const response = await Member.create({
        name,
        email,
        password,
      });
      return res.json({
        ok: true,
        message: "註冊成功，請登入系統",
      });
    }
  } catch (error) {
    return res.status(500).json({
      error: true,
      message: "伺服器內部錯誤",
    });
  }
});

// 登出
router.get("/api/auth/signout", (req, res) => {
  res.clearCookie("token");
  return res.json({ ok: true });
});

module.exports = router;