var BaseURL = `http://34.251.172.36:8080`;

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


const toggle = document.getElementById("toggle-button");
const leftPanel = document.getElementById("menu");

function toggleButton(){
  var width = window.innerWidth;
  if(width <= 426){
    toggle.style.display = "block";
    leftPanel.style.display = "none";
  }
  else{
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

  window.addEventListener('resize', function() {
    toggleButton();
  });
  
  toggle.addEventListener("click",function() {
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
  let Bookings = await fetch(`${BaseURL}/desk-bookings/date/${date}`).then(
    (response) => response.json()
  )
  .catch((error) => {
    console.error("Error fetching booking data:", error);
  });;
  return Bookings;
}

async function getAllNeighbour() {
  let NeighbourHoods = await fetch(`${BaseURL}/neighbourhoods`).then(
    (response) => response.json()
  )
  .catch((error) => {
    console.error("Error fetching neighbourhood data:", error);
  });;
  return NeighbourHoods;
}

async function GetAllEmployee() {
  let Employees = await fetch(`${BaseURL}/employees`).then((response) =>
    response.json()
  )
  .catch((error) => {
    console.error("Error fetching employees data:", error);
  });;

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

async function loadDeskBooking() {

  const Bookings = await getBookingWithDate("15.02.2024");
  const NeighbourHoods = await getAllNeighbour();
  const Employees = await GetAllEmployee();

  console.log(Bookings);
  console.log(NeighbourHoods);
  console.log(Employees);

  const mainShow = document.getElementById("main-show");
  let ele = document.createElement('div');

  NeighbourHoods.map((nei) => {
    let heading = document.createElement('h3');
    heading.textContent = nei.neighbourName;
    ele.appendChild(heading)
    if (countBooking(nei.neighbourId, Bookings) > 0) {
      let innerElement = document.createElement('div')
      innerElement.classList.add("inner");
      Bookings.map((booking) => {
        if(booking.neighbourId == nei.neighbourId){
          Employees.map((emp)=>{
            if(emp.employeeId == booking.employeeId){
                let employeeNameElement = document.createElement('span');
                employeeNameElement.classList.add("name-tag")
                employeeNameElement.textContent = `@${emp.employeeName}`;
                innerElement.appendChild(employeeNameElement);
            }
          })
        }
      });
      ele.appendChild(innerElement);
    } else {
      let nothingBooked = document.createElement('p');
      let italicTxt = document.createElement('i');
      italicTxt.textContent = `No one Book the ${nei.neighbourName}`;
      nothingBooked.appendChild(italicTxt);
      ele.appendChild(nothingBooked);
    }
  });
  mainShow.appendChild(ele);
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
        fetch(`http://34.251.172.36:8080/employees/id/${deskbooking.employeeId}`)
          .then((response) => response.json())
          .then((employeeData) => {
            // Process the fetched employee data
            // console.log(employeeData);

            // Display the employee names
            const employeeName = employeeData.employeeName; 
            const empDiv = document.createElement('div')  ;
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
  const para= document.createElement('p');
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

// function toggleContent() {
// const rightPanel = document.getElementById('content');
//   if (rightPanel.style.display === 'none') {
//       rightPanel.style.display = 'block'; // Show if hidden
//   } else {
//       rightPanel.style.display = 'none'; // Hide if shown
//   }
// }

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


function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}