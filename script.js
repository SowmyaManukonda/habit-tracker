// Select elements
const habitInput = document.getElementById("habit-input");
const addHabitBtn = document.getElementById("add-habit-btn");
const habitTableBody = document.getElementById("habit-table-body");
const overallPercentage = document.getElementById("overall-percentage");
const overallProgressBar = document.getElementById("overall-progress-bar");
const streakRateElement = document.getElementById("streak-rate");
const logoutBtn = document.getElementById("logout-btn");

// Load user from local storage
let currentUser = JSON.parse(localStorage.getItem("loggedInUser"));

if (!currentUser) {
  window.location.href = "index.html"; // Redirect to login if no user is logged in
}

// Save habits and streak to local storage
function saveHabits() {
  localStorage.setItem("loggedInUser", JSON.stringify(currentUser));
}

// Calculate weekly progress for a habit
function calculateProgress(days) {
  const completed = days.filter((day) => day).length;
  return Math.round((completed / 7) * 100);
}

// Update streak rate
function updateStreak() {
  const streak = currentUser.streak;
  streakRateElement.textContent = streak;
}

// Update overall progress summary
function updateOverallProgress() {
  const overall = calculateOverallProgress();
  overallPercentage.textContent = `${overall}%`;
  overallProgressBar.style.width = `${overall}%`;
}

// Calculate overall progress
function calculateOverallProgress() {
  if (currentUser.habits.length === 0) return 0;

  const totalProgress = currentUser.habits.reduce((sum, habit) => sum + calculateProgress(habit.days), 0);
  return Math.round(totalProgress / currentUser.habits.length);
}

// Handle logout
logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html"; // Redirect to login page
});

// Render habits in the table
function renderHabits() {
  habitTableBody.innerHTML = ""; // Clear current habits
  currentUser.habits.forEach((habit, index) => {
    const progress = calculateProgress(habit.days);
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${habit.name}</td>
      ${[...Array(7)]
        .map(
          (_, day) =>
            `<td><input type="checkbox" data-index="${index}" data-day="${day}" ${
              habit.days[day] ? "checked" : ""
            } /></td>`
        )
        .join("")}
      <td><span class="progress-indicator">${progress}%</span></td>
      <td><button class="delete-btn" data-index="${index}">Delete</button></td>
    `;
    habitTableBody.appendChild(row);
  });

  updateOverallProgress();
  updateStreak();
}

// Add a new habit
addHabitBtn.addEventListener("click", () => {
  const habitName = habitInput.value.trim();
  if (habitName) {
    currentUser.habits.push({ name: habitName, days: Array(7).fill(false) });
    saveHabits();
    renderHabits();
    habitInput.value = ""; // Clear input field
  } else {
    alert("Please enter a habit name!");
  }
});

// Handle checkbox and delete button clicks
habitTableBody.addEventListener("click", (e) => {
  if (e.target.type === "checkbox") {
    const index = e.target.getAttribute("data-index");
    const day = e.target.getAttribute("data-day");
    currentUser.habits[index].days[day] = e.target.checked;
    saveHabits();
    renderHabits();
  } else if (e.target.classList.contains("delete-btn")) {
    const index = e.target.getAttribute("data-index");
    currentUser.habits.splice(index, 1); // Remove habit
    saveHabits();
    renderHabits();
  }
});

// Initial render
renderHabits();

