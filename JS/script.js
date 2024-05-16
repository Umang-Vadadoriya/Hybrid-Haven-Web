import { loadLogin, parseTokenFromUrl, getTokenFromCode } from "./login.js";
import { API_RUN, WEB_RUN } from "./URLCollection.js";

var APIURL = API_RUN;
var HostURL = WEB_RUN;

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
        loadEventsPage();
      })
      .catch((error) => {
        console.error("Error creating employee", error);
      });
  }
}

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

const currentDate = new Date();
const todayDate = `${currentDate.getDate().toString().padStart(2, "0")}.${(
  currentDate.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}.${currentDate.getFullYear()}`;
const deskDate = "13.02.2024";

const tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);
const tommorrowDate = `${tomorrow.getDate().toString().padStart(2, "0")}.${(
  tomorrow.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}.${tomorrow.getFullYear()}`;

const toggle = document.getElementById("toggle-button");
const leftPanel = document.getElementById("menu");

function toggleButton() {
  var width = window.innerWidth;
  if (width <= 426) {
    toggle.style.display = "block";
    leftPanel.style.display = "none";
  } else {
    toggle.style.display = "none";
    leftPanel.style.display = "block";
    closeNav();
  }
}

document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const homeOption = document.getElementById("home");
  const deskbookingOption = document.getElementById("deskbooking");
  const messagesOption = document.getElementById("messages");
  const username = document.getElementById("userName");

  RedirectAsPerLogIn();
  indexPage();

  window.addEventListener("resize", function () {
    toggleButton();
  });

  toggle.addEventListener("click", function () {
    openNav();
  });

  username.addEventListener("click", function () {
    openProfileModal();
  });

  homeOption.addEventListener("click", function () {
    indexPage();
  });

  deskbookingOption.addEventListener("click", function () {
    deskBookigPage();
  });

  messagesOption.addEventListener("click", function () {
    loadEventsPage();
  });
});

// DeskBooking Page

function deskBookigPage() {
  const contentDiv = document.getElementById("content");
  const html = `
    <h1>WHO'S IN TOMORROW</h1>
    <hr />
    <div id="main-show"></div>
  `;
  contentDiv.innerHTML = html;
  loadDeskBooking();
}

async function getBookingWithDate(date) {
  let Bookings = await fetch(
    `${APIURL}desk-bookings/date/${date}`,
    fetchOptions
  )
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching booking data:", error);
    });
  return Bookings;
}

async function getAllNeighbour() {
  let NeighbourHoods = await fetch(`${APIURL}neighbourhoods`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching neighbourhood data:", error);
    });
  return NeighbourHoods;
}

async function GetAllEmployee() {
  let Employees = await fetch(`${APIURL}employees`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching employees data:", error);
    });

  return Employees;
}

function countBooking(neighbourId, Bookings) {
  let count = 0;

  Bookings.forEach((booking) => {
    if (booking.neighbourId == neighbourId) {
      count++;
    }
  });

  return count;
}

// Deskbooking Page

async function loadDeskBooking() {
  const Bookings = await getBookingWithDate(tommorrowDate);
  const NeighbourHoods = await getAllNeighbour();
  const Employees = await GetAllEmployee();

  const mainShow = document.getElementById("main-show");
  mainShow.innerHTML = "";
  let ele = document.createElement("div");

  let booked = false;
  NeighbourHoods.map((nei) => {
    let avail = 0;

    let heading = document.createElement("h3");
    heading.textContent = nei.neighbourName;
    ele.appendChild(heading);
    avail = nei.neighbourNumberOfDesk;
    let innerElement = document.createElement("div");

    if (countBooking(nei.neighbourId, Bookings) > 0) {
      innerElement.classList.add("inner");
      Bookings.map((booking) => {
        if (booking.neighbourId == nei.neighbourId) {
          Employees.map((emp) => {
            if (emp.employeeId == booking.employeeId) {
              if (localStorage.getItem("username") == emp.employeeName) {
                booked = true;
              }
              let employeeNameElement = document.createElement("span");
              employeeNameElement.classList.add("name-tag");
              employeeNameElement.textContent = `@${emp.employeeName}`;
              innerElement.appendChild(employeeNameElement);
              avail--;
            }
          });
        }
      });
    } else {
      let nothingBooked = document.createElement("p");
      let italicTxt = document.createElement("i");
      italicTxt.textContent = `No one Book the ${nei.neighbourName}`;
      nothingBooked.appendChild(italicTxt);
      innerElement.appendChild(nothingBooked);
    }
    ele.appendChild(innerElement);

    let employeeNameElement = document.createElement("div");
    employeeNameElement.classList.add("avail-tag");
    employeeNameElement.textContent = `+${avail} Desks left`;
    ele.appendChild(employeeNameElement);

    if (avail > 0 && !booked) {
      let joinButton = document.createElement("button");
      joinButton.id = `neighbourhood-${nei.neighbourName}`;
      joinButton.classList.add("join-btn");
      joinButton.textContent = "Join";
      joinButton.value = nei.neighbourName;
      joinButton.onclick = function () {
        joinDesk(
          joinButton.value,
          localStorage.getItem("username"),
          tommorrowDate
        );
      };
      ele.appendChild(joinButton);
    }
  });
  mainShow.appendChild(ele);
  closeNav();
}

// Events Page

async function getAllEvents() {
  let events = await fetch(`${APIURL}events`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching employees data:", error);
    });
  return events;
}

