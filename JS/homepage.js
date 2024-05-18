import { API_RUN } from "./URLCollection.js";
import { GetAllEmployee, todayDate, fetchOptions, closeNav } from "./common.js";
import {deskBookigPage} from './deskBook.js';
import {loadEventsPage} from './eventspage.js';

var APIURL = API_RUN;

async function login() {
  let username;
  let useremail;
  let userDiv = document.getElementById("userName");
  let userimage = document.getElementById("user-img");
  let userimage1 = document.getElementById("user-img1");

  fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      username = data.name ? data.name : "Profile";
      useremail = data.email ? data.email : data.login;
      localStorage.setItem("username", username);
      localStorage.setItem("userEmail", useremail);
      userDiv.innerText = localStorage.getItem("username");
      userimage.src = data.avatar_url;
      userimage1.src = data.avatar_url;
    });

  let saved = false;
  if (localStorage.getItem("username")) {
    const Employees = await GetAllEmployee();
    Employees.map((emp) => {
      if (localStorage.getItem("username") === emp.employeeName) {
        saved = true;
      }
    });
  }
  if (!saved) {
    const requestBody = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeName: localStorage.getItem("username"),
        employeeReportsTo: 0,
      }),
    };

    // Send the POST request
    fetch(`${APIURL}employees`, requestBody)
      .then((response) => {
        if (!response.ok) {
          // openModal("Failed to add use");
          throw new Error("Failed to add user");
        }
        return response.json();
      })
      .then((data) => {
        // openModal("User Added successfully:");
        indexPage();
      })
      .catch((error) => {
        console.error("Error creating employee", error);
      });
  }
}

