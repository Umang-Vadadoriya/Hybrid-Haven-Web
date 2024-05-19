import {
  countBooking,
  getAllNeighbour,
  getBookingWithDate,
  tommorrowDate,
  GetAllEmployee,
  closeNav,
  getTomorrowDate,
  getEmployeeByName,
} from "./common.js";
import { openModal } from "./modal.js";
import { API_RUN } from "./URLCollection.js";

var APIURL = API_RUN;

// Deskbooking Page

export function deskBookigPage() {
  const rightPanel = document.getElementById("right-panel");
  const contentDiv = document.getElementById("content");
  const div = document.createElement("div");
  div.id = "content";
  const html = `
    <h1>WHO'S IN TOMORROW</h1>
    <hr />
    <div id="main-show"></div>
  `;
  div.innerHTML = html;
  rightPanel.replaceChild(div, contentDiv);
  loadDeskBooking();
  closeNav();
}

async function loadDeskBooking() {
  const Bookings = await getBookingWithDate(tommorrowDate);
  const NeighbourHoods = await getAllNeighbour();
  const Employees = await GetAllEmployee();

  const mainShow = document.getElementById("main-show");
  // mainShow.innerHTML = "";
  let ele = document.createElement("div");

  let booked = false;
  let bookedNeighbourHoodName;
  let bookedBookingID;
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
                bookedNeighbourHoodName = nei.neighbourName;
                bookedBookingID = booking.deskBookingId;
              }
              let employeeNameElement = document.createElement("span");
              employeeNameElement.classList.add("name-tag");
              employeeNameElement.textContent = `${emp.employeeName}`;
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

    if ((avail > 0 && !booked) && !booked) {      
      let joinButton = document.createElement("button");
      joinButton.id = `neighbourhood-${nei.neighbourName}`;
      joinButton.classList.add("join-btn");
      joinButton.textContent = "Join";
      joinButton.value = nei.neighbourId;
      joinButton.onclick = function () {
        joinDesk(
          joinButton.value,
          localStorage.getItem("username"),
          tommorrowDate
        );
      };
      ele.appendChild(joinButton);
    } else if (booked && nei.neighbourName == bookedNeighbourHoodName) {
      let CancelButton = document.createElement("button");
      CancelButton.id = `neighbourhood-${nei.neighbourName}`;
      CancelButton.classList.add("cancel-btn");
      CancelButton.textContent = "Cancel";
      CancelButton.value = bookedBookingID;
      CancelButton.onclick = function () {
        cancelDesk(CancelButton.value);
      };
      ele.appendChild(CancelButton);
    }
  });
  mainShow.appendChild(ele);
}

function joinDesk(type, name, date) {
  createDeskBooking(type, getTomorrowDate(), name, date);
}

function cancelDesk(deskBookingId) {
  cancelDeskBooking(deskBookingId);
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
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
          throw new Error("Failed to create desk booking :(");
        }
        return response.json();
      })
      .then((data) => {
        openModal("Desk booking created successfully..!!");
        deskBookigPage();
      })
      .catch((error) => {
        console.error("Error creating desk booking :(", error);
      });
  }
}

async function cancelDeskBooking(deskBookingId) {
  // Construct the URL
  const url = `${APIURL}desk-bookings/id/${deskBookingId}`;

  // Create the request body
  const requestBody = {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
  };

  // Send the DELETE request
  fetch(url, requestBody)
    .then((response) => {
      if (!response.ok) {
        openModal("Failed to cancel desk booking");
        throw new Error("Failed to cancel desk booking :(");
      }
    })
    .then(() => {
      openModal("Sorry To See You Go..!!");
      deskBookigPage();
    })
    .catch((error) => {
      console.error("Error creating desk booking :(", error);
    });
}
