const loginForm = document.getElementById("loginForm");

// 檢查會員登入狀態
async function isMember() {
  let response = await fetch("/api/member", {
    method: "GET",
  });
  let member = await response.json();
  if (member.data) {
    window.location.href = "/property";
  } else {
    loginForm.style.display = "block";
  }
};

isMember();

const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");

const loginEmailMessage = document.querySelector(".loginEmailMessage");
const loginPasswordMessage = document.querySelector(".loginPasswordMessage");
const loginBottomMessage = document.querySelector(".loginBottomMessage");

let emailRule = /^\w+((-\w+)|(\.\w+))*\@[A-Za-z0-9]+((\.|-)[A-Za-z0-9]+)*\.[A-Za-z]+$/;
let passwordRule = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;

let checkEmailInputValue;
let checkPasswordInputValue;

// 驗證會員登入所輸入之資料
loginEmail.addEventListener("input", () => {
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
});

loginPassword.addEventListener("input", () => {
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
});

// 登入流程
const login = document.getElementById("login");
login.addEventListener("click", () => {
  if (!checkEmailInputValue || !checkPasswordInputValue) {
    loginBottomMessage.style.display = "flex";
    loginBottomMessage.style.color = "red";
    loginBottomMessage.textContent = "⚠ 請填寫正確資料";
    setTimeout(function () {
      loginBottomMessage.style.display = "none";
    }, 2000);
    return;
  }
  fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: loginEmail.value,
      password: loginPassword.value,
    }),
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (memberLogin) {
      if (memberLogin.ok) {
        setTimeout(function () {
          location.reload();
        }, 2000);
      }
    });
});