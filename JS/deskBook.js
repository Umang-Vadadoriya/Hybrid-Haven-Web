function joinDesk(type) {
  switch (type) {
    case "Meeting":
      console.log("meeting");
      createDeskBooking(1,1,getTomorrowDate());
      break;
    case "HotDesk":
        console.log("collab");
        createDeskBooking(1,2,getTomorrowDate());
      break;
    case "Collab":
      console.log("collab");
      createDeskBooking(1,3,getTomorrowDate());
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

function createDeskBooking(employeeId, neighbourId, deskBookingDate) {
  // Construct the URL
  const url = `http://34.251.172.36:8080/desk-bookings`;

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
      console.log("Desk booking created successfully:", data);
    })
    .catch((error) => {
      console.error("Error creating desk booking:", error);
    });
}
