document.getElementById("userName").innerText =
    localStorage.getItem("name");

function startMeeting() {
    window.location.href = "prompt.html";
}

function viewHistory() {
    window.location.href = "history.html";
}

function logout() {
    localStorage.clear();
    window.location.href = "index.html";
}
