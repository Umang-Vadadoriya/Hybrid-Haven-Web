const currentDate = new Date();
const formattedDate = `${currentDate.getDate().toString().padStart(2, "0")}.${(
  currentDate.getMonth() + 1
)
  .toString()
  .padStart(2, "0")}.${currentDate.getFullYear()}`;
console.log(formattedDate);
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
  const aboutOption = document.getElementById("about");

  indexPage();

  window.addEventListener("resize", function () {
    toggleButton();
  });

  toggle.addEventListener("click", function () {
    // console.log("ygvfyhjbgvhg");
    // toggleContent();
    openNav();
  });

  // loadHomePage();

  homeOption.addEventListener("click", function () {
    indexPage();
  });

  deskbookingOption.addEventListener("click", function () {
    deskBookigPage();
  });

  messagesOption.addEventListener("click", function () {
    contentDiv.innerHTML = `
      <h2>Messages</h2>
      <p>This is the messages page content.</p>
    `;
  });

  aboutOption.addEventListener("click", function () {
    contentDiv.innerHTML = `
      <h2>About</h2>
      <p>This is the about page content.</p>
    `;
    console.log("hgbjhbjih");
  });
});

// DeskBooking Page

function deskBookigPage() {
  const contentDiv = document.getElementById("content");
  const html = `
  <h1>WHO'S IN TOMORROW</h1>
    <hr />
    <div>
      <h3>Meeting</h3>
      <div id="meeting-content"></div>
      <button id="join-btn" value="Meeting" onClick=joinDesk("Meeting")>Join</button>
    </div>
    <div>
      <h3>Hot Desk</h3>
      <div id="hotdesk-content"></div>
      <button id="join-btn" value="Hot Desk" onClick=joinDesk("HotDesk")>Join</button>
    </div>
    <div>
      <h3>Collab</h3>
      <div id="collab-content"></div>
      <button id="join-btn" value="Collab" onClick=joinDesk("Collab")>Join</button>
    </div>
  `;
  contentDiv.innerHTML = html;
  loadDeskBooking();
}

