import { loadLogin, parseTokenFromUrl, getTokenFromCode } from "./login.js";
import { API_RUN, WEB_RUN } from "./URLCollection.js";
import {indexPage,pageStructure} from "./homepage.js";


var HostURL = WEB_RUN;

// async function RedirectAsPerLogIn() {
//   const code = await parseTokenFromUrl();

//   if (code && !localStorage.getItem("token")) {
//     console.log("Code", code);
//     const token = await getTokenFromCode(code);
//     console.log("Token", token);
//     if (!token.includes("error")) {
//       localStorage.setItem("token", token);
//     }
//     // window.location.href = HostURL;
//     indexPage();
//   } else if (!localStorage.getItem("token")) {
//     loadLogin();
//   }
// }




export function loadLoginPage() {
  const body = document.getElementById("main-container");
  const mainContainer = document.createElement("main");
  mainContainer.classList.add("login-container");
  mainContainer.id = "main-container";

  // Create content div
  const contentDiv = document.createElement("div");
  contentDiv.classList.add("login-content");

  // Create and set h1 element
  const welcomeMessage = document.createElement("h1");
  welcomeMessage.classList.add = "loginh1"
  welcomeMessage.textContent = "Welcome to HybridHaven!";

  // Create and set button element
  const signInButton = document.createElement("button");
  signInButton.classList.add("signbtn");
  signInButton.id = "signInButton";
  signInButton.textContent = "SignIn with GitHub";
  signInButton.addEventListener("click", function () {
    // RedirectAsPerLogIn(); 
    console.log("ijuhjb");
    loadLogin();
    // pageStructure();
    // RedirectAsPerLogIn();
  });

  // Append elements
  contentDiv.appendChild(welcomeMessage);
  contentDiv.appendChild(signInButton);
  mainContainer.appendChild(contentDiv);

  // Append main container to body
  document.body.replaceChild(mainContainer,body);
}
