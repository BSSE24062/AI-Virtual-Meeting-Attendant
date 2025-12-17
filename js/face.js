const video = document.getElementById("video");

navigator.mediaDevices.getUserMedia({ video: true })
.then(stream => video.srcObject = stream);

function generateAI() {
    alert("AI Attendant Generated Successfully!");
    window.location.href = "prompt.html";
}