function loadDeskBooking() {
  const meetingContentDiv = document.getElementById("meeting-content");
  const hotdeskContentDiv = document.getElementById("hotdesk-content");
  const collabContentDiv = document.getElementById("collab-content");

  const innerMeetingDiv = document.createElement("div");
  innerMeetingDiv.classList.add("inner");

  const innerHotdeskDiv = document.createElement("div");
  innerHotdeskDiv.classList.add("inner");

  const innerCollabDiv = document.createElement("div");
  innerCollabDiv.classList.add("inner");

  fetch(`http://34.251.172.36:8080/desk-bookings/date/07.05.2024`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      data.forEach((deskbooking, index) => {
        fetch(
          `http://34.251.172.36:8080/neighbourhoods/id/${deskbooking.neighbourId}`
        )
          .then((response) => response.json())
          .then((neighbourhoods) => {
            // Process the fetched employee data
            let neighbourName = neighbourhoods.neighbourName;
            fetch(
              `http://34.251.172.36:8080/employees/id/${deskbooking.employeeId}`
            )
              .then((response) => response.json())
              .then((employeeData) => {
                // Display the employee names
                const employeeName = employeeData.employeeName;
                const employeeNameElement = document.createElement("div");
                employeeNameElement.style.padding = ".5em";
                employeeNameElement.classList.add("name-tag");
                employeeNameElement.textContent = `@${employeeName} `;
                switch (neighbourName) {
                  case "Meeting":
                    innerMeetingDiv.appendChild(employeeNameElement);
                    break;
                  case "Hot Desk":
                    innerHotdeskDiv.appendChild(employeeNameElement);
                    break;
                  case "Collab":
                    innerCollabDiv.appendChild(employeeNameElement);
                    break;
                }
              })
              .catch((error) => {
                console.error("Error fetching employee data:", error);
              });
          })
          .catch((error) => {
            console.error("Error fetching employee data:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
  meetingContentDiv.appendChild(innerMeetingDiv);
  hotdeskContentDiv.appendChild(innerHotdeskDiv);
  collabContentDiv.appendChild(innerCollabDiv);
  closeNav();
}

// Home + indexpage

function loadHomePage() {
  const officeContentDiv = document.getElementById("office-content");
  const vacationContentDiv = document.getElementById("vacation-content");

  const innerOfficeDiv = document.createElement("div");
  innerOfficeDiv.classList.add("inner");

  const innerVacctionDiv = document.createElement("div");
  innerVacctionDiv.classList.add("inner");

  // div.style.width = "20rem";
  // div.style.padding = ".5em";

  fetch(`http://34.251.172.36:8080/desk-bookings/date/07.05.2024`)
    .then((response) => response.json()) // Assuming response is JSON
    .then((data) => {
      // console.log(data);
      data.forEach((deskbooking, index) => {
        fetch(
          `http://34.251.172.36:8080/employees/id/${deskbooking.employeeId}`
        )
          .then((response) => response.json())
          .then((employeeData) => {
            // Process the fetched employee data
            // console.log(employeeData);

            // Display the employee names
            const employeeName = employeeData.employeeName;
            const empDiv = document.createElement("div");
            empDiv.style.padding = ".5em";
            empDiv.classList.add("name-tag");

            // empDiv.style.marginBottom = "1em";
            // const employeeNameElement = document.createElement("span");
            // const parantDiv = document.createElement("div");
            empDiv.textContent = `@${employeeName} `;
            // empDiv.appendChild(employeeNameElement);
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

  fetch(`http://34.251.172.36:8080/vacations/date/16.02.2023`)
    .then((response) => response.json())
    .then((data) => {
      // console.log(data);
      data.forEach((vacations) => {
        // console.log(vacations);
        const employeedata = vacations.employeeByEmployeeId;
        // console.log(employeedata.employeeName);
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

function indexPage() {
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
  // contentDiv.appendChild('beforechild',html);
  loadHomePage();
  closeNav();
}

function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

//remaining desk Bookings
// function totalDesks(deskid) {
//   let totalDesks = 0;
//   return new promise fetch(`http://34.251.172.36:8080/neighbourhoods/id/${deskid}`)
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       // totalDesks = data.neighbourNumberOfDesk;
//       // return totalDesks;
//       return data.neighbourNumberOfDesk;
//     })
//     .catch((error) => {
//       console.error("Error fetching data:", error);
//     });
//   // console.log(totalDesks);
// }

function totalDesks(deskid) {
  return fetch(`http://34.251.172.36:8080/neighbourhoods/id/${deskid}`)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      return data.neighbourNumberOfDesk; // Return the fetched value
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function remainingDesk() {
  totalDesks(deskbooking.employeeId)
    .then((totalDesks) => {
      console.log(totalDesks); // Use the returned value here
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}


async function remainDeskBooking() {
  try {
    // Fetch total desks for each type
    const meetingTotal = await totalDesks('meeting');
    const hotdeskTotal = await totalDesks('hotdesk');
    const collabTotal = await totalDesks('collab');

    // Fetch desk bookings
    const deskBookingsResponse = await fetch('http://localhost:8080/desk-bookings/date/07.05.2024');
    const deskBookingsData = await deskBookingsResponse.json();

    // Calculate remaining desks for each type
    let meetingRemaining = meetingTotal;
    let hotdeskRemaining = hotdeskTotal;
    let collabRemaining = collabTotal;

    deskBookingsData.forEach(deskBooking => {
      switch (deskBooking.neighbourId) {
        case 'meeting':
          meetingRemaining--;
          break;
        case 'hotdesk':
          hotdeskRemaining--;
          break;
        case 'collab':
          collabRemaining--;
          break;
      }
    });

    // Update HTML with remaining desks
    document.getElementById('meeting-remaining').textContent = meetingRemaining;
    document.getElementById('hotdesk-remaining').textContent = hotdeskRemaining;
    document.getElementById('collab-remaining').textContent = collabRemaining;
  } catch (error) {
    console.error('Error fetching data:', error);
  }
}
