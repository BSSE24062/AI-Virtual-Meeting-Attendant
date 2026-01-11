// TOAST NOTIFICATION SYSTEM
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? 'rgba(0, 230, 230, 0.2)' : 'rgba(255, 77, 77, 0.2)'};
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? 'rgba(0, 230, 230, 0.3)' : 'rgba(255, 77, 77, 0.3)'};
        padding: 15px 25px;
        border-radius: 12px;
        color: white;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
    `;
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// EMAIL VALIDATION
function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// PASSWORD STRENGTH CHECKER
function getPasswordStrength(password) {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/[0-9]/)) strength++;
    if (password.match(/[^a-zA-Z0-9]/)) strength++;
    return strength;
}

// SIGNUP FUNCTION

function signup(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const role = document.getElementById("role").value.trim();
    const bio = document.getElementById("bio").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Validation
    if (!name || !email || !password || !role) {
        showToast("Please fill all required fields", "error");
        return;
    }

    if (!isValidEmail(email)) {
        showToast("Please enter a valid email address", "error");
        return;
    }

    if (password.length < 6) {
        showToast("Password must be at least 6 characters long", "error");
        return;
    }

    if (password !== confirmPassword) {
        showToast("Passwords do not match", "error");
        return;
    }

    // Check if user already exists
    if (localStorage.getItem("email") === email) {
        showToast("An account with this email already exists", "error");
        return;
    }

    // Save user data
    const userData = {
        name: name,
        email: email,
        role: role,
        bio: bio || `${role} with expertise in various domains.`,
        joinDate: new Date().toISOString(),
        meetingsAttended: 0
    };

    localStorage.setItem("name", name);
    localStorage.setItem("email", email);
    localStorage.setItem("role", role);
    localStorage.setItem("bio", bio || userData.bio);
    localStorage.setItem("password", password);
    localStorage.setItem("currentUser", JSON.stringify(userData));
    localStorage.setItem("userData", JSON.stringify(userData));

    showToast("Account created successfully! Redirecting...", "success");
    
    setTimeout(() => {
        window.location.href = "login.html";
    }, 1500);
}


// LOGIN FUNCTION
function login(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (!savedEmail) {
        showToast("No account found. Please sign up first.", "error");
        setTimeout(() => {
            window.location.href = "signup.html";
        }, 2000);
        return;
    }

    if (!isValidEmail(email)) {
        showToast("Please enter a valid email address", "error");
        return;
    }

    if (email === savedEmail && password === savedPassword) {
        // Recreate currentUser object on login
        const userData = {
            name: localStorage.getItem("name"),
            email: localStorage.getItem("email"),
            role: localStorage.getItem("role"),
            bio: localStorage.getItem("bio")
        };
        localStorage.setItem("currentUser", JSON.stringify(userData));
        localStorage.setItem("isLoggedIn", "true");
        
        showToast("Login successful! Welcome back.", "success");
        
        setTimeout(() => {
            window.location.href = "dashboard.html";
        }, 1000);
    } else {
        showToast("Invalid email or password", "error");
        
        // Add shake animation to form
        const form = document.querySelector('.container');
        form.style.animation = 'shake 0.5s';
        setTimeout(() => {
            form.style.animation = '';
        }, 500);
    }
}

// Add shake animation CSS dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
    @keyframes slideIn {
        from { transform: translateX(400px); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    @keyframes slideOut {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(400px); opacity: 0; }
    }
`;
document.head.appendChild(style);