async function getAllEventsEmployee() {
  let eventsEmployees = await fetch(`${APIURL}events-employee`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching employees data:", error);
    });
  return eventsEmployees;
}

function loadEventsPage() {
  const contentDiv = document.getElementById("content");
  const html = `
    <h1>Events</h1>
    <hr />
    <div id="main-show"></div>
  `;
  contentDiv.innerHTML = html;
  loadEvents();
  closeNav();
}

function formatDate(date) {
  const originalDate = date;
  const parts = originalDate.split("-");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
}

async function loadEvents() {
  const Events = await getAllEvents();
  const EventsEmployees = await getAllEventsEmployee();

  const mainShow = document.getElementById("main-show");
  let ele = document.createElement("div");

  Events.map((events) => {
    let eventbooked = false;
    let card = document.createElement("div");
    card.classList.add("event-card");

    let line = document.createElement("div");
    line.classList.add("event-line");
    card.appendChild(line);

    let eventDate = document.createElement("div");
    eventDate.classList.add("event-date");
    eventDate.textContent = formatDate(events.eventDate);
    card.appendChild(eventDate);

    formatDate(events.eventDate);

    let eventName = document.createElement("div");
    eventName.classList.add("event-name");
    eventName.textContent = events.eventName;
    card.appendChild(eventName);

    let eventDesc = document.createElement("div");
    eventDesc.classList.add("event-desc");
    eventDesc.textContent = events.eventDescription;
    card.appendChild(eventDesc);

    let div = document.createElement("div");
    div.classList.add("event-desc");

    let eventEmployee = document.createElement("div");
    eventEmployee.classList.add("inner");
    EventsEmployees.map((eventemp) => {
      if (events.eventId == eventemp.eventId) {
        if (
          localStorage.getItem("username") ==
          eventemp.employeeByEmployeeId.employeeName
        ) {
          eventbooked = true;
        }
        let employeeNameElement = document.createElement("div");
        employeeNameElement.classList.add("name-tag");
        employeeNameElement.textContent = `@${eventemp.employeeByEmployeeId.employeeName}`;
        eventEmployee.appendChild(employeeNameElement);
      }
    });
    div.appendChild(eventEmployee);
    card.appendChild(div);
    if (!eventbooked) {
      let joinButton = document.createElement("button");
      joinButton.id = `event-${events.eventId}`;
      joinButton.classList.add("join-btn");
      joinButton.textContent = "Join";
      joinButton.value = events.eventName;
      joinButton.onclick = function () {
        joinEvent(events.eventId, localStorage.getItem("username"));
      };
      card.appendChild(joinButton);
    }

    ele.appendChild(card);
  });
  mainShow.appendChild(ele);
}

async function joinEvent(eventId, name) {
  const employees = await getEmployeeByName(name);
  let employeeId;

  employees.map((employee) => {
    employeeId = employee.employeeId;
  });

  const requestBody = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employeeId: employeeId,
      eventId: eventId,
    }),
  };

  // Send the POST request
  fetch(`${APIURL}events-employee`, requestBody)
    .then((response) => {
      if (!response.ok) {
        openModal("Failed to book Event");
        throw new Error("Failed to create event booking");
      }
      return response.json();
    })
    .then((data) => {
      openModal("Event booked successfully:");
      loadEventsPage();
    })
    .catch((error) => {
      console.error("Error creating desk booking:", error);
    });
}

// Home + indexpage
const fetchOptions = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  },
};

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

async function indexPage() {
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

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

// joining desks

function joinDesk(type, name, date) {
  switch (type) {
    case "Meeting":
      createDeskBooking(1, getTomorrowDate(), name, date);
      break;
    case "Hot Desk":
      createDeskBooking(2, getTomorrowDate(), name, date);
      break;
    case "Collab":
      console.log("collab");
      createDeskBooking(3, getTomorrowDate(), name, date);
      break;
  }
}

function getTomorrowDate() {
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getEmployeeByName(name) {
  let employee = await fetch(`${APIURL}employees/name/${name}`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching booking data:", error);
    });
  return employee;
}

async function createDeskBooking(
  neighbourId,
  deskBookingDate,
  name,
  tommorrowDate
) {
  const employees = await getEmployeeByName(name);
  const bookings = await getBookingWithDate(tommorrowDate);
  let employeeId;
  let flag = false;

  employees.map((employee) => {
    employeeId = employee.employeeId;
    bookings.map((booking) => {
      if (employee.employeeId === booking.employeeId) {
        flag = true;
        return;
      }
    });
  });

  if (!flag) {
    // // Construct the URL
    const url = `${APIURL}desk-bookings`;

    // Create the request body
    const requestBody = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId: employeeId,
        neighbourId: neighbourId,
        deskBookingDate: deskBookingDate,
      }),
    };

    // Send the POST request
    fetch(url, requestBody)
      .then((response) => {
        if (!response.ok) {
          openModal("Failed to create desk booking");
          throw new Error("Failed to create desk booking");
        }
        return response.json();
      })
      .then((data) => {
        openModal("Desk booking created successfully:");
        deskBookigPage();
      })
      .catch((error) => {
        console.error("Error creating desk booking:", error);
      });
  }
}

// Model js

var modal = document.getElementById("myModal");
var span = document.getElementsByClassName("close")[0];

function openModal(message) {
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

function openProfileModal() {
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
