const API_URL = "http://localhost:5000"; // Ensure correct backend URL

document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script loaded!");

    // 🔹 Handle Login Form Submission
    const loginForm = document.querySelector(".login-form");
    if (loginForm) {
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("📤 Login form submitted!");

            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorBox = document.getElementById("error-message");

            if (!email || !password) {
                errorBox.innerText = "Please fill in all fields.";
                errorBox.style.color = "red";
                return;
            }

            try {
                const res = await fetch(`${API_URL}/login`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    credentials: "include",
                    body: JSON.stringify({ email, password }),
                });

                console.log("🟢 Response received, status:", res.status);
                const data = await res.json();
                console.log("🔹 Server Response:", data);

                if (res.ok) {
                    alert("✅ Login successful!");
                    window.location.href = "dashboard.html"; // Redirect after successful login
                } else {
                    errorBox.innerText = data.error || "❌ Login failed!";
                    errorBox.style.color = "red";
                }
            } catch (error) {
                console.error("❌ Fetch Error:", error);
                errorBox.innerText = "Network error. Check if backend is running!";
                errorBox.style.color = "red";
            }
        });
    }

    // 🔹 Handle Register Form Submission
    const registerForm = document.querySelector(".register-form");
    if (registerForm) {
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();
            console.log("📤 Register form submitted!");

            const username = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const errorBox = document.getElementById("error-message");

            if (!username || !email || !password) {
                alert("❌ Please fill in all fields.");
                return;
            }

            try {
                const res = await fetch(`${API_URL}/register`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, email, password }),
                });

                console.log("🟢 Response received, status:", res.status);
                const data = await res.json();
                console.log("🔹 Server Response:", data);

                if (res.ok) {
                    alert("✅ Registration successful! Redirecting to login...");
                    window.location.href = "login.html"; // Redirect after successful registration
                } else {
                    alert("❌ Registration failed: " + (data.error || "Try again."));
                }
            } catch (error) {
                console.error("❌ Fetch Error:", error);
                alert("❌ Network error. Check if backend is running!");
            }
        });
    }
});
