function signup() {
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const role = document.getElementById("role").value;
    const bio = document.getElementById("bio").value;
    const password = document.getElementById("password").value;

    if (!email || !password) {
        alert("Email and Password are required");
        return;
    }

    if (!name) {
        alert("Name is required");
        return;
    }

    // Save individual fields
    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    localStorage.setItem("bio", bio);
    localStorage.setItem("password", password);

    // Create currentUser object for meeting.js
    const currentUser = {
        name: name,
        email: email,
        role: role,
        bio: bio
    };
    localStorage.setItem("currentUser", JSON.stringify(currentUser));

    alert("Account created successfully!");
    window.location.href = "login.html";
}

function login() {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (!savedEmail) {
        alert("No account found. Please sign up first.");
        return;
    }

    if (email === savedEmail && password === savedPassword) {
        // Recreate currentUser object on login
        const currentUser = {
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            role: localStorage.getItem("role"),
            bio: localStorage.getItem("bio")
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        
        window.location.href = "face-scan.html";
    } else {
        alert("Invalid email or password");
    }
}