async function loadHomePage() {
  const officeContentDiv = document.getElementById("office-content");
  const vacationContentDiv = document.getElementById("vacation-content");

  const innerOfficeDiv = document.createElement("div");
  innerOfficeDiv.classList.add("inner");

  const innerVacctionDiv = document.createElement("div");
  innerVacctionDiv.classList.add("inner");

  fetch(`${APIURL}desk-bookings/date/${todayDate}`, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((deskbooking, index) => {
        fetch(`${APIURL}employees/id/${deskbooking.employeeId}`, fetchOptions)
          .then((response) => response.json())
          .then((employeeData) => {
            const employeeName = employeeData.employeeName;
            const empDiv = document.createElement("div");
            empDiv.style.padding = ".5em";
            empDiv.classList.add("name-tag");
            empDiv.textContent = `${employeeName} `;
            innerOfficeDiv.appendChild(empDiv);
          })
          .catch((error) => {
            console.error("Error fetching employee data:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  officeContentDiv.appendChild(innerOfficeDiv);

  fetch(`${APIURL}vacations/date/${todayDate}`, fetchOptions)
    .then((response) => response.json())
    .then((data) => {
      data.forEach((vacations) => {
        const employeedata = vacations.employeeByEmployeeId;

        const employeeName = employeedata.employeeName;
        const empDiv = document.createElement("div");
        empDiv.style.padding = ".5em";
        empDiv.classList.add("name-tag");

        empDiv.textContent = `${employeeName} `;
        innerVacctionDiv.appendChild(empDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  vacationContentDiv.appendChild(innerVacctionDiv);
}

export async function indexPage() {
  pageStructure();
  await login();
  const rightPanel = document.getElementById("right-panel");
  const contentDiv = document.getElementById("content");
  const div = document.createElement("div");
  div.id = "content";
  const html = `
    <h2>Welcome to HybridHaven!</h2>
    <h3>Today</h2><hr>
      <div>
        <div class="office flex-con">
          <div><img src="./image/office.png" alt="office Image"></div>
          <div> Office</div>
        </div>
        <div id="office-content">
          <p><i>Work from Office</i></p>
        </div>
        <br>
      </div>
      <div>
        <div class="vacation flex-con">
          <div><img src="./image/vacation.jpg" alt="Vacation Image"></div>
          <div> Vacation</div>
        </div>
        <div id="vacation-content">
          <p><i>Enjoying Vacation</i></p>
      </div>
      <br>
    </div>`;
  div.innerHTML = html;
  rightPanel.replaceChild(div,contentDiv);

  loadHomePage();
  closeNav();
}

export function pageStructure() {
  const div = document.getElementById("main-container");
  const newelement = document.createElement("main");
  newelement.classList.add("container");
  newelement.id = "main-container";

  
    // Create left panel section
    const leftPanel = document.createElement("section");
    leftPanel.classList.add("left-panel");
    leftPanel.id = "menu";
  
    // Create top-left div
    const topLeftDiv = document.createElement("div");
    topLeftDiv.classList.add("top-left");
  
    // Create user image
    const userImg = document.createElement("img");
    userImg.id = "user-img";
    userImg.alt = "User Image";
  
    // Create userName div
    const userName = document.createElement("div");
    userName.id = "userName";
  
    // Append user image and userName to top-left div
    topLeftDiv.appendChild(userImg);
    topLeftDiv.appendChild(userName);
  
    // Create left content div
    const leftContent = document.createElement("div");
    leftContent.classList.add("left-content");
  
    // Create ul for menu items
    const menuList = document.createElement("ul");
  
    // Create menu items
    const homeItem = document.createElement("li");
    homeItem.id = "home";
    homeItem.textContent = "Home";
    homeItem.addEventListener("click", function () {
      indexPage();
    });
  
    const deskBookingItem = document.createElement("li");
    deskBookingItem.id = "deskbooking";
    deskBookingItem.textContent = "Desk Booking";
    deskBookingItem.addEventListener("click", function () {
      deskBookigPage();
    });
  
    const eventsItem = document.createElement("li");
    eventsItem.id = "events";
    eventsItem.textContent = "Events";
    eventsItem.addEventListener("click", function () {
      loadEventsPage();
    });
  
    // Append menu items to ul
    menuList.appendChild(homeItem);
    menuList.appendChild(deskBookingItem);
    menuList.appendChild(eventsItem);
  
    // Append ul to left content div
    leftContent.appendChild(menuList);
  
    // Append top-left div and left content div to left panel section
    leftPanel.appendChild(topLeftDiv);
    leftPanel.appendChild(leftContent);
  
    // Create right panel section
    const rightPanel = document.createElement("section");
    rightPanel.classList.add("right-panel");
    rightPanel.id = "right-panel";
  
    // Create top-right div
    const topRightDiv = document.createElement("div");
    topRightDiv.classList.add("top-right");
  
    // Create div for toggle button
    const toggleButtonDiv = document.createElement("div");
  
    // Create toggle button
    const toggleButton = document.createElement("button");
    toggleButton.id = "toggle-button";
  
    // Create SVG icon for toggle button
    const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svgIcon.setAttribute("width", "30");
    svgIcon.setAttribute("height", "35");
    svgIcon.setAttribute("fill", "currentColor");
    svgIcon.classList.add("bi", "bi-list");
    svgIcon.setAttribute("viewBox", "0 0 16 16");
  
    // Create path for SVG icon
    const svgPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    svgPath.setAttribute("fill-rule", "evenodd");
    svgPath.setAttribute(
      "d",
      "M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
    );
  
    // Append path to SVG icon
    svgIcon.appendChild(svgPath);
  
    // Append SVG icon to toggle button
    toggleButton.appendChild(svgIcon);
  
    // Append toggle button to its div
    toggleButtonDiv.appendChild(toggleButton);
  
    // Create logo image
    const logoImg = document.createElement("img");
    logoImg.src = "./image/logo1.jpg";
    logoImg.alt = "HybridHaven Logo";
  
    // Create title
    const title = document.createElement("h1");
    title.textContent = "HybridHaven";
  
    // Append elements to top-right div
    topRightDiv.appendChild(toggleButtonDiv);
    topRightDiv.appendChild(logoImg);
    topRightDiv.appendChild(title);
  
    // Create content div
    const contentDiv = document.createElement("div");
    contentDiv.id = "content";
  
    // Append elements to right panel section
    rightPanel.appendChild(topRightDiv);
    rightPanel.appendChild(contentDiv);
  
    // Append left panel and right panel to body
    newelement.appendChild(leftPanel);
    newelement.appendChild(rightPanel);
  
  document.body.replaceChild(newelement, div);
}
