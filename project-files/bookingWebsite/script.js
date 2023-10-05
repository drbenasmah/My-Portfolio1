// Select elements from the HTML
const gridRows = document.querySelectorAll(".grid-row");
const selectedSeatsElement = document.getElementById("selected-seats");
const totalPriceElement = document.getElementById("total-price");

// Initialize selected seat count and seat price
let selectedSeatCount = 0;
const seatPrice = 10;

// Define the number of grids per row
const numGridsPerRowVIP = 8; // Adjust the number of grids per row for VIP
const numGridsPerRowNormal = 10; // Adjust the number of grids per row for Normal

// Define the number of rows and seats in each grid for regular and VIP sections
const rowsPerGrid = 4; // Number of rows in each grid for both VIP and Normal
const seatsPerRow = [3, 3, 3, 1]; // Number of seats in each row per grid for both VIP and Normal

// Initialize seat number counter
let seatNumberCounter = 1;

// Create grids with seats for VIP section (3 rows)
for (let rowIndex = 3; rowIndex < 6; rowIndex++) {
  const gridRow = gridRows[rowIndex - 3];

  for (let gridIndex = 0; gridIndex < numGridsPerRowVIP; gridIndex++) {
    const container = document.createElement("div");
    container.classList.add("container");
    container.classList.add("vip");

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
for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
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

        row.appendChild(seat);
      }

      container.appendChild(row);
    }

    gridRow.appendChild(container);
  }
}

// Function to update selected seats and total price
function updateSelectedSeats() {
  const selectedSeats = document.querySelectorAll(".seat.selected");
  selectedSeatCount = selectedSeats.length;
  selectedSeatsElement.textContent = selectedSeatCount;
  totalPriceElement.textContent = selectedSeatCount * seatPrice;
}
