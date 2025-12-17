// ===================================
// LOAD USER & MEETING INFO ON PAGE LOAD
// ===================================
const userName = localStorage.getItem("name") || "the user";
const meetingTitle = localStorage.getItem("meetingTitle") || "Untitled Meeting";

window.onload = () => {
    document.getElementById("meetingTitle").innerText = meetingTitle;
};

// ===================================
// AI RESPONSE TEMPLATES (DYNAMIC)
// ===================================
const responses = {
    "hello": () =>
        `Hello everyone! I am the AI-based virtual meeting assistant representing ${userName}.`,

    "introduce": () =>
        `Hello everyone, my name is ${userName}. I am currently unavailable, so my AI assistant is attending this meeting on my behalf.`,

    "who are you": () =>
        `I am an AI-powered virtual meeting attendant acting on behalf of ${userName}.`,

    "what are you doing": () =>
        `I am attending this meeting virtually for ${userName} and responding based on predefined instructions and prior context.`,

    "what is this meeting about": () =>
        `This meeting is titled "${meetingTitle}" and has been configured by ${userName}.`
};

// ===================================
// ASK QUESTION FUNCTION
// ===================================
// ===============================
// VOICE RECOGNITION SETUP
// ===============================
const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const recognition = new SpeechRecognition();
recognition.lang = "en-US";
recognition.continuous = false;
recognition.interimResults = false;

// UI elements
const lastQuestion = document.getElementById("lastQuestion");
const aiResponse = document.getElementById("aiResponse");

// ===============================
// ASK QUESTION (VOICE)
// ===============================
function askQuestion() {
  lastQuestion.innerText = "Listening...";
  aiResponse.innerText = "Waiting for your question...";

  recognition.start();
}

// ===============================
// ON SPEECH RESULT
// ===============================
recognition.onresult = function (event) {
  const question = event.results[0][0].transcript;

  lastQuestion.innerText = question;

  const response = generateAIResponse(question);
  aiResponse.innerText = response;

  speakResponse(response);
  saveToHistory(question, response);
};

// ===============================
// ERROR HANDLING
// ===============================
recognition.onerror = function () {
  lastQuestion.innerText = "Voice not detected";
  aiResponse.innerText = "Please try again.";
};

// ===============================
// AI RESPONSE LOGIC (DEMO)
// ===============================
function generateAIResponse(question) {
  const user = JSON.parse(localStorage.getItem("currentUser"));

  const name = user?.name || "I";

  question = question.toLowerCase();

  if (question.includes("introduce")) {
    return `Hello everyone, I am ${name}. I am attending this meeting virtually. Thank you for having me.`;
  }

  if (question.includes("who are you")) {
    return `I am ${name}'s AI virtual meeting assistant.`;
  }

  if (question.includes("status")) {
    return `Everything is on track from my side.`;
  }

  return "That is noted. I will follow up on this after the meeting.";
}

// ===============================
// TEXT TO SPEECH
// ===============================
function speakResponse(text) {
  const speech = new SpeechSynthesisUtterance(text);
  speech.lang = "en-US";
  speech.rate = 1;
  speech.pitch = 1;

  window.speechSynthesis.speak(speech);
}


// ===================================
// TEXT TO SPEECH FUNCTION
// ===================================
function speak(text) {
    if (!("speechSynthesis" in window)) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1;
    utterance.pitch = 1;
    speechSynthesis.speak(utterance);
}
