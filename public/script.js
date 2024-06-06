const countElement = document.getElementById("count");
const incrementBtn = document.getElementById("incrementBtn");

// Function to fetch current count from server
async function getCount() {
  try {
    const response = await fetch("/count");
    const data = await response.json();
    countElement.textContent = data.count;
  } catch (error) {
    console.error("Error fetching count:", error);
  }
}

// Function to increment count
async function incrementCount() {
  try {
    const response = await fetch("/increment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value: 1 }),
    });
    const data = await response.json();
    countElement.textContent = data.count;
  } catch (error) {
    console.error("Error incrementing count:", error);
  }
}

// Initialize count on page load
getCount();

// Add click event listener to increment button
incrementBtn.addEventListener("click", () => {
  incrementCount();
});
