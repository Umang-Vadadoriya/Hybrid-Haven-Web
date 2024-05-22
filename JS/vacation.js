import {
  closeNav,
  formatDateToYYYYMMDD,
  fetchOptions,
  TurnOnLoader,
  TurnOffLoader,
} from "./common.js";
import { openModal } from "./modal.js";
import { API_RUN } from "./URLCollection.js";

var APIURL = API_RUN;

export async function loadVacationPage() {
  const rightPanel = document.getElementById("right-panel");
  const contentDiv = document.getElementById("content");
  const div = document.createElement("div");
  div.id = "content";
  const html = `
      <h1>Apply For Vacation</h1>
      <hr />
      <div id="main-show-vacation"><div></div></div>
    `;
  div.innerHTML = html;
  rightPanel.replaceChild(div, contentDiv);
  await loadVacation();
  closeNav();
}

async function loadVacation() {
  TurnOnLoader();
  const contentDiv = document.getElementById("content");
  const old_mainShowVacation = document.getElementById("main-show-vacation");
  const new_mainShowVacation = document.createElement("div");
  new_mainShowVacation.id = "main-show-vacation";

  let ele = document.createElement("div");
  ele.classList.add("vacation-div");

  const Vacations = await GetAllVacations();

  const container = document.createElement("div");

  const vacationForm = document.createElement("div");
  vacationForm.classList.add("vacation-form");

  const startDateLabel = document.createElement("label");
  startDateLabel.setAttribute("for", "startDate");
  startDateLabel.textContent = "Vacation Start Date:";

  const startDateInput = document.createElement("input");
  startDateInput.setAttribute("type", "date");
  startDateInput.id = "startDate";
  startDateInput.required = true;

  const br1 = document.createElement("br");

  const endDateLabel = document.createElement("label");
  endDateLabel.setAttribute("for", "endDate");
  endDateLabel.textContent = "Vacation End Date:";

  const endDateInput = document.createElement("input");
  endDateInput.setAttribute("type", "date");
  endDateInput.id = "endDate";
  endDateInput.required = true;

  const br2 = document.createElement("br");

  const joinButton = document.createElement("button");
  joinButton.id = "joinVacationButton";
  joinButton.textContent = "Join Vacation";

  const messageDiv = document.createElement("div");
  messageDiv.id = "message";

  vacationForm.appendChild(startDateLabel);
  vacationForm.appendChild(startDateInput);
  vacationForm.appendChild(br1);
  vacationForm.appendChild(endDateLabel);
  vacationForm.appendChild(endDateInput);
  vacationForm.appendChild(br2);
  vacationForm.appendChild(joinButton);
  vacationForm.appendChild(messageDiv);

  container.appendChild(vacationForm);

  ele.appendChild(container);

  const RightEle = document.createElement("div");
  RightEle.classList.add("vacation-Show-Container");

  const heading = document.createElement("h2");
  heading.textContent = "Your Upcoming Vacations";
  RightEle.appendChild(heading);

  Vacations.map((vac) => {
    if (vac.employeeId == localStorage.getItem("employeeId")) {
      let DataContainer = document.createElement("div");
      DataContainer.classList.add("name-tag");
      DataContainer.textContent = `${vac.vacationStartDate} To ${vac.vacationEndDate}`;

      let button = document.createElement("button");
      button.value = vac.vacationId;
      button.classList.add("cancel-btn");
      button.textContent = "X";
      button.onclick = async function () {
        await cancelVacation(button.value);
      };

      DataContainer.appendChild(button);
      RightEle.appendChild(DataContainer);
    }
  });

  new_mainShowVacation.appendChild(ele);
  new_mainShowVacation.appendChild(RightEle);
  contentDiv.replaceChild(new_mainShowVacation, old_mainShowVacation);

  joinButton.addEventListener("click", function () {
    const startDate = startDateInput.value;
    const endDate = endDateInput.value;
    messageDiv.textContent = "";

    if (!startDate || !endDate) {
      messageDiv.textContent = "Please enter both start and end dates.";
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    if (start < today) {
      messageDiv.textContent = "Start date cannot be in the past.";
    } else if (end < start) {
      messageDiv.textContent = "End date cannot be before start date.";
    } else {
      joinVacation(formatDateToYYYYMMDD(start), formatDateToYYYYMMDD(end));
    }
  });
  TurnOffLoader();
}

async function cancelVacation(vacationId) {
  const url = `${APIURL}vacations/id/${vacationId}`;

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
        openModal("Failed To Cancel Vacation");
        throw new Error("Failed To Cancel Vacation :(");
      }
    })
    .then(() => {
      openModal("Happy Work..!!");
      loadVacationPage();
    })
    .catch((error) => {
      console.error("Error Deleting Vacation :(", error);
    });
}

async function GetAllVacations() {
  const Vacations = await fetch(`${APIURL}vacations`, fetchOptions)
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error Fetching Vacations..!!");
      }
    })
    .catch((error) => console.error("Error While Fetching Vacations: ", error));

  return Vacations;
}

async function joinVacation(startDate, endDate) {
  const mes = document.getElementById("message");
  let empid = localStorage.getItem("employeeId");
  const requestBody = {
    method: "POST",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employeeId: empid,
      vacationStartDate: startDate,
      vacationEndDate: endDate,
    }),
  };

  await fetch(`${APIURL}vacations`, requestBody)
    .then((res) => res.json())
    .then((data) => {
      mes.textContent = "You have joined the vacation!";
      mes.style.color = "green";
    })
    .catch((error) => {
      console.log("error creating vacation", error);
    });
}
