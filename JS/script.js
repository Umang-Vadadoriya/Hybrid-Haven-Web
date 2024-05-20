import {  parseTokenFromUrl, getTokenFromCode } from "./login.js";
import {  WEB_RUN } from "./URLCollection.js";
import {employeeByEmail, toggleButton} from "./common.js";
import {indexPage} from "./homepage.js";
import {loadLoginPage} from './scriptlogin.js';


document.addEventListener("DOMContentLoaded", async function () {
  
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
    await indexPage();
  }
  
  window.addEventListener("resize", function () {
    toggleButton();
  });

  // employeeByEmail(localStorage.getItem("userEmail"));
});



