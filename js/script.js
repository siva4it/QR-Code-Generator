// DOM Elements
const qrText = document.getElementById('qr-text');
const qrSize = document.getElementById('qr-size');
const qrColor = document.getElementById('qr-color');
const qrBgColor = document.getElementById('qr-bg-color');
const qrErrorCorrection = document.getElementById('qr-error-correction');
const generateBtn = document.getElementById('generate-btn');
const qrOutput = document.getElementById('qr-output');
const downloadSection = document.getElementById('download-section');
const downloadPngBtn = document.getElementById('download-png');
const downloadSvgBtn = document.getElementById('download-svg');
const exampleBtns = document.querySelectorAll('.example-btn');

// State
let currentQRCode = null;
let currentText = '';

// Global initialization function
function initializeApp() {
    console.log('Initializing app...');
    
    // Check if QRCode library is available
    if (typeof QRCode === 'undefined') {
        console.error('QRCode library not loaded!');
        showError('QRCode library failed to load. Please refresh the page.');
        return;
    }
    
    console.log('QRCode library loaded successfully');
    
    try {
        setupEventListeners();
        setupExampleButtons();
        
        // Auto-generate QR code when text changes (with debounce)
        let debounceTimer;
        qrText.addEventListener('input', function() {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                if (qrText.value.trim()) {
                    generateQRCode();
                } else {
                    showPlaceholder();
                }
            }, 500);
        });
        
        console.log('App initialized successfully');
    } catch (error) {
        console.error('Error initializing app:', error);
        showError('Failed to initialize app: ' + error.message);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

// Setup event listeners
function setupEventListeners() {
    generateBtn.addEventListener('click', generateQRCode);
    downloadPngBtn.addEventListener('click', () => downloadQRCode('png'));
    downloadSvgBtn.addEventListener('click', () => downloadQRCode('svg'));
    
    // Auto-generate when options change
    [qrSize, qrColor, qrBgColor, qrErrorCorrection].forEach(element => {
        element.addEventListener('change', () => {
            if (currentText) {
                generateQRCode();
            }
        });
    });
}

// Setup example buttons
function setupExampleButtons() {
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const text = this.getAttribute('data-text');
            qrText.value = text;
            currentText = text;
            generateQRCode();
        });
    });
}

// Generate QR Code
async function generateQRCode() {
    const text = qrText.value.trim();
    
    if (!text) {
        showPlaceholder();
        return;
    }
    
    currentText = text;
    console.log('Starting QR code generation for:', text);
    
    // Show loading state
    showLoading();
    
    try {
        const options = {
            width: parseInt(qrSize.value),
            margin: 2,
            color: qrColor.value,
            backgroundColor: qrBgColor.value,
            errorCorrectionLevel: qrErrorCorrection.value
        };
        
        console.log('QR code options:', options);
        
        // Generate QR code as SVG
        const svgString = await QRCode.toString(text, options);
        console.log('SVG generated, length:', svgString.length);
        
        // Generate QR code as canvas for PNG download
        const canvas = await QRCode.toCanvas(text, options);
        console.log('Canvas generated, size:', canvas.width, 'x', canvas.height);
        
        // Display the QR code
        displayQRCode(svgString, canvas);
        
        // Show success animation
        qrOutput.classList.add('success');
        setTimeout(() => qrOutput.classList.remove('success'), 600);
        
    } catch (error) {
        console.error('Error generating QR code:', error);
        showError('Failed to generate QR code. Please try again.');
    }
}

// Display QR Code
function displayQRCode(svgString, canvas) {
    console.log('Displaying QR code...');
    console.log('SVG string preview:', svgString.substring(0, 100) + '...');
    console.log('Canvas data URL:', canvas.toDataURL().substring(0, 100) + '...');
    
    qrOutput.innerHTML = svgString;
    qrOutput.classList.add('has-content');
    
    // Store canvas for PNG download
    currentQRCode = {
        canvas: canvas,
        svg: svgString,
        text: currentText
    };
    
    // Show download buttons
    downloadSection.style.display = 'flex';
    
    console.log('QR code displayed successfully');
}

