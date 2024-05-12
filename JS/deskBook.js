import { deskBookigPage } from "./script.js";

var BaseURL = `http://34.251.172.36:8080`;

export function joinDesk(type, name, date) {
  // console.log(type);
  switch (type) {
    case "Meeting":
      // console.log("meeting");
      createDeskBooking(3, 1, getTomorrowDate(), name, date);
      console.log("meet");
      break;
    case "Hot Desk":
      console.log("collab");
      createDeskBooking(1, 2, getTomorrowDate(), name, date);
      break;
    case "Collab":
      console.log("collab");
      createDeskBooking(1, 3, getTomorrowDate(), name, date);
      break;
  }
}

function getTomorrowDate() {
  const today = new Date();

  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const year = tomorrow.getFullYear();
  const month = String(tomorrow.getMonth() + 1).padStart(2, "0"); // Month is zero-indexed
  const day = String(tomorrow.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

async function getBookingWithDate(date) {
  let Bookings = await fetch(`${BaseURL}/desk-bookings/date/${date}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching booking data:", error);
    });
  return Bookings;
}

async function getEmployeeByName(name) {
  let employee = await fetch(`${BaseURL}/employees/name/${name}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("Error fetching booking data:", error);
    });
  return employee;
}

async function createDeskBooking(
  employeeId,
  neighbourId,
  deskBookingDate,
  name,
  tommorrowDate
) {
  const employees = await getEmployeeByName(name);
  const bookings = await getBookingWithDate(tommorrowDate);
  let flag = false;

  employees.map((employee) => {
    console.log(employee.employeeName);
    bookings.map((booking) => {
      if (employee.employeeId === booking.employeeId) {
        console.log("Your desk is already booked");
        flag = true;
        return;
      }
    });
  });

  if (!flag) {
    // // Construct the URL
    const url = `${BaseURL}/desk-bookings`;

    // Create the request body
    const requestBody = {
      method: "POST",
      headers: {
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
          throw new Error("Failed to create desk booking");
        }
        return response.json();
      })
      .then((data) => {
        window.alert("Your Desk is Booked");
        deskBookigPage();
        console.log("Desk booking created successfully:", data);
      })
      .catch((error) => {
        console.error("Error creating desk booking:", error);
      });
  }
}
