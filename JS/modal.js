// Model js

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

export function openModal(message) {
  var modelDiv = document.getElementById("model-inner");
  var oldchild = document.getElementById("old-child");

  const data = document.createElement("div");
  data.id = "old-child";
  data.textContent = message;
  modelDiv.replaceChild(data, oldchild);
  modal.style.display = "block";
}

span.onclick = function () {
  modal.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
};

// profile modal

var modalProfile = document.getElementById("profileModal");
var closeBtn = document.getElementsByClassName("profile-close")[0];

export function openProfileModal() {
  const username = document.getElementById("username-profile");
  username.innerText = localStorage.getItem("username");
  const useremail = document.getElementById("useremail-profile");
  useremail.textContent = localStorage.getItem("userEmail");
  modalProfile.style.display = "block";
}

closeBtn.onclick = function () {
  modalProfile.style.display = "none";
};

window.onclick = function (event) {
  if (event.target == modalProfile) {
    modalProfile.style.display = "none";
  }
};
