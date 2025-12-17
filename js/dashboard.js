// ===================================
// CHECK AUTHENTICATION
// ===================================
window.onload = function() {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    
    if (!isLoggedIn) {
        window.location.href = "index.html";
        return;
    }

    loadUserData();
};

// ===================================
// LOAD USER DATA
// ===================================
function loadUserData() {
    const name = localStorage.getItem("name") || "User";
    const role = localStorage.getItem("role") || "Professional";
    const meetings = JSON.parse(localStorage.getItem("meetings")) || [];

    document.getElementById("userName").innerText = name;
    document.getElementById("userRole").innerText = role;
    document.getElementById("meetingCount").innerText = meetings.length;

    // Animate numbers
    animateValue("meetingCount", 0, meetings.length, 1000);
}

// ===================================
// ANIMATE NUMBER COUNTER
// ===================================
function animateValue(id, start, end, duration) {
    const element = document.getElementById(id);
    if (!element) return;
    
    const range = end - start;
    const increment = range / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            element.textContent = end;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ===================================
// NAVIGATION FUNCTIONS
// ===================================
function startMeeting() {
    window.location.href = "face-scan.html";
}

function viewHistory() {
    window.location.href = "history.html";
}

function viewProfile() {
    // Show user profile in a modal or new page
    showToast("Profile settings coming soon!", "info");
}

function logout() {
    if (confirm("Are you sure you want to logout?")) {
        localStorage.removeItem("isLoggedIn");
        showToast("Logged out successfully", "success");
        
        setTimeout(() => {
            window.location.href = "index.html";
        }, 1000);
    }
}

// ===================================
// TOAST NOTIFICATION
// ===================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let bgColor;
    if (type === 'success') bgColor = 'rgba(0, 230, 230, 0.2)';
    else if (type === 'error') bgColor = 'rgba(255, 77, 77, 0.2)';
    else bgColor = 'rgba(102, 126, 234, 0.2)';
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        backdrop-filter: blur(20px);
        border: 1px solid ${type === 'success' ? 'rgba(0, 230, 230, 0.3)' : type === 'error' ? 'rgba(255, 77, 77, 0.3)' : 'rgba(102, 126, 234, 0.3)'};
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

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
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