// Show loading state
function showLoading() {
    qrOutput.innerHTML = `
        <div class="placeholder">
            <div class="loading"></div>
            <p>Generating QR Code...</p>
        </div>
    `;
    qrOutput.classList.remove('has-content');
    downloadSection.style.display = 'none';
}

// Show placeholder
function showPlaceholder() {
    qrOutput.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-qrcode"></i>
            <p>Your QR code will appear here</p>
        </div>
    `;
    qrOutput.classList.remove('has-content');
    downloadSection.style.display = 'none';
    currentQRCode = null;
}

// Show error
function showError(message) {
    qrOutput.innerHTML = `
        <div class="placeholder">
            <i class="fas fa-exclamation-triangle" style="color: #ff6b6b;"></i>
            <p>${message}</p>
        </div>
    `;
    qrOutput.classList.remove('has-content');
    downloadSection.style.display = 'none';
}

// Download QR Code
function downloadQRCode(format) {
    if (!currentQRCode) {
        return;
    }
    
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    const filename = `qr-code-${timestamp}`;
    
    if (format === 'png') {
        downloadCanvas(currentQRCode.canvas, `${filename}.png`);
    } else if (format === 'svg') {
        downloadSVG(currentQRCode.svg, `${filename}.svg`);
    }
}

// Download canvas as PNG
function downloadCanvas(canvas, filename) {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// Download SVG
function downloadSVG(svgString, filename) {
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

// Utility function to validate URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}

// Add some helpful features
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + Enter to generate QR code
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        generateQRCode();
    }
    
    // Escape to clear input
    if (e.key === 'Escape') {
        qrText.value = '';
        showPlaceholder();
    }
});

// Add clipboard functionality
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showToast('Copied to clipboard!');
        }).catch(() => {
            fallbackCopyToClipboard(text);
        });
    } else {
        fallbackCopyToClipboard(text);
    }
}

function fallbackCopyToClipboard(text) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showToast('Copied to clipboard!');
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
    
    document.body.removeChild(textArea);
}

// Toast notification
function showToast(message) {
    const toast = document.createElement('div');
    toast.textContent = message;
    toast.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #333;
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        z-index: 1000;
        font-size: 14px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateX(100%)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Add right-click context menu for QR code
qrOutput.addEventListener('contextmenu', function(e) {
    if (currentQRCode) {
        e.preventDefault();
        
        const menu = document.createElement('div');
        menu.style.cssText = `
            position: fixed;
            top: ${e.clientY}px;
            left: ${e.clientX}px;
            background: white;
            border: 1px solid #ddd;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 1000;
            min-width: 150px;
        `;
        
        menu.innerHTML = `
            <div style="padding: 8px 12px; cursor: pointer; border-bottom: 1px solid #eee;" onclick="copyToClipboard('${currentQRCode.text}')">
                <i class="fas fa-copy"></i> Copy Text
            </div>
            <div style="padding: 8px 12px; cursor: pointer;" onclick="downloadQRCode('png')">
                <i class="fas fa-download"></i> Download PNG
            </div>
        `;
        
        document.body.appendChild(menu);
        
        // Remove menu when clicking elsewhere
        const removeMenu = () => {
            if (document.body.contains(menu)) {
                document.body.removeChild(menu);
            }
            document.removeEventListener('click', removeMenu);
        };
        
        setTimeout(() => {
            document.addEventListener('click', removeMenu);
        }, 100);
    }
});

// Add some nice animations and interactions
generateBtn.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-2px) scale(1.02)';
});

generateBtn.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0) scale(1)';
});

// Add keyboard shortcuts info
const shortcutsInfo = document.createElement('div');
shortcutsInfo.innerHTML = `
    <div style="position: fixed; bottom: 20px; left: 20px; background: rgba(255,255,255,0.9); padding: 10px; border-radius: 8px; font-size: 12px; color: #666;">
        <strong>Shortcuts:</strong><br>
        Ctrl+Enter: Generate QR Code<br>
        Escape: Clear input
    </div>
`;
document.body.appendChild(shortcutsInfo);

// Hide shortcuts info on mobile
if (window.innerWidth <= 768) {
    shortcutsInfo.style.display = 'none';
} 