// const buttons = document.querySelectorAll('button');
// const mainContent = document.getElementById('main-content');

// buttons.forEach(button => {
//   button.addEventListener('click', () => {
//     let content;
//     switch (button.id) {
//       case 'home-btn':
//         content = '<p>Welcome to the home page!</p>';
//         break;
//       case 'about-btn':
//         content = '<p>Learn more about us on the about page!</p>';
//         break;
//       case 'contact-btn':
//         content = '<p>Get in touch with us on the contact page!</p>';
//         break;
//     }
//     mainContent.innerHTML = content;
//   });
// });

// document.addEventListener('DOMContentLoaded', function () {
//   const contentDiv = document.getElementById('content');
//   const homeOption = document.getElementById('home');
//   const detailsOption = document.getElementById('details');
//   const aboutOption = document.getElementById('about');

//   homeOption.addEventListener('click', function () {
//     contentDiv.innerHTML = `
//       <h2>Welcome to Home!</h2>
//       <p>This is the home page content.</p>
//     `;
//   });

//   detailsOption.addEventListener('click', function () {
//     contentDiv.innerHTML = `
//       <h2>Details</h2>
//       <p>This is the details page content.</p>
//     `;
//   });

//   aboutOption.addEventListener('click', function () {
//     contentDiv.innerHTML = `
//       <h2>About</h2>
//       <p>This is the about page content.</p>
//     `;
//   });
// });

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
const tommorrowDate = `${tomorrow.getDate().toString().padStart(2, '0')}.${(tomorrow.getMonth() + 1).toString().padStart(2, '0')}.${tomorrow.getFullYear()}`;

indexPage();

document.addEventListener("DOMContentLoaded", function () {
  const contentDiv = document.getElementById("content");
  const homeOption = document.getElementById("home");
  const deskbookingOption = document.getElementById("deskbooking");
  const messagesOption = document.getElementById("messages");
  const aboutOption = document.getElementById("about");

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
    </div>
    <div>
      <h3>Hot Desk</h3>
      <div id="hotdesk-content"></div>
    </div>
    <div>
      <h3>Collab</h3>
      <div id="collab-content"></div>
    </div>
  `;
  contentDiv.innerHTML = html;
  loadDeskBooking();
}

function loadDeskBooking() {
  const meetingContentDiv = document.getElementById("meeting-content");
  const hotdeskContentDiv = document.getElementById("hotdesk-content");
  const collabContentDiv = document.getElementById("collab-content");

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
                const employeeNameElement = document.createElement("span");
                employeeNameElement.classList.add("name-tag")
                employeeNameElement.textContent = `@${employeeName} `;
                switch (neighbourName) {
                  case "Meeting":
                    meetingContentDiv.appendChild(employeeNameElement);
                    break;
                  case "Hot Desk":
                    hotdeskContentDiv.appendChild(employeeNameElement);
                    break;
                  case "Collab":
                    collabContentDiv.appendChild(employeeNameElement);
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

}

// Home + indexpage

function loadHomePage() {
  const officeContentDiv = document.getElementById("office-content");
  const vacationContentDiv = document.getElementById("vacation-content");

  fetch(`http://34.251.172.36:8080/desk-bookings/date/07.05.2024`)
    .then((response) => response.json()) // Assuming response is JSON
    .then((data) => {
      // console.log(data);
      data.forEach((deskbooking, index) => {
        fetch(`http://34.251.172.36:8080/employees/id/${deskbooking.employeeId}`)
          .then((response) => response.json())
          .then((employeeData) => {
            // Process the fetched employee data
            // console.log(employeeData);

            // Display the employee names
            const employeeName = employeeData.employeeName; 
            const employeeNameElement = document.createElement("span");
            // const parantDiv = document.createElement("div");
            employeeNameElement.classList.add("name-tag");
            employeeNameElement.textContent = `@${employeeName} `;
            officeContentDiv.appendChild(employeeNameElement);
          })
          .catch((error) => {
            console.error("Error fetching employee data:", error);
          });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

  fetch(`http://34.251.172.36:8080/vacations/date/16.02.2023`)
    .then((response) => response.json()) 
    .then((data) => {
      // console.log(data);
      data.forEach((vacations) => {
        // console.log(vacations);
        const employeedata = vacations.employeeByEmployeeId;
        console.log(employeedata.employeeName);
        const employeeName = employeedata.employeeName;
        const employeeNameElement = document.createElement("span");
        employeeNameElement.classList.add("name-tag");
        employeeNameElement.textContent = `@${employeeName} `;
        vacationContentDiv.appendChild(employeeNameElement);
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function indexPage() {
  const contentDiv = document.getElementById("content");
  const para= document.createElement('p');
  const html = `<h2>Welcome to HybridHaven!</h2>
  <h3>Today</h2><hr>
    <div>
      <div class="office flex-con">
        <div><img src="../image/office.png" alt="office Image"></div>
        <div> Office</div>
      </div>
      <div id="office-content">
      <p><i>Work from Office</i></p>
      </div>
      <br>
    </div>
  <div>
    <div class="vacation flex-con">
      <div><img src="../image/vacation.jpg" alt="Vacation Image"></div>
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
}

// for Home Content
// <div>
//     <div class="home flex-con">
//       <div><img src="../image/home.jpg" alt="Home Image"></div>
//       <div> Home</div>
//     </div>
//     <div id="home-content">
//       <p>jbjbjbb</p>
//     </div>
//     <br>
//   </div>
