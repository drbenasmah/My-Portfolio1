// Select elements from the HTML
const gridRows = document.querySelectorAll(".grid-row");
const selectedSeatsElement = document.getElementById("selected-seats");
const totalPriceElement = document.getElementById("total-price");
const nonIcaTotalPriceElement = document.getElementById("non-ica-total-price");
const vvipSeatElement = document.getElementById("vvip-seat");
const vip1SeatElement = document.getElementById("vip1-seat");
const vip2SeatElement = document.getElementById("vip2-seat");
const normalSeatElement = document.getElementById("normal-seat");
const buyTicketButton = document.getElementById("buy-ticket-button");

// Initialize selected seat count and seat price
let selectedSeatCount = 0;
// const seatPrice = 10;

// Define seat prices for each section
const seatPrices = {
  "vvip-seat": 15, // Price for VVIP seats
  "vip1-seat": 10, // Price for VIP 1 seats
  "vip2-seat": 6, // Price for VIP 2 seats
  "normal-seat": 3.5, // Price for Normal seats
};

// Define the number of grids per row
const numGridsPerRowVIP = 8; // Adjust the number of grids per row for VIP
const numGridsPerRowNormal = 10; // Adjust the number of grids per row for Normal

// Define the number of rows and seats in each grid for regular and VIP sections
const rowsPerGrid = 4; // Number of rows in each grid for both VIP and Normal
const seatsPerRow = [3, 3, 3, 1]; // Number of seats in each row per grid for both VIP and Normal

// Initialize seat number counter
let seatNumberCounter = 1;

// Create grids with seats for VIP section (3 rows)
for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
  const gridRow = gridRows[rowIndex];

  // Determine the section class based on the row index
  let sectionClass = "";
  if (rowIndex === 0) {
    sectionClass = "vvip-seat"; // Assign VVIP class to the first row
  } else if (rowIndex === 1) {
    sectionClass = "vip1-seat"; // Assign VIP-1 class to the second row
  } else if (rowIndex === 2) {
    sectionClass = "vip2-seat"; // Assign VIP-2 class to the third row
  }

  for (let gridIndex = 0; gridIndex < numGridsPerRowVIP; gridIndex++) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add(sectionClass); // Assign the section class

    for (let rowIdx = 0; rowIdx < rowsPerGrid; rowIdx++) {
      const row = document.createElement("div");
      row.classList.add("row");

      const seatsInThisRow = seatsPerRow[rowIdx];
      for (let seatIndex = 0; seatIndex < seatsInThisRow; seatIndex++) {
        const seat = document.createElement("div");
        seat.classList.add("seat", sectionClass); // Assign the section class to the seat
        seat.addEventListener("click", (event) => {
          if (!seat.classList.contains("occupied")) {
            seat.classList.toggle("selected"); // Toggle the "selected" class

            // Check the classList to determine the section
            if (seat.classList.contains("vvip-seat")) {
              // This seat belongs to the VVIP section
              // You can handle VVIP section specific logic here
              console.log("VVIP seat clicked");
            } else if (seat.classList.contains("vip1-seat")) {
              // This seat belongs to the VIP-1 section
              // You can handle VIP-1 section specific logic here
              console.log("VIP-1 seat clicked");
            } else if (seat.classList.contains("vip2-seat")) {
              // This seat belongs to the VIP-2 section
              // You can handle VIP-2 section specific logic here
              console.log("VIP-2 seat clicked");
            }

            updateSelectedSeats();
          }
        });

        // Add seat number to each seat div
        seat.dataset.seatNumber = seatNumberCounter;

        seatNumberCounter++; // Increment seat number

        seat.classList.add("vip-seat");
        row.appendChild(seat);
      }

      container.appendChild(row);
    }

    gridRow.appendChild(container);
  }
}

