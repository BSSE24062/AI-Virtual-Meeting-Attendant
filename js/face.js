const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const preview = document.getElementById("preview");
const statusText = document.getElementById("statusText");
const previewContainer = document.getElementById("previewContainer");

const startCameraBtn = document.getElementById("startCameraBtn");
const captureBtn = document.getElementById("captureBtn");
const retakeBtn = document.getElementById("retakeBtn");
const generateBtn = document.getElementById("generateBtn");

let stream = null;
let capturedImage = null;

// ===================================
// AUTO-START CAMERA ON LOAD
// ===================================
window.onload = function() {
    setTimeout(() => {
        startCamera();
    }, 500);
};

// ===================================
// START CAMERA
// ===================================
async function startCamera() {
    try {
        statusText.textContent = "Requesting camera access...";
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: { ideal: 1280 },
                height: { ideal: 720 },
                facingMode: "user"
            } 
        });
        
        video.srcObject = stream;
        video.style.display = "block";
        
        statusText.textContent = "✓ Camera ready! Position yourself and click capture.";
        statusText.style.color = "var(--primary)";
        
        captureBtn.style.display = "block";
        startCameraBtn.style.display = "none";
        
    } catch (error) {
        console.error("Error accessing camera:", error);
        statusText.textContent = "⚠️ Camera access denied or not available";
        statusText.style.color = "#ff4d4d";
        
        startCameraBtn.style.display = "block";
        
        showToast("Please allow camera access to continue", "error");
    }
}

// ===================================
// CAPTURE PHOTO
// ===================================
function capturePhoto() {
    // Set canvas dimensions to match video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    
    // Draw video frame to canvas
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Convert to image
    capturedImage = canvas.toDataURL('image/png');
    
    // Show preview
    preview.src = capturedImage;
    previewContainer.style.display = "block";
    
    // Hide video, show buttons
    video.style.display = "none";
    captureBtn.style.display = "none";
    retakeBtn.style.display = "block";
    generateBtn.style.display = "block";
    
    statusText.textContent = "✓ Photo captured! Review and generate your AI avatar.";
    
    // Stop camera stream
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
    }
}

// ===================================
// RETAKE PHOTO
// ===================================
function retakePhoto() {
    previewContainer.style.display = "none";
    retakeBtn.style.display = "none";
    generateBtn.style.display = "none";
    capturedImage = null;
    
    startCamera();
}

// ===================================
// GENERATE AI AVATAR
// ===================================
function generateAI() {
    if (!capturedImage) {
        showToast("Please capture a photo first", "error");
        return;
    }
    
    // Show loading state
    generateBtn.disabled = true;
    generateBtn.textContent = "⏳ Generating AI...";
    statusText.textContent = "Processing your image with AI...";
    
    // Save captured image
    localStorage.setItem("userAvatar", capturedImage);
    
    // Simulate AI processing
    setTimeout(() => {
        statusText.textContent = "✓ AI Avatar Generated Successfully!";
        showToast("AI Avatar created! Redirecting...", "success");
        
        setTimeout(() => {
            window.location.href = "prompt.html";
        }, 1500);
    }, 2000);
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
    
    let borderColor;
    if (type === 'success') borderColor = 'rgba(0, 230, 230, 0.3)';
    else if (type === 'error') borderColor = 'rgba(255, 77, 77, 0.3)';
    else borderColor = 'rgba(102, 126, 234, 0.3)';
    
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