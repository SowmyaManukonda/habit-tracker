// Select elements
const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const errorMessage = document.getElementById("error-message");

// Check if the user is already logged in
if (localStorage.getItem("loggedInUser")) {
  window.location.href = "index.html"; // Redirect to habit tracker if logged in
}

// Sign up functionality
signupBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username && password) {
    let users = JSON.parse(localStorage.getItem("users")) || [];
    if (users.some(user => user.username === username)) {
      errorMessage.textContent = "Username already exists!";
      return;
    }
    users.push({ username, password, habits: [], streak: 0 });
    localStorage.setItem("users", JSON.stringify(users));
    errorMessage.textContent = "Sign-up successful! You can now log in.";
  } else {
    errorMessage.textContent = "Please fill in both fields!";
  }
});

// Login functionality
loginBtn.addEventListener("click", () => {
  const username = usernameInput.value.trim();
  const password = passwordInput.value.trim();

  if (username && password) {
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(user => user.username === username && user.password === password);

    if (user) {
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      window.location.href = "tracker.html"; // Redirect to habit tracker
    } else {
      errorMessage.textContent = "Invalid username or password!";
    }
  } else {
    errorMessage.textContent = "Please fill in both fields!";
  }
});