// Create grids with seats for Normal section (2 rows)
for (let rowIndex = 0; rowIndex < 6; rowIndex++) {
  const gridRow = gridRows[rowIndex + 3]; // Start from rowIndex 3 for Normal section

  for (let gridIndex = 0; gridIndex < numGridsPerRowNormal; gridIndex++) {
    const container = document.createElement("div");
    container.classList.add("container");

    for (let rowIdx = 0; rowIdx < rowsPerGrid; rowIdx++) {
      const row = document.createElement("div");
      row.classList.add("row");

      const seatsInThisRow = seatsPerRow[rowIdx];
      for (let seatIndex = 0; seatIndex < seatsInThisRow; seatIndex++) {
        const seat = document.createElement("div");
        seat.classList.add("seat");
        seat.addEventListener("click", () => {
          if (!seat.classList.contains("occupied")) {
            seat.classList.toggle("selected");
            updateSelectedSeats();
          }
        });

        // Add seat number to each seat div
        seat.dataset.seatNumber = seatNumberCounter;
        // Display seat number
        seatNumberCounter++; // Increment seat number

        seat.classList.add("normal-seat");
        row.appendChild(seat);
      }

      container.appendChild(row);
    }

    gridRow.appendChild(container);
  }
}

// Function to update selected seats and total price
function updateSelectedSeats() {
  const selectedNormalSeats = document.querySelectorAll(
    ".seat.normal-seat.selected"
  );
  const selectedVVIPSeats = document.querySelectorAll(
    ".seat.vvip-seat.selected"
  );
  const selectedVIP1Seats = document.querySelectorAll(
    ".seat.vip1-seat.selected"
  );
  const selectedVIP2Seats = document.querySelectorAll(
    ".seat.vip2-seat.selected"
  );

  const selectedNormalSeatCount = selectedNormalSeats.length;
  const selectedVVIPSeatCount = selectedVVIPSeats.length;
  const selectedVIP1SeatCount = selectedVIP1Seats.length;
  const selectedVIP2SeatCount = selectedVIP2Seats.length;

  selectedSeatCount =
    selectedNormalSeatCount +
    selectedVVIPSeatCount +
    selectedVIP1SeatCount +
    selectedVIP2SeatCount;
  selectedSeatsElement.textContent = selectedSeatCount;

  let totalPrice = 0;
  let nonIcaTotalPrice = 0;

  selectedNormalSeats.forEach((seat) => {
    const seatClass = seat.classList[1]; // Get the second class, which corresponds to seat type
    const price = seatPrices[seatClass];
    totalPrice += price;
    nonIcaTotalPrice = totalPrice + 0.5;
  });

  selectedVVIPSeats.forEach((seat) => {
    const seatClass = seat.classList[1]; // Get the second class, which corresponds to seat type
    const price = seatPrices[seatClass];
    totalPrice += price;
    nonIcaTotalPrice = totalPrice + 1;
  });

  selectedVIP1Seats.forEach((seat) => {
    const seatClass = seat.classList[1]; // Get the second class, which corresponds to seat type
    const price = seatPrices[seatClass];
    totalPrice += price;
    nonIcaTotalPrice = totalPrice + 1;
  });

  selectedVIP2Seats.forEach((seat) => {
    const seatClass = seat.classList[1]; // Get the second class, which corresponds to seat type
    const price = seatPrices[seatClass];
    totalPrice += price;
    nonIcaTotalPrice = totalPrice + 1;
  });

  totalPriceElement.textContent = totalPrice;
  nonIcaTotalPriceElement.textContent = nonIcaTotalPrice;
  normalSeatElement.textContent = selectedNormalSeatCount;
  vvipSeatElement.textContent = selectedVVIPSeatCount;
  vip1SeatElement.textContent = selectedVIP1SeatCount;
  vip2SeatElement.textContent = selectedVIP2SeatCount;
}

// Add a click event listener to the button
buyTicketButton.addEventListener("click", purchaseTicket);

// Function to handle the ticket purchase
function purchaseTicket() {
  // Get the selected seats and calculate the total price
  // You can use the existing `updateSelectedSeats` function for this

  // For example, you can display an alert with the purchase details
  const selectedSeatsInfo = `Selected Seats:\nVVIP: ${selectedVVIPSeatCount}\nVIP1: ${selectedVIP1SeatCount}\nVIP2: ${selectedVIP2SeatCount}\nNormal: ${selectedNormalSeatCount}\nTotal Price: ₦${nonIcaTotalPrice}`;

  alert(`Thank you for your purchase!\n${selectedSeatsInfo}`);
}
