// ===================================
// GLOBAL VARIABLES
// ===================================
const userName = localStorage.getItem("name") || "User";
const meetingTitle = localStorage.getItem("meetingTitle") || "Untitled Meeting";
const meetingType = localStorage.getItem("meetingType") || "General";
const meetingPrompt = localStorage.getItem("meetingPrompt") || "";
const userRole = localStorage.getItem("role") || "Professional";
const userBio = localStorage.getItem("bio") || "";

let questionCounter = 0;
let meetingStartTime = Date.now();
let durationInterval;

// ===================================
// SPEECH RECOGNITION SETUP
// ===================================
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
} else {
    document.getElementById("browserNotice").style.display = "block";
}

// ===================================
// PAGE LOAD
// ===================================
window.onload = function() {
    // Display meeting info
    document.getElementById("meetingTitle").innerText = meetingTitle;
    document.getElementById("meetingType").innerText = `${meetingType} Meeting`;
    document.getElementById("avatarName").innerText = userName + "'s";
    
    // Load user avatar if available
    const userAvatar = localStorage.getItem("userAvatar");
    if (userAvatar) {
        document.getElementById("avatarImg").src = userAvatar;
    }
    
    // Create currentUser object if doesn't exist
    if (!localStorage.getItem("currentUser")) {
        const currentUser = {
            name: userName,
            email: localStorage.getItem("email") || "",
            role: userRole,
            bio: userBio
        };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
    }
    
    // Start duration timer
    startDurationTimer();
};

// ===================================
// DURATION TIMER
// ===================================
function startDurationTimer() {
    durationInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - meetingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60);
        const seconds = elapsed % 60;
        document.getElementById("duration").textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }, 1000);
}

// ===================================
// ASK QUESTION (VOICE)
// ===================================
function askQuestion() {
    if (!recognition) {
        showToast("Voice recognition not supported. Please use Chrome or Edge.", "error");
        return;
    }
    
    const voiceBtn = document.getElementById("voiceBtn");
    const lastQuestion = document.getElementById("lastQuestion");
    const aiResponse = document.getElementById("aiResponse");
    
    lastQuestion.innerText = "🎤 Listening... Please speak now";
    lastQuestion.style.color = "#ff4d4d";
    aiResponse.innerText = "Waiting for your question...";
    
    voiceBtn.disabled = true;
    voiceBtn.textContent = "🎤 Listening...";
    voiceBtn.style.opacity = "0.7";
    
    try {
        recognition.start();
    } catch (error) {
        console.log("Recognition error:", error);
        voiceBtn.disabled = false;
        voiceBtn.textContent = "🎤 Ask Question";
        voiceBtn.style.opacity = "1";
    }
}

// ===================================
// SPEECH RECOGNITION EVENTS
// ===================================
if (recognition) {
    recognition.onresult = function(event) {
        const question = event.results[0][0].transcript;
        const lastQuestion = document.getElementById("lastQuestion");
        const aiResponse = document.getElementById("aiResponse");
        const voiceBtn = document.getElementById("voiceBtn");
        
        lastQuestion.innerText = question;
        lastQuestion.style.color = "white";
        
        // Generate AI response
        const response = generateAIResponse(question);
        aiResponse.innerText = response;
        
        // Speak response
        speakResponse(response);
        
        // Save to history
        saveToHistory(question, response);
        
        // Update counter
        questionCounter++;
        document.getElementById("questionCount").textContent = questionCounter;
        
        // Reset button
        voiceBtn.disabled = false;
        voiceBtn.textContent = "🎤 Ask Question";
        voiceBtn.style.opacity = "1";
    };
    
    recognition.onerror = function(event) {
        const lastQuestion = document.getElementById("lastQuestion");
        const aiResponse = document.getElementById("aiResponse");
        const voiceBtn = document.getElementById("voiceBtn");
        
        console.error("Speech recognition error:", event.error);
        
        if (event.error === 'not-allowed') {
            lastQuestion.innerText = "⚠️ Microphone access denied";
            aiResponse.innerText = "Please allow microphone access in your browser settings.";
            showToast("Microphone access required", "error");
        } else if (event.error === 'no-speech') {
            lastQuestion.innerText = "⚠️ No speech detected";
            aiResponse.innerText = "Please speak clearly and try again.";
        } else {
            lastQuestion.innerText = "⚠️ Error occurred";
            aiResponse.innerText = "Please try again.";
        }
        
        lastQuestion.style.color = "#ff4d4d";
        voiceBtn.disabled = false;
        voiceBtn.textContent = "🎤 Ask Question";
        voiceBtn.style.opacity = "1";
    };
    
    recognition.onend = function() {
        const voiceBtn = document.getElementById("voiceBtn");
        voiceBtn.disabled = false;
        voiceBtn.textContent = "🎤 Ask Question";
        voiceBtn.style.opacity = "1";
    };
}

// ===================================
// GENERATE AI RESPONSE
// ===================================
function generateAIResponse(question) {
    const user = JSON.parse(localStorage.getItem("currentUser"));
    const name = user?.name || userName;
    const role = user?.role || userRole;
    const bio = user?.bio || userBio;
    
    question = question.toLowerCase();
    
    // NOTE: The meetingPrompt is stored for context but we use it as guidance,
    // not as direct responses. The AI generates natural answers based on profile.
    
    // Introduction - prioritize natural introduction over raw prompt
    if (question.includes("introduce") || question.includes("introduction") || question.includes("tell us about yourself")) {
        let intro = `Hello everyone, I'm ${name}, and I work as a ${role}. `;
        if (bio) {
            intro += `${bio} `;
        }
        intro += `I'm excited to be part of this ${meetingType.toLowerCase()} meeting. Thank you for having me.`;
        return intro;
    }
    
    // Who are you
    if (question.includes("who are you") || question.includes("who r u") || question.includes("what's your name")) {
        return `I'm ${name}'s AI virtual meeting assistant. I'm representing ${name} in this meeting today.`;
    }
    
    // Your name
    if (question.includes("your name")) {
        return `My name is ${name}, and I'm attending virtually through my AI assistant.`;
    }
    
    // Status/Progress
    if (question.includes("status") || question.includes("update") || question.includes("progress") || question.includes("how are things")) {
        return `Everything is progressing well from ${name}'s side. All tasks are on track, and I'll provide a detailed status report after this meeting.`;
    }
    
    // Availability
    if (question.includes("available") || question.includes("free") || question.includes("when can")) {
        return `${name} is currently unavailable, which is why I'm attending on their behalf. I'll relay all important information, and ${name} will follow up directly soon.`;
    }
    
    // Agreement/Confirmation
    if (question.includes("agree") || question.includes("okay") || question.includes("sounds good") || question.includes("confirm")) {
        return `Yes, I agree with that approach. ${name} will review the details and confirm any specifics needed.`;
    }
    
    // Thank you
    if (question.includes("thank") || question.includes("thanks")) {
        return `You're welcome! ${name} appreciates the opportunity to participate.`;
    }
    
    // Questions about the meeting
    if (question.includes("meeting about") || question.includes("topic") || question.includes("agenda")) {
        return `This is a ${meetingType.toLowerCase()} meeting titled "${meetingTitle}". ${name} is here to discuss and contribute to the topics at hand.`;
    }
    
    // Technical questions
    if (question.includes("technical") || question.includes("detail") || question.includes("specific") || question.includes("how does")) {
        return `That's a great technical question. I'll make note of it and ${name} will provide detailed technical information after the meeting.`;
    }
    
    // Timeline questions
    if (question.includes("when") || question.includes("deadline") || question.includes("timeline")) {
        return `I'll note this timeline question. ${name} will review the schedule and provide specific dates in a follow-up.`;
    }
    
    // Opinion/Thoughts
    if (question.includes("think") || question.includes("opinion") || question.includes("thoughts") || question.includes("what do you")) {
        return `${name} believes this is an important topic worth discussing. I'll note your question, and ${name} will share detailed thoughts in a follow-up.`;
    }
    
    // Default response
    return `That's a good point. I've noted it, and ${name} will follow up with more details after the meeting. Is there anything else I can help clarify?`;
}

// ===================================
// TEXT TO SPEECH
// ===================================
function speakResponse(text) {
    if (!('speechSynthesis' in window)) return;
    
    // Cancel any ongoing speech
    window.speechSynthesis.cancel();
    
    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = "en-US";
    speech.rate = 0.95;
    speech.pitch = 1;
    speech.volume = 1;
    
    window.speechSynthesis.speak(speech);
}

// ===================================
// SAVE TO HISTORY
// ===================================
function saveToHistory(question, answer) {
    const meetings = JSON.parse(localStorage.getItem("meetings")) || [];
    
    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    
    // Find or create current meeting
    let currentMeeting = meetings.find(m => 
        m.title === meetingTitle && 
        m.date.includes(currentDate)
    );
    
    if (!currentMeeting) {
        currentMeeting = {
            title: meetingTitle,
            type: meetingType,
            date: `${currentDate} at ${currentTime}`,
            logs: []
        };
        meetings.push(currentMeeting);
    }
    
    currentMeeting.logs.push({
        question: question,
        answer: answer,
        time: currentTime
    });
    
    localStorage.setItem("meetings", JSON.stringify(meetings));
}

// ===================================
// END MEETING
// ===================================
function endMeeting() {
    if (confirm("Are you sure you want to end this meeting?")) {
        clearInterval(durationInterval);
        
        // Update meeting count
        const meetings = JSON.parse(localStorage.getItem("meetings")) || [];
        const userData = JSON.parse(localStorage.getItem("userData")) || {};
        userData.meetingsAttended = meetings.length;
        localStorage.setItem("userData", JSON.stringify(userData));
        
        showToast("Meeting ended successfully!", "success");
        
        setTimeout(() => {
            window.location.href = "history.html";
        }, 1000);
    }
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
`;
document.head.appendChild(style);