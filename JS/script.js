import { loadLogin, parseTokenFromUrl, getTokenFromCode } from "./login.js";
import { API_RUN, WEB_RUN } from "./URLCollection.js";
import {toggleButton,openNav,closeNav} from "./common.js";
import {indexPage} from "./homepage.js";
import {deskBookigPage} from "./deskBook.js";
import {loadEventsPage} from "./eventspage.js";
import {openProfileModal} from "./modal.js";
import {loadLoginPage} from './scriptlogin.js';

document.addEventListener("DOMContentLoaded", async function () {
  const homeOption = document.getElementById("home");
  const deskbookingOption = document.getElementById("deskbooking");
  const eventsOption = document.getElementById("events");
  const username = document.getElementById("userName");
  const toggle = document.getElementById("toggle-button");
  const sidebarClose = document.getElementById("side-close");
  const sidebarHome = document.getElementById("home-side");
  const sidebarDesk = document.getElementById("deskbooking-side");
  const sidebarevents = document.getElementById("events-side");
  
  loadLoginPage();
  var access_code = await parseTokenFromUrl();
  console.log(access_code);
  if(access_code && !localStorage.getItem("access_token")){
     var access_token = await getTokenFromCode(access_code);

    if (!access_token.includes("error")) {
      localStorage.setItem("access_token", access_token);
      window.location.href = WEB_RUN;
    }
    else{
      console.log("Error Token: ", access_token);
    }
  }
  if(!access_code && localStorage.getItem('access_token')){
    indexPage();
  }
  // RedirectAsPerLogIn();
  // indexPage();

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


