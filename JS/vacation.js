import { closeNav, formatDateToYYYYMMDD,fetchOptions } from "./common.js";
import { openModal } from "./modal.js";
import { API_RUN } from "./URLCollection.js";

var APIURL = API_RUN;

export function loadVacationPage() {
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
  loadVacation();
  closeNav();
}

function loadVacation() {
  const contentDiv = document.getElementById("content");
  const old_mainShowVacation = document.getElementById("main-show-vacation");
  const new_mainShowVacation = document.createElement("div");
  new_mainShowVacation.id = "main-show-vacation";

  let ele = document.createElement("div");
  ele.classList.add("vacation-div");

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

  // Create line break
  const br1 = document.createElement("br");

  // Create and set label and input for end date
  const endDateLabel = document.createElement("label");
  endDateLabel.setAttribute("for", "endDate");
  endDateLabel.textContent = "Vacation End Date:";

  const endDateInput = document.createElement("input");
  endDateInput.setAttribute("type", "date");
  endDateInput.id = "endDate";
  endDateInput.required = true;

  // Create line break
  const br2 = document.createElement("br");

  // Create and set button element
  const joinButton = document.createElement("button");
  joinButton.id = "joinVacationButton";
  joinButton.textContent = "Join Vacation";

  // Create message div
  const messageDiv = document.createElement("div");
  messageDiv.id = "message";

  // Append elements to vacation form div
  vacationForm.appendChild(startDateLabel);
  vacationForm.appendChild(startDateInput);
  vacationForm.appendChild(br1);
  vacationForm.appendChild(endDateLabel);
  vacationForm.appendChild(endDateInput);
  vacationForm.appendChild(br2);
  vacationForm.appendChild(joinButton);
  vacationForm.appendChild(messageDiv);

  // Append elements to container div

  container.appendChild(vacationForm);

  ele.appendChild(container);

  new_mainShowVacation.appendChild(ele);
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

    joinVacation(formatDateToYYYYMMDD(start),formatDateToYYYYMMDD(end));
    
    console.log(formatDateToYYYYMMDD(start));

    if (start < today) {
      messageDiv.textContent = "Start date cannot be in the past.";
    } else if (end < start) {
      messageDiv.textContent = "End date cannot be before start date.";
    } else {
      let join = joinVacation();
      console.log(join);
      messageDiv.textContent = "You have joined the vacation!";
      messageDiv.style.color = "green";
    }
  });
}


function joinVacation(startDate,endDate){
    console.log(startDate);
    console.log(endDate);
    const requestBody = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        employeeId : localStorage.getItem("employeeId"),
        vacationStartDate: startDate,
        vacationEndDate: endDate,
      }),
    };

    fetch(`${APIURL}vacations`,requestBody)
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to add user");
      }
      return response.json();
    })
    .then((data)=>{
      console.log("inside");
      return true;
    })
    .catch((error)=>{
      console.log("error creating vacation",error);
    });
}