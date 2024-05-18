import {
  formatDate,
  getAllEvents,
  getAllEventsEmployee,
  getEmployeeByName,
  closeNav,
} from "./common.js";
import { openModal } from "./modal.js";
import { API_RUN} from "./URLCollection.js";

var APIURL = API_RUN;

export function loadEventsPage() {
  const contentDiv = document.getElementById("content");
  const html = `
      <h1>Events</h1>
      <hr />
      <div id="main-show"><div></div></div>
    `;
  contentDiv.innerHTML = html;
  loadEvents();
  closeNav();
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
        employeeNameElement.textContent = `${eventemp.employeeByEmployeeId.employeeName}`;
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
