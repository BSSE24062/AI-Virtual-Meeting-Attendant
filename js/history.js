const meetings = JSON.parse(localStorage.getItem("meetings")) || [];
const historyDiv = document.getElementById("history");

if (meetings.length === 0) {
    historyDiv.innerHTML = "<p>No previous meetings found.</p>";
}

meetings.forEach(meeting => {
    historyDiv.innerHTML += `
        <div class="meeting-card">
            <h3>${meeting.title}</h3>
            <small>Date: ${meeting.date}</small>
            <hr>
            ${meeting.logs.map(log => `
                <p>
                    <strong>Q:</strong> ${log.question}<br>
                    <strong>A:</strong> ${log.answer}<br>
                    <small>⏱ ${log.time}</small>
                </p>
            `).join("")}
        </div>
    `;
});

function goBack() {
    window.location.href = "dashboard.html";
}
