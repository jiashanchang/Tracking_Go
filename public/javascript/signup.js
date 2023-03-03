const registerForm = document.getElementById("registerForm");

// 檢查會員登入狀態
async function isMember() {
  let response = await fetch("/api/member", {
    method: "GET",
  });
  let member = await response.json();
  if (member.data) {
    window.location.href = "/";
  } else {
    registerForm.style.display = "block";
  }
};

isMember();

const DELAY = 500;

let registerNameTimer;
let registerEmailTimer;
let registerPasswordTimer;

const registerName = document.getElementById("registerName");
const registerEmail = document.getElementById("registerEmail");
const registerPassword = document.getElementById("registerPassword");

const registerNameMessage = document.querySelector(".registerNameMessage");
const registerEmailMessage = document.querySelector(".registerEmailMessage");
const registerPasswordMessage = document.querySelector(".registerPasswordMessage");
const registerBottomMessage = document.querySelector(".registerBottomMessage");

let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
let passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

let checkEmailInputValue;
let checkPasswordInputValue;
let checkNameInputValue;

registerName.addEventListener("focus", () => {
  registerNameMessage.style.display = "none";
});

registerEmail.addEventListener("focus", () => {
  registerEmailMessage.style.display = "none";
});

registerPassword.addEventListener("focus", () => {
  registerPasswordMessage.style.display = "none";
});

// 驗證會員註冊所輸入之資料
registerName.addEventListener("input", () => {
  clearTimeout(registerNameTimer);
  registerNameTimer = setTimeout(() => {
    if (registerName.value == "") {
      registerNameMessage.style.display = "block";
      registerNameMessage.textContent = "⚠ 請輸入姓名";
      checkNameInputValue = false;
    } else {
      registerNameMessage.style.display = "none";
      checkNameInputValue = true;
    }
  }, DELAY);
});

registerEmail.addEventListener("input", () => {
  clearTimeout(registerEmailTimer);
  registerEmailTimer = setTimeout(() => {
    if (registerEmail.value == "") {
      registerEmailMessage.style.display = "block";
      registerEmailMessage.textContent = "⚠ 請輸入信箱";
      checkEmailInputValue = false;
    } else if (!emailRule.test(registerEmail.value)) {
      registerEmailMessage.style.display = "block";
      registerEmailMessage.textContent = "⚠ 電子信箱格式錯誤";
      checkEmailInputValue = false;
    } else {
      registerEmailMessage.style.display = "none";
      checkEmailInputValue = true;
    }
  }, DELAY);
});

registerPassword.addEventListener("input", () => {
  clearTimeout(registerPasswordTimer);
  registerPasswordTimer = setTimeout(() => {
    if (registerPassword.value == "") {
      registerPasswordMessage.style.display = "block";
      registerPasswordMessage.textContent = "⚠ 請輸入密碼";
      checkPasswordInputValue = false;
    } else if (!passwordRule.test(registerPassword.value)) {
      registerPasswordMessage.style.display = "block";
      registerPasswordMessage.textContent = "⚠ 至少須 8 字元且包含一個字母及一個數字";
      checkPasswordInputValue = false;
    } else {
      registerPasswordMessage.style.display = "none";
      checkPasswordInputValue = true;
    }
  }, DELAY);
});

// 註冊流程
const register = document.getElementById("register");

async function memberRegister() {
  if (!checkNameInputValue || !checkEmailInputValue || !checkPasswordInputValue) {
    registerBottomMessage.style.display = "flex";
    registerBottomMessage.style.color = "red";
    registerBottomMessage.textContent = "⚠ 請填寫正確資料";
    setTimeout(function () {
      registerBottomMessage.style.display = "none";
    }, 2000);
    return;
  }
  let fetchAPI = await fetch("/api/member/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: registerName.value,
      email: registerEmail.value,
      password: registerPassword.value,
    }),
  })
  let memberIsRegister = await fetchAPI.json();
  if (memberIsRegister.ok) {
    registerBottomMessage.style.display = "flex";
    registerBottomMessage.style.color = "#8ce600";
    registerBottomMessage.textContent = `${memberIsRegister.message}`;
    setTimeout(function () {
      registerBottomMessage.style.display = "none";
    }, 2000);
  } else {
    registerBottomMessage.style.display = "flex";
    registerBottomMessage.style.color = "red";
    registerBottomMessage.textContent = `${memberIsRegister.message}`;
    setTimeout(function () {
      registerBottomMessage.style.display = "none";
    }, 2000);
  }
};

register.addEventListener("click", memberRegister);