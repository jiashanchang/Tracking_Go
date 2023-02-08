// 檢查會員登入狀態
async function checkMember() {
  let response = await fetch("/api/member", {
    method: "GET",
  });
  let member = await response.json();
  if (!member.data) {
    window.location.href = "/";
  }
}

checkMember();

// 登出流程
const signout = document.getElementById("signout");
signout.addEventListener("click", () => {
  fetch("/api/auth/signout", {
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

// 漢堡選單
const sidebar = document.querySelector(".sidebar");
const sidenav_trigger = document.querySelector(".sidenav-trigger");
sidenav_trigger.addEventListener("click", (event) => {
  sidebar.style.display = "block";
  event.stopPropagation();
});

document.onclick = function () {
  sidebar.style.display = "none";
};