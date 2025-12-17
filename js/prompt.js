function savePrompt() {
    localStorage.setItem("meetingTitle", document.getElementById("title").value);
    localStorage.setItem("meetingType", document.getElementById("type").value);
    localStorage.setItem("meetingPrompt", document.getElementById("prompt").value);
    window.location.href = "meeting.html";
}
