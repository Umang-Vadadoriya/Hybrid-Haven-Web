import { loadLogin, parseTokenFromUrl, getTokenFromCode } from "./login.js";
import { API_RUN, WEB_RUN } from "./URLCollection.js";
import {toggleButton,openNav,closeNav} from "./common.js";
import {indexPage} from "./homepage.js";
import {deskBookigPage} from "./deskBook.js";
import {loadEventsPage} from "./eventspage.js";
import {openProfileModal} from "./modal.js";


var HostURL = WEB_RUN;

async function RedirectAsPerLogIn() {
  const code = await parseTokenFromUrl();

  if (code && !localStorage.getItem("token")) {
    console.log("Code", code);
    const token = await getTokenFromCode(code);
    console.log("Token", token);
    if (!token.includes("error")) {
      localStorage.setItem("token", token);
    }
    window.location.href = HostURL;
  } else if (!localStorage.getItem("token")) {
    loadLogin();
  }
}



document.addEventListener("DOMContentLoaded", function () {
  const homeOption = document.getElementById("home");
  const deskbookingOption = document.getElementById("deskbooking");
  const eventsOption = document.getElementById("events");
  const username = document.getElementById("userName");
  const toggle = document.getElementById("toggle-button");
  const sidebarClose = document.getElementById("side-close");
  const sidebarHome = document.getElementById("home-side");
  const sidebarDesk = document.getElementById("deskbooking-side");
  const sidebarevents = document.getElementById("events-side");

  RedirectAsPerLogIn();
  indexPage();

  window.addEventListener("resize", function () {
    toggleButton();
  });

  toggle.addEventListener("click", function () {
    openNav();
  });

  sidebarClose.addEventListener("click",function(){
    closeNav();
  })


  username.addEventListener("click", function () {
    openProfileModal();
  });

  homeOption.addEventListener("click", function () {
    indexPage();
  });

  deskbookingOption.addEventListener("click", function () {
    deskBookigPage();
  });

  eventsOption.addEventListener("click", function () {
    loadEventsPage();
  });

  sidebarHome.addEventListener("click",function(){
    indexPage();
  })
  sidebarDesk.addEventListener("click",function(){
    deskBookigPage();
  })
  sidebarevents.addEventListener("click",function(){
    loadEventsPage();
  })
});


