import {
  formatDate,
  getAllEvents,
  getAllEventsEmployee,
  getEmployeeByName,
  closeNav,
  TurnOnLoader,
  TurnOffLoader,
  getTomorrowDate,
} from "./common.js";
import { openModal } from "./modal.js";
import { API_RUN } from "./URLCollection.js";

var APIURL = API_RUN;

export function loadEventsPage() {
  const rightPanel = document.getElementById("right-panel");
  const contentDiv = document.getElementById("content");
  const div = document.createElement("div");
  div.id = "content";
  const html = `
  <h1 style="padding: 10px;">Events<button id="add-event" class="add-event">Add Events</button></h1>
      <div id="main-show2"><div></div></div>
    `;
  div.innerHTML = html;
  rightPanel.replaceChild(div, contentDiv);
  loadEvents();
  addEvent();
  closeNav();
}

async function loadEvents() {
  TurnOnLoader();
  const Events = await getAllEvents();
  const EventsEmployees = await getAllEventsEmployee();
  const contentDiv = document.getElementById("content");
  const old_mainShow = document.getElementById("main-show2");
  const new_mainShow = document.createElement("div");
  new_mainShow.id = "main-show2";

  let ele = document.createElement("div");
  ele.classList.add("event-div");

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
    div.classList.add("event-emp");

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
      joinButton.classList.add("join-btn-event");
      joinButton.textContent = "Join";
      joinButton.value = events.eventName;
      joinButton.onclick = function () {
        joinEvent(events.eventId, localStorage.getItem("username"));
      };
      card.appendChild(joinButton);
    }

    ele.appendChild(card);
  });
  new_mainShow.appendChild(ele);
  contentDiv.replaceChild(new_mainShow, old_mainShow);
  TurnOffLoader();
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
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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

function addEvent() {
  let eventBtn = document.getElementById("add-event");
  eventBtn.addEventListener("click", function () {
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
    heading.textContent = "Book Your Desk";

    let formcontainer = document.createElement("div");
    formcontainer.classList.add("form-container");

    const form = document.createElement("form");
    form.id = "bookingForm";

    const eventnameLabel = document.createElement("label");
    eventnameLabel.textContent = "Eventname";
    form.appendChild(eventnameLabel);

    const eventnameInput = document.createElement("input");

    eventnameInput.id = "eventname";
    eventnameInput.name = "eventname";
    eventnameInput.placeholder = "Eventname";
    eventnameInput.required = true;
    form.appendChild(eventnameInput);

    const eventDateLable = document.createElement("label");
    eventDateLable.textContent = "Event Date:";
    form.appendChild(eventDateLable);

    const eventDateInput = document.createElement("input");
    eventDateInput.type = "date";
    eventDateInput.id = "bookingDate";
    eventDateInput.name = "bookingDate";
    eventDateInput.required = true;
    form.appendChild(eventDateInput);

    let tomorrow = getTomorrowDate();
    eventDateInput.setAttribute("min", tomorrow);

    const eventDescLable = document.createElement("label");
    eventDescLable.textContent = "Event Date:";
    form.appendChild(eventDescLable);

    const eventDescText = document.createElement("textarea");
    eventDescText.id = "eventdesc";
    eventDescText.name = "eventdesc";
    eventDescText.placeholder = "Event Description";
    eventDescText.required = true;
    form.appendChild(eventDescText);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Book Now";
    form.appendChild(submitButton);

    formcontainer.appendChild(form);
    innerEmpDiv.appendChild(formcontainer);

    employeeDiv.appendChild(innerEmpDiv);
    parent.replaceChild(employeeDiv, old_div);

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      // console.log("click");
      let eventname = eventnameInput.value;
      let eventdate = eventDateInput.value;
      let eventdesc = eventDescText.value;

      console.log(eventname);
      console.log(eventdate);
      console.log(eventdesc);

      let url = `${APIURL}events`;

      const requestBody = {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          eventName: eventname,
          eventDescription: eventdesc,
          eventDate: eventdate,
        }),
      };

      fetch(url, requestBody)
        .then((response) => {
          if (!response.ok) {
            // openModal("Failed to create event");
            throw new Error("Failed to create desk booking :(");
          }
          return response.json();
        })
        .then((data) => {
          modal.style.display = "none";
          loadEventsPage();
          openModal("Event created successfully..!!");
        })
        .catch((error) => {
          console.error("Error creating desk booking :(", error);
        });
      modal.style.display = "none";
    });
  });
}
