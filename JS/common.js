import { API_RUN,WEB_RUN } from "./URLCollection.js";
import { loadLoginPage } from "./scriptlogin.js";

var APIURL = API_RUN;

export const fetchOptions = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("access_token")}`,
    "Content-Type": "application/json",
  },
};

export async function GetAllEmployee() {
  let Employees = await fetch(`${APIURL}employees`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching employees data:", error);
    });

  return Employees;
}

export async function getEmployeeByName(name) {
  let employee = await fetch(`${APIURL}employees/name/${name}`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching booking data:", error);
    });
  return employee;
}

// get today date
const currentDate = new Date();
export const todayDate = `${currentDate
  .getDate()
  .toString()
  .padStart(2, "0")}.${(currentDate.getMonth() + 1)
  .toString()
  .padStart(2, "0")}.${currentDate.getFullYear()}`;
const deskDate = "13.02.2024";

// get tomorrow date
const tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);
export const tommorrowDate = `${tomorrow
  .getDate()
  .toString()
  .padStart(2, "0")}.${(tomorrow.getMonth() + 1)
  .toString()
  .padStart(2, "0")}.${tomorrow.getFullYear()}`;


// For Event date display formate
export function formatDate(date) {
  const originalDate = date;
  const parts = originalDate.split("-");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
}

export function toggleButton() {
  const toggle = document.getElementById("toggle-button");
  const leftPanel = document.getElementById("menu");
  const TopRight = document.getElementById("top-right");
  var width = window.innerWidth;
  if (width <= 426) {
    toggle.style.display = "block";
    leftPanel.style.display = "none";
    TopRight.classList.add("top-right-mobile");
  } else {
    toggle.style.display = "none";
    leftPanel.style.display = "block";
    TopRight.classList.remove("top-right-mobile");
    closeNav();
  }
}

export function openNav() {
  document.getElementById("mySidenav").style.width = "250px";
}

export function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

export async function getBookingWithDate(date) {
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

export async function getAllNeighbour() {
  let NeighbourHoods = await fetch(`${APIURL}neighbourhoods`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching neighbourhood data:", error);
    });
  return NeighbourHoods;
}

export function countBooking(neighbourId, Bookings) {
  let count = 0;

  Bookings.forEach((booking) => {
    if (booking.neighbourId == neighbourId) {
      count++;
    }
  });

  return count;
}

export async function getAllEvents() {
  let events = await fetch(`${APIURL}events`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching employees data:", error);
    });
  return events;
}

export async function getAllEventsEmployee() {
  let eventsEmployees = await fetch(`${APIURL}events-employee`, fetchOptions)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching employees data:", error);
    });
  return eventsEmployees;
}

export function getTomorrowDate() {
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0");
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

// format to YYYYMMDD date

export function formatDateToYYYYMMDD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// logout
export function logout() {
  const profileModal = document.getElementById("profileModal");
  if (localStorage.getItem("access_token") && localStorage.getItem("username")) {
    console.log("logout");
    localStorage.clear();
    profileModal.style.display = "none";
    loadLoginPage();
  }
  
}

// employeeEmail

export async function employeeByEmail(email){
  let employee = await fetch(`${APIURL}employeeContact/byEmail?email=${email}`, fetchOptions)
  .then((response) => response.json())
  .catch((error) => {
    console.error("Error fetching employees data:", error);
  });
  return employee;
}

// get all deskbooking

export async function getAllDeskbooking(){
  let deskbooking = await fetch(`${APIURL}desk-bookings/date/${todayDate}`, fetchOptions)
  .then((response) => response.json())
  .catch((error) => {
    console.error("Error fetching employees data:", error);
  });
  return deskbooking;
}

export async function getEmployeeById(id){
  let employee = await fetch(`${APIURL}employees/id/${id}`, fetchOptions)
  .then((response) => response.json())
  .catch((error) => {
    console.error("Error fetching employees data:", error);
  });
  return employee;
}

// get vacation employees by today date
export async function getVacationEmpByDate(){
  let employee = await fetch(`${APIURL}vacations/date/${todayDate}`, fetchOptions)
  .then((response) => response.json())
  .catch((error) => {
    console.error("Error fetching employees data:", error);
  });
  return employee;
}
