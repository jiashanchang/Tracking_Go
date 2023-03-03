const loginForm = document.getElementById("loginForm");

// 檢查會員登入狀態
async function isMember() {
  let response = await fetch("/api/member", {
    method: "GET",
  });
  let member = await response.json();
  if (member.data) {
    window.location.href = "/";
  } else {
    loginForm.style.display = "block";
  }
};

isMember();

const DELAY = 500;

let loginEmailTimer;
let loginPasswordTimer;

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const loginEmailMessage = document.querySelector(".loginEmailMessage");
const loginPasswordMessage = document.querySelector(".loginPasswordMessage");
const loginBottomMessage = document.querySelector(".loginBottomMessage");

let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
let passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

let checkEmailInputValue;
let checkPasswordInputValue;

loginEmail.addEventListener("focus", () => {
  loginEmailMessage.style.display = "none";
});

loginPassword.addEventListener("focus", () => {
  loginPasswordMessage.style.display = "none";
});

// 驗證會員登入所輸入之資料
loginEmail.addEventListener("input", () => {
  clearTimeout(loginEmailTimer);
  loginEmailTimer = setTimeout(() => {
    if (loginEmail.value == "") {
      loginEmailMessage.style.display = "block";
      loginEmailMessage.textContent = "⚠ 請輸入信箱";
      checkEmailInputValue = false;
    } else if (!emailRule.test(loginEmail.value)) {
      loginEmailMessage.style.display = "block";
      loginEmailMessage.textContent = "⚠ 電子信箱格式錯誤";
      checkEmailInputValue = false;
    } else {
      loginEmailMessage.style.display = "none";
      checkEmailInputValue = true;
    }
  }, DELAY);
});

loginPassword.addEventListener("input", () => {
  clearTimeout(loginPasswordTimer);
  loginPasswordTimer = setTimeout(() => {
    if (loginPassword.value == "") {
      loginPasswordMessage.style.display = "block";
      loginPasswordMessage.textContent = "⚠ 請輸入密碼";
      checkPasswordInputValue = false;
    } else if (!passwordRule.test(loginPassword.value)) {
      loginPasswordMessage.style.display = "block";
      loginPasswordMessage.textContent = "⚠ 至少須 8 字元且包含一個字母及一個數字";
      checkPasswordInputValue = false;
    } else {
      loginPasswordMessage.style.display = "none";
      checkPasswordInputValue = true;
    }
  }, DELAY);
});

// 登入流程
const login = document.getElementById("login");

async function memberLogin() {
  if (!checkEmailInputValue || !checkPasswordInputValue) {
    loginBottomMessage.style.display = "flex";
    loginBottomMessage.style.color = "red";
    loginBottomMessage.textContent = "⚠ 請填寫正確資料";
    setTimeout(function () {
      loginBottomMessage.style.display = "none";
    }, 2000);
    return;
  }
  let fetchAPI = await fetch("/api/member/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value,
    }),
  })
  let memberIsLogin = await fetchAPI.json();
  if (memberIsLogin.ok) {
    location.reload();
  } else {
    loginBottomMessage.style.display = "flex";
    loginBottomMessage.style.color = "red";
    loginBottomMessage.textContent = `${memberIsLogin.message}`;
    setTimeout(function () {
      loginBottomMessage.style.display = "none";
    }, 2000);
  }
};

login.addEventListener("click", memberLogin);