import {
  countBooking,
  getAllNeighbour,
  getBookingWithDate,
  tommorrowDate,
  GetAllEmployee,
  closeNav,
  getTomorrowDate,
  getEmployeeByName,
  TurnOnLoader,
  TurnOffLoader,
} from "./common.js";
import { openModal } from "./modal.js";
import { API_RUN } from "./URLCollection.js";

var APIURL = API_RUN;

// Deskbooking Page

export async function deskBookigPage() {
  const rightPanel = document.getElementById("right-panel");
  const contentDiv = document.getElementById("content");
  const div = document.createElement("div");
  div.id = "content";
  const html = `
    <h1>WHO'S IN TOMORROW</h1>
    <hr />
    <div id="main-show"><div></div></div>
  `;
  div.innerHTML = html;
  rightPanel.replaceChild(div, contentDiv);
  await loadDeskBooking();
  closeNav();
}

async function loadDeskBooking() {
  TurnOnLoader();
  const Bookings = await getBookingWithDate(tommorrowDate);
  const NeighbourHoods = await getAllNeighbour();
  const Employees = await GetAllEmployee();

  const contentDiv = document.getElementById("content");
  const old_mainShow = document.getElementById("main-show");
  const new_mainshow = document.createElement("div");
  new_mainshow.id = "main-show";

  let ele = document.createElement("div");
  ele.classList.add("desk-book");

  let booked = false;
  let bookedNeighbourHoodName;
  let bookedBookingID;

  let totalemp = {};

  let neiNames = [];
  NeighbourHoods.map((nei) => {
    let avail = 0;
    let arr = [];
    neiNames.push(nei.neighbourName);

    let neighbourhoodDiv = document.createElement("div");
    neighbourhoodDiv.classList.add("neighbourhood-div");

    let heading = document.createElement("h3");
    heading.textContent = nei.neighbourName;
    neighbourhoodDiv.appendChild(heading);

    avail = nei.neighbourNumberOfDesk;

    let innerElement = document.createElement("div");

    if (countBooking(nei.neighbourId, Bookings) > 0) {
      innerElement.classList.add("inner");
      innerElement.id = `${nei.neighbourName}-inner`;
      Bookings.map((booking) => {
        if (booking.neighbourId == nei.neighbourId) {
          Employees.map((emp) => {
            if (emp.employeeId == booking.employeeId) {
              if (localStorage.getItem("username") == emp.employeeName) {
                booked = true;
                bookedNeighbourHoodName = nei.neighbourName;
                bookedBookingID = booking.deskBookingId;
              }
              arr.push(emp.employeeName);
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
      innerElement.id = `${nei.neighbourName}-inner`;
      innerElement.style.fontStyle = "italic";

      innerElement.textContent = `No one booked the ${nei.neighbourName}`;
    }
    let name = nei.neighbourName;
    totalemp[name] = arr;
    neighbourhoodDiv.appendChild(innerElement);

    let availTag = document.createElement("div");
    availTag.classList.add("avail-tag");
    availTag.textContent = `+${avail} Desks left`;
    neighbourhoodDiv.appendChild(availTag);

    if (avail > 0 && !booked && !booked) {
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
      neighbourhoodDiv.appendChild(joinButton);
    } else if (booked && nei.neighbourName == bookedNeighbourHoodName) {
      let cancelButton = document.createElement("button");
      cancelButton.id = `neighbourhood-${nei.neighbourName}`;
      cancelButton.classList.add("cancel-btn");
      cancelButton.textContent = "Cancel";
      cancelButton.value = bookedBookingID;
      cancelButton.onclick = function () {
        cancelDesk(cancelButton.value);
      };
      neighbourhoodDiv.appendChild(cancelButton);
    }


    ele.appendChild(neighbourhoodDiv);

  });
  new_mainshow.appendChild(ele);
  contentDiv.replaceChild(new_mainshow, old_mainShow);

  neiNames.map((nei) => {
    let classname = `${nei}-inner`;
    let total = document.getElementById(classname).children.length;
    let div = document.getElementById(classname);
    if (total > 3) {
      const hoverdiv = document.createElement("div");
      hoverdiv.id = "viewMore";
      hoverdiv.textContent = `+${total - 3} More ...`;
      hoverdiv.classList.add("view-more");
      hoverdiv.addEventListener("click", function () {
        deskHover(totalemp[nei],nei);
      });
      div.appendChild(hoverdiv);
    }
  });

  TurnOffLoader();
}

function deskHover(data,type){
  let parent = document.getElementById("emp-model");
  let heading = document.getElementById("view-heading");
  let old_div = document.getElementById("emplist");
  let employeeDiv = document.createElement("div");
  employeeDiv.id = "emplist";
  employeeDiv.classList.add("employee-list");
  const innerEmpDiv = document.createElement("div");
  innerEmpDiv.classList.add("inner-vac");

  let modal = document.getElementById("employeeModal");
  modal.style.display = "flex";

  heading.textContent = type;
  data.map((d)=>{
    const employeeName = d;
        const empDiv = document.createElement("div");
        empDiv.style.padding = ".5em";
        empDiv.classList.add("name-tag");
        empDiv.textContent = `${employeeName} `;
        innerEmpDiv.appendChild(empDiv);
  })
  employeeDiv.appendChild(innerEmpDiv);
  parent.replaceChild(employeeDiv, old_div);

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
