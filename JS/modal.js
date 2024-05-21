// Model js

import { closeNav, logout } from "./common.js";
import { deskBookigPage } from "./deskBook.js";
import { loadEventsPage } from "./eventspage.js";
import { createRightpanel, indexPage } from "./homepage.js";
import { loadVacationPage } from "./vacation.js";

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


export function openProfileModal() {
  var modalProfile = document.getElementById("profileModal");
  const username = document.getElementById("username-profile");
  username.innerText = localStorage.getItem("username");
  const useremail = document.getElementById("useremail-profile");
  useremail.textContent = localStorage.getItem("userEmail");
  modalProfile.style.display = "block";
  window.onclick = function (event) {
    if (event.target == modalProfile) {
      modalProfile.style.display = "none";
    }
  };
}

// sidebar

export function createSidebar(){
  const sidenav = document.createElement("div");
  sidenav.id = "mySidenav";
  sidenav.classList.add("sidenav");

  const closeButton = document.createElement("button");
  closeButton.classList.add("closebtn");
  closeButton.id = "side-close";
  closeButton.innerHTML = "&times;";
  closeButton.addEventListener("click",function(){
    closeNav();
  })

  const topLeftDiv = document.createElement("div");
  topLeftDiv.classList.add("top-left");

  const userImg = document.createElement("img");
  userImg.classList.add("profile-img");
  userImg.id = "sidebar-img"
  userImg.alt = "User Image";

  const userName = document.createElement("h3");
  userName.classList.add = "username-profile";
  userName.id = "sidebar-uname";
  userName.addEventListener("click",function(){
    openProfileModal();
    closeNav();
  })

  topLeftDiv.appendChild(userImg);
  topLeftDiv.appendChild(userName);

  const leftContent = document.createElement("div");
  leftContent.classList.add("left-content");

  const ulElement = document.createElement("ul");

  const homeLi = document.createElement("li");
  homeLi.id = "home-side";
  homeLi.textContent = "Home";
  homeLi.addEventListener("click",function(){
    createRightpanel();
  })

  const deskBookingLi = document.createElement("li");
  deskBookingLi.id = "deskbooking-side";
  deskBookingLi.textContent = "Desk Booking";
  deskBookingLi.addEventListener("click",function(){
    deskBookigPage();
  })

  const eventsLi = document.createElement("li");
  eventsLi.id = "events-side";
  eventsLi.textContent = "Events";
  eventsLi.addEventListener("click",function(){
    loadEventsPage();
  })

  const vacationLi = document.createElement("li");
  vacationLi.id = "vacation-side";
  vacationLi.textContent = "Vacation";
  vacationLi.addEventListener("click",function(){
    loadVacationPage();
  })


  ulElement.appendChild(homeLi);
  ulElement.appendChild(deskBookingLi);
  ulElement.appendChild(eventsLi);
  ulElement.appendChild(vacationLi);

  leftContent.appendChild(ulElement);

  sidenav.appendChild(closeButton);
  sidenav.appendChild(topLeftDiv);
  sidenav.appendChild(leftContent);

  document.body.appendChild(sidenav);
}

// profileModal

export function createProfilemodel(){
const profileModal = document.createElement('div');
profileModal.id = 'profileModal';
profileModal.classList.add('profile-modal');

const profileModalContent = document.createElement('div');
profileModalContent.classList.add('profile-modal-content');

const profileClose = document.createElement('span');
profileClose.classList.add('profile-close');
profileClose.textContent = '×';
profileClose.addEventListener("click",function(){
  profileModal.style.display = "none";
})

const userImg = document.createElement('img');
userImg.classList.add('profile-img');
userImg.id = 'user-img1';
userImg.alt = 'User Image';

const usernameProfile = document.createElement('h3');
usernameProfile.id = 'username-profile';

const useremailProfile = document.createElement('h4');
useremailProfile.id = 'useremail-profile';  

const logoutbtn = document.createElement("button");
logoutbtn.id = "logout-button";
logoutbtn.textContent = "Logout"
logoutbtn.addEventListener("click",function(){
  logout();
})

profileModalContent.appendChild(profileClose);
profileModalContent.appendChild(userImg);
profileModalContent.appendChild(usernameProfile);
profileModalContent.appendChild(useremailProfile);
profileModalContent.appendChild(logoutbtn);

profileModal.appendChild(profileModalContent);

document.body.appendChild(profileModal);

}

// Employee Modal

export function createEmployeeModal() {
  
  const modal = document.createElement('div');
  modal.id = 'employeeModal';
  modal.classList.add('employee-modal');

  const modalContent = document.createElement('div');
  modalContent.classList.add('employee-modal-content');
  modalContent.id = "emp-model";

  const closeButton = document.createElement('span');
  closeButton.classList.add('employee-close');
  closeButton.innerHTML = '&times;';

  const header = document.createElement('h2');
  header.id = "view-heading"
  header.textContent = 'Employee Names';

  const employeeList = document.createElement('div');
  employeeList.id = "emplist";
  employeeList.classList.add('employee-list');

  modalContent.appendChild(closeButton);
  modalContent.appendChild(header);
  modalContent.appendChild(employeeList);

  modal.appendChild(modalContent);

  document.body.appendChild(modal);

  closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
  });


  window.addEventListener('click', function(event) {
    if (event.target === modal) {
      modal.style.display = 'none';
    }
  });

}