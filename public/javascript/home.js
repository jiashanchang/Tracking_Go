const notLogin = document.querySelector(".notLogin");
const isLogin = document.querySelector(".isLogin");

// 檢查會員登入狀態
async function isMember() {
  let response = await fetch("/api/member", {
    method: "GET",
  });
  let member = await response.json();
  if (member.data) {
    notLogin.style.display = "none";
    isLogin.style.display = "block";
  } else {
    isLogin.style.display = "none";
    notLogin.style.display = "block";
  }
}

isMember();

// 登出流程
const signout = document.querySelector(".signout");
signout.addEventListener("click", () => {
  fetch("/api/member/signout", {
    method: "GET",
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (memberLogout) {
      if (memberLogout.ok) {
        window.location.reload();
      }
    });
});