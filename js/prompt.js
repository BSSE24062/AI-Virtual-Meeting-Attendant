// ===================================
// TEMPLATE SUGGESTIONS
// ===================================
const templates = {
    intro: `Be warm and professional during introductions. Emphasize your expertise and willingness to collaborate. Keep tone friendly yet business-appropriate.`,
    
    update: `Focus on positive progress updates. Mention that detailed reports will follow. Be solution-oriented and proactive in addressing concerns.`,
    
    discussion: `Engage actively in discussions. Take detailed notes for follow-up. Be collaborative and open to ideas. Confirm action items before meeting ends.`
};

function useTemplate(type) {
    const promptField = document.getElementById("prompt");
    
    let templateText = templates[type];
    
    promptField.value = templateText;
    promptField.focus();
    
    showToast("Template applied! These are guidelines, not exact words.", "success");
}

// ===================================
// SAVE PROMPT AND START MEETING
// ===================================
function savePrompt(event) {
    event.preventDefault();
    
    const title = document.getElementById("title").value.trim();
    const type = document.getElementById("type").value;
    const prompt = document.getElementById("prompt").value.trim();
    
    if (!title || !type) {
        showToast("Please fill in all required fields", "error");
        return;
    }
    
    // Save meeting configuration
    const meetingConfig = {
        title: title,
        type: type,
        prompt: prompt || "Act professionally and represent me well in this meeting.",
        date: new Date().toISOString(),
        startTime: new Date().toLocaleTimeString()
    };
    
    localStorage.setItem("meetingTitle", title);
    localStorage.setItem("meetingType", type);
    localStorage.setItem("meetingPrompt", prompt);
    localStorage.setItem("currentMeetingConfig", JSON.stringify(meetingConfig));
    
    showToast("Meeting configured! Starting...", "success");
    
    setTimeout(() => {
        window.location.href = "meeting.html";
    }, 1000);
}

// ===================================
// TOAST NOTIFICATION
// ===================================
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
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
`;
document.head.appendChild(style);