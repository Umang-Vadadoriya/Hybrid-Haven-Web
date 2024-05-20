import { API_RUN } from "./URLCollection.js";
import {
  GetAllEmployee,
  todayDate,
  fetchOptions,
  closeNav,
  openNav,
  employeeByEmail,
} from "./common.js";
import { deskBookigPage } from "./deskBook.js";
import { loadEventsPage } from "./eventspage.js";
import {
  createProfilemodel,
  createSidebar,
  openProfileModal,
} from "./modal.js";
import { loadVacationPage } from "./vacation.js";

var APIURL = API_RUN;

async function login() {
  let username;
  let useremail;
  let userDiv = document.getElementById("userName");
  let userimage = document.getElementById("user-img");
  let userimage1 = document.getElementById("user-img1");
  let sidebarImage = document.getElementById("sidebar-img");
  let sidebarUname = document.getElementById("sidebar-uname");

  fetch(`https://api.github.com/user`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      username = data.name ? data.name : "Profile";
      localStorage.setItem("username", username);
      userDiv.innerText = localStorage.getItem("username");
      sidebarUname.innerText = localStorage.getItem("username");
      userimage.src = data.avatar_url;
      userimage1.src = data.avatar_url;
      sidebarImage.src = data.avatar_url;
    })
    .catch((error) => {
      console.error("Error fetching userdata", error);
    });

  fetch(`https://api.github.com/user/emails`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log(data);
      useremail = data[0]["email"];
      localStorage.setItem("userEmail", useremail);
    })
    .catch((error) => {
      console.error("Error fetching userdata", error);
    });

  let saved = false;

  if (localStorage.getItem("userEmail")) {
    let employee = await employeeByEmail(localStorage.getItem("userEmail"));
    console.log(employee);
    if (employee) {
      saved = true;
      localStorage.setItem("employeeId", employee.employeeId);
    }
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
          throw new Error("Failed to add user");
        }
        return response.json();
      })
      .then((data) => {
        let empid = data.employeeId;
        localStorage.setItem("employeeId", empid);
        const requestBodyContact = {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            employeeId: empid,
            employeeEmail: localStorage.getItem("userEmail"),
            employeeContact: 0,
          }),
        };

        console.log(data);
        fetch(`${APIURL}employeeContact/`, requestBodyContact)
          .then((response) => {
            if (!response.ok) {
              throw new Error("Failed to add user");
            }
            return response.json();
          })
          .then((contact) => {
            console.log(contact);
            // indexPage();
          })
          .catch((error) => {
            console.error("Error creating employee", error);
          });
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
  createRightpanel();
}

export function createRightpanel() {
  const rightPanel = document.getElementById("right-panel");
  const contentDiv = document.getElementById("content");
  const div = document.createElement("div");
  div.id = "content";
  const html = `
    <h2>Welcome to HybridHaven!</h2>
    <h3>Today</h2><hr>
    <div id="main-show-home">
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
  rightPanel.replaceChild(div, contentDiv);
  loadHomePage();
  closeNav();
}

export function pageStructure() {
  const div = document.getElementById("main-container");
  const newelement = document.createElement("main");
  newelement.classList.add("container");
  newelement.id = "main-container";

  const leftPanel = document.createElement("section");
  leftPanel.classList.add("left-panel");
  leftPanel.id = "menu";

  const topLeftDiv = document.createElement("div");
  topLeftDiv.classList.add("top-left");

  const userImg = document.createElement("img");
  userImg.id = "user-img";
  userImg.alt = "User Image";

  const userName = document.createElement("div");
  userName.id = "userName";
  userName.addEventListener("click", function () {
    openProfileModal();
  });

  topLeftDiv.appendChild(userImg);
  topLeftDiv.appendChild(userName);

  const leftContent = document.createElement("div");
  leftContent.classList.add("left-content");

  const menuList = document.createElement("ul");

  const homeItem = document.createElement("li");
  homeItem.id = "home";
  homeItem.textContent = "Home";
  homeItem.addEventListener("click", function () {
    createRightpanel();
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

  const vacationItem = document.createElement("li");
  vacationItem.id = "vacation";
  vacationItem.textContent = "Vacation";
  vacationItem.addEventListener("click", function () {
    loadVacationPage();
  });

  menuList.appendChild(homeItem);
  menuList.appendChild(deskBookingItem);
  menuList.appendChild(eventsItem);
  menuList.appendChild(vacationItem);

  leftContent.appendChild(menuList);

  leftPanel.appendChild(topLeftDiv);
  leftPanel.appendChild(leftContent);

  const rightPanel = document.createElement("section");
  rightPanel.classList.add("right-panel");
  rightPanel.id = "right-panel";

  const topRightDiv = document.createElement("div");
  topRightDiv.classList.add("top-right");

  const toggleButtonDiv = document.createElement("div");

  const toggleButton = document.createElement("button");
  toggleButton.id = "toggle-button";
  toggleButton.addEventListener("click", function () {
    openNav();
  });

  const svgIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svgIcon.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svgIcon.setAttribute("width", "30");
  svgIcon.setAttribute("height", "35");
  svgIcon.setAttribute("fill", "currentColor");
  svgIcon.classList.add("bi", "bi-list");
  svgIcon.setAttribute("viewBox", "0 0 16 16");

  const svgPath = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  svgPath.setAttribute("fill-rule", "evenodd");
  svgPath.setAttribute(
    "d",
    "M2.5 12a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5m0-4a.5.5 0 0 1 .5-.5h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5"
  );

  svgIcon.appendChild(svgPath);

  toggleButton.appendChild(svgIcon);

  toggleButtonDiv.appendChild(toggleButton);

  const logoImg = document.createElement("img");
  logoImg.src = "./image/logo1.jpg";
  logoImg.alt = "HybridHaven Logo";

  const title = document.createElement("h1");
  title.textContent = "HybridHaven";

  topRightDiv.appendChild(toggleButtonDiv);
  topRightDiv.appendChild(logoImg);
  topRightDiv.appendChild(title);

  const contentDiv = document.createElement("div");
  contentDiv.id = "content";

  rightPanel.appendChild(topRightDiv);
  rightPanel.appendChild(contentDiv);

  newelement.appendChild(leftPanel);
  newelement.appendChild(rightPanel);

  document.body.replaceChild(newelement, div);
  createSidebar();
  createProfilemodel();
}
