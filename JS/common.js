import { API_RUN } from "./URLCollection.js";

var APIURL = API_RUN;

export const fetchOptions = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
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

const currentDate = new Date();
export const todayDate = `${currentDate
  .getDate()
  .toString()
  .padStart(2, "0")}.${(currentDate.getMonth() + 1)
  .toString()
  .padStart(2, "0")}.${currentDate.getFullYear()}`;
const deskDate = "13.02.2024";

const tomorrow = new Date(currentDate);
tomorrow.setDate(currentDate.getDate() + 1);
export const tommorrowDate = `${tomorrow
  .getDate()
  .toString()
  .padStart(2, "0")}.${(tomorrow.getMonth() + 1)
  .toString()
  .padStart(2, "0")}.${tomorrow.getFullYear()}`;

export function formatDate(date) {
  const originalDate = date;
  const parts = originalDate.split("-");
  const formattedDate = `${parts[2]}-${parts[1]}-${parts[0]}`;
  return formattedDate;
}

const toggle = document.getElementById("toggle-button");
const leftPanel = document.getElementById("menu");

export function toggleButton() {
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
