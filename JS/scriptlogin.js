import { loadLogin} from "./login.js";

export function loadLoginPage() {
  const body = document.getElementById("main-container");
  const mainContainer = document.createElement("main");
  mainContainer.classList.add("login-container");
  mainContainer.id = "main-container";

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("login-content");

  const welcomeMessage = document.createElement("h1");
  welcomeMessage.classList.add = "loginh1"
  welcomeMessage.textContent = "Welcome to HybridHaven!";

  const signInButton = document.createElement("button");
  signInButton.classList.add("signbtn");
  signInButton.id = "signInButton";
  signInButton.textContent = "SignIn with GitHub";
  signInButton.addEventListener("click", function () {
    startCountdown(); 
  });

  const countdownDiv = document.createElement("div");
  countdownDiv.id = "countdown";
  countdownDiv.className = "countdown";
  
  contentDiv.appendChild(welcomeMessage);
  contentDiv.appendChild(signInButton);
  contentDiv.appendChild(countdownDiv);
  mainContainer.appendChild(contentDiv);

  
  document.body.replaceChild(mainContainer,body);
}

function startCountdown() {
  const countdownElement = document.getElementById("countdown");
  let countdown = 3;
  countdownElement.style.display = "block";
  const interval = setInterval(() => {
    countdownElement.textContent = `Redirecting in ${countdown}...`;
    if (countdown === 0) {
      clearInterval(interval);
      loadLogin();
    }
    countdown--;
  }, 1000);
}

