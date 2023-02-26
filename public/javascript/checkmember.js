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

const logout = document.getElementById("logout");
logout.addEventListener("click", () => {
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

// 漢堡選單
const openMenu = document.querySelector(".open-menu");
const sidenav_trigger = document.querySelector(".sidenav-trigger");
window.addEventListener("click", function (event) {
  if (event.target === sidenav_trigger) {
    openMenu.style.display = "flex";
  } else if (event.target === openMenu) {
    openMenu.style.display = "flex";
  } else {
    openMenu.style.display = "none";
  }
});