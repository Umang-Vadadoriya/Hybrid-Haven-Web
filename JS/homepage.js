import { API_RUN} from "./URLCollection.js";
import {GetAllEmployee,todayDate,fetchOptions,closeNav} from "./common.js"

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
        Authorization: `Bearer ${localStorage.getItem("token")}`,
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
          Authorization: `Bearer ${localStorage.getItem("token")}`,
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
            empDiv.textContent = `@${employeeName} `;
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

        empDiv.textContent = `@${employeeName} `;
        innerVacctionDiv.appendChild(empDiv);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  vacationContentDiv.appendChild(innerVacctionDiv);
}

export async function indexPage() {
  await login();
  const contentDiv = document.getElementById("content");
  const para = document.createElement("p");
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
  contentDiv.innerHTML = html;

  loadHomePage();
  closeNav();
}
