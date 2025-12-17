// ===================================
// LOAD MEETING HISTORY
// ===================================
let allMeetings = [];

window.onload = function() {
    loadMeetings();
};

function loadMeetings() {
    const meetings = JSON.parse(localStorage.getItem("meetings")) || [];
    allMeetings = meetings;
    const historyDiv = document.getElementById("history");
    const emptyState = document.getElementById("emptyState");
    
    // Update stats
    document.getElementById("totalMeetings").textContent = meetings.length;
    
    let totalQuestions = 0;
    meetings.forEach(meeting => {
        totalQuestions += meeting.logs ? meeting.logs.length : 0;
    });
    document.getElementById("totalQuestions").textContent = totalQuestions;
    
    // Display meetings or empty state
    if (meetings.length === 0) {
        historyDiv.style.display = "none";
        emptyState.style.display = "block";
        return;
    }
    
    historyDiv.style.display = "block";
    emptyState.style.display = "none";
    
    // Sort meetings by date (newest first)
    meetings.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    displayMeetings(meetings);
}

// ===================================
// DISPLAY MEETINGS
// ===================================
function displayMeetings(meetings) {
    const historyDiv = document.getElementById("history");
    historyDiv.innerHTML = "";
    
    meetings.forEach((meeting, index) => {
        const meetingCard = document.createElement("div");
        meetingCard.className = "meeting-card";
        meetingCard.style.cssText = `
            animation: slideUp 0.4s ease-out;
            animation-delay: ${index * 0.1}s;
            animation-fill-mode: both;
        `;
        
        const meetingType = meeting.type || "General";
        const questionCount = meeting.logs ? meeting.logs.length : 0;
        
        meetingCard.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                <div>
                    <h3 style="color: var(--primary); margin: 0 0 5px 0; font-size: 20px;">
                        ${meeting.title}
                    </h3>
                    <div style="display: flex; gap: 15px; flex-wrap: wrap;">
                        <span style="font-size: 13px; color: var(--text-dim);">
                            📅 ${meeting.date}
                        </span>
                        <span style="font-size: 13px; color: var(--text-dim);">
                            🏷️ ${meetingType}
                        </span>
                        <span style="font-size: 13px; color: var(--text-dim);">
                            💬 ${questionCount} questions
                        </span>
                    </div>
                </div>
                <button onclick="deleteMeeting(${index})" style="width: auto; padding: 8px 16px; background: rgba(255, 77, 77, 0.2); border: 1px solid rgba(255, 77, 77, 0.3); font-size: 13px;">
                    🗑️ Delete
                </button>
            </div>
            
            <hr style="border: none; border-top: 1px solid var(--glass-border); margin: 15px 0;">
            
            <div id="logs-${index}">
                ${meeting.logs && meeting.logs.length > 0 
                    ? meeting.logs.map((log, logIndex) => `
                        <div style="margin: 15px 0; padding: 15px; background: rgba(0, 0, 0, 0.3); border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.05);">
                            <div style="margin-bottom: 10px;">
                                <strong style="color: var(--primary); font-size: 13px;">QUESTION:</strong>
                                <p style="margin: 5px 0 0 0; color: white; font-size: 14px;">
                                    ${log.question}
                                </p>
                            </div>
                            <div style="margin-bottom: 5px;">
                                <strong style="color: var(--secondary); font-size: 13px;">RESPONSE:</strong>
                                <p style="margin: 5px 0 0 0; color: rgba(255, 255, 255, 0.85); font-size: 14px;">
                                    ${log.answer}
                                </p>
                            </div>
                            <div style="text-align: right; margin-top: 8px;">
                                <small style="color: var(--text-dim); font-size: 12px;">⏱ ${log.time}</small>
                            </div>
                        </div>
                    `).join("")
                    : '<p style="text-align: center; color: var(--text-dim); padding: 20px;">No questions logged for this meeting.</p>'
                }
            </div>
        `;
        
        historyDiv.appendChild(meetingCard);
    });
}

// ===================================
// SEARCH/FILTER MEETINGS
// ===================================
function filterMeetings() {
    const searchTerm = document.getElementById("searchInput").value.toLowerCase();
    
    if (!searchTerm) {
        displayMeetings(allMeetings);
        return;
    }
    
    const filtered = allMeetings.filter(meeting => 
        meeting.title.toLowerCase().includes(searchTerm) ||
        (meeting.type && meeting.type.toLowerCase().includes(searchTerm))
    );
    
    if (filtered.length === 0) {
        document.getElementById("history").innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--text-dim);">
                <p>No meetings match your search: "${searchTerm}"</p>
            </div>
        `;
    } else {
        displayMeetings(filtered);
    }
}

// ===================================
// DELETE MEETING
// ===================================
function deleteMeeting(index) {
    if (!confirm("Are you sure you want to delete this meeting record?")) {
        return;
    }
    
    const meetings = JSON.parse(localStorage.getItem("meetings")) || [];
    meetings.splice(index, 1);
    localStorage.setItem("meetings", JSON.stringify(meetings));
    
    showToast("Meeting deleted successfully", "success");
    loadMeetings();
}

// ===================================
// NAVIGATION
// ===================================
function goBack() {
    window.location.href = "dashboard.html";
}

// ===================================
// TOAST NOTIFICATION
// ===================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    
    let bgColor = type === 'success' ? 'rgba(0, 230, 230, 0.2)' : 'rgba(255, 77, 77, 0.2)';
    let borderColor = type === 'success' ? 'rgba(0, 230, 230, 0.3)' : 'rgba(255, 77, 77, 0.3)';
    
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${bgColor};
        backdrop-filter: blur(20px);
        border: 1px solid ${borderColor};
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
    @keyframes slideUp {
        from { 
            opacity: 0; 
            transform: translateY(20px); 
        }
        to { 
            opacity: 1; 
            transform: translateY(0); 
        }
    }
`;
document.head.appendChild(style);