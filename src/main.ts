import './style.css';
import {CharSet, convertToAscii} from './utils/ascii-convertor';

// State
let currentCharSet: CharSet = 'standard';
let isAsciiEnabled = true;

// DOM Elements
const elements = {
  video: document.getElementById('webcam') as HTMLVideoElement,
  asciiOutput: document.getElementById('asciiOutput') as HTMLPreElement,
  asciiContainer: document.getElementById('asciiContainer') as HTMLDivElement,
  captureButton: document.getElementById('captureButton') as HTMLButtonElement,
  charSetSelect: document.getElementById('charSet') as HTMLSelectElement,
  colorSchemeSelect: document.getElementById('colorScheme') as HTMLSelectElement,
  textColorInput: document.getElementById('textColor') as HTMLInputElement,
  bgColorInput: document.getElementById('bgColor') as HTMLInputElement,
  fontSizeInput: document.getElementById('fontSize') as HTMLInputElement,
  fontSizeValue: document.getElementById('fontSizeValue') as HTMLSpanElement,
  asciiToggle: document.getElementById('asciiToggle') as HTMLInputElement,
  sidebar: document.getElementById('sidebar') as HTMLDivElement,
  toggleSidebarButton: document.getElementById('toggleSidebar') as HTMLButtonElement,

};


// Main Functions
async function setupWebcam(): Promise<void> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({video: {width: 640, height: 480}});
    elements.video.srcObject = stream;
    elements.video.play();
    elements.video.onloadedmetadata = () => {
      requestAnimationFrame(updateFrame);
    };
  } catch (error) {
    console.error('Error accessing the webcam:', error);
  }
}

function updateFrame(): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = elements.video.videoWidth;
  canvas.height = elements.video.videoHeight;
  ctx.drawImage(elements.video, 0, 0, canvas.width, canvas.height);

  if (isAsciiEnabled) {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const asciiImage = convertToAscii(imageData, 100, 50, currentCharSet);  // Adjust these values as needed
    elements.asciiOutput.textContent = asciiImage;
    scaleAsciiOutput();
    elements.asciiOutput.style.display = 'block';
    elements.video.style.display = 'none';
  } else {
    elements.asciiOutput.style.display = 'none';
    elements.video.style.display = 'block';
  }

  requestAnimationFrame(updateFrame);
}

// Helper Functions
function scaleAsciiOutput(): void {
  const containerWidth = elements.asciiContainer.clientWidth;
  const containerHeight = elements.asciiContainer.clientHeight;
  const outputWidth = elements.asciiOutput.clientWidth;
  const outputHeight = elements.asciiOutput.clientHeight;

  const scaleX = containerWidth / outputWidth;
  const scaleY = containerHeight / outputHeight;
  const scale = Math.min(scaleX, scaleY);

  elements.asciiOutput.style.transform = `scale(${scale})`;
  elements.asciiOutput.style.transformOrigin = 'top left';
}

function captureAscii(): void {
  const asciiSnapshot = elements.asciiOutput.textContent;
  const blob = new Blob([asciiSnapshot ?? ''], {type: 'text/plain'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'ascii_capture.txt';
  a.click();
  URL.revokeObjectURL(url);
}

function updateCharSet(): void {
  currentCharSet = elements.charSetSelect.value as CharSet;
}

function updateColorScheme(): void {
  const selectedColorScheme = elements.colorSchemeSelect.value;
  switch (selectedColorScheme) {
    case 'greenOnBlack':
      elements.textColorInput.value = '#00FF00';
      elements.bgColorInput.value = '#000000';
      break;
    case 'whiteOnBlack':
      elements.textColorInput.value = '#FFFFFF';
      elements.bgColorInput.value = '#000000';
      break;
    case 'blackOnWhite':
      elements.textColorInput.value = '#000000';
      elements.bgColorInput.value = '#FFFFFF';
      break;
  }
  updateColors();
}

function updateColors(): void {
  elements.asciiOutput.style.color = elements.textColorInput.value;
  elements.asciiOutput.style.backgroundColor = elements.bgColorInput.value;
}

function setInitialFontSize(): void {
  const isMobile = window.innerWidth < 640;
  const initialSize = isMobile ? '6' : '11';
  if (elements.fontSizeInput && elements.fontSizeValue && elements.asciiOutput) {
    elements.fontSizeInput.value = initialSize;
    elements.fontSizeValue.textContent = `${initialSize}px`;
    elements.asciiOutput.style.fontSize = `${initialSize}px`;
    elements.asciiOutput.style.lineHeight = `${initialSize}px`;
  }
}

function updateFontSize(): void {
  const size = elements.fontSizeInput.value;
  if (elements.asciiOutput && elements.fontSizeValue) {
    elements.asciiOutput.style.fontSize = `${size}px`;
    elements.asciiOutput.style.lineHeight = `${size}px`;
    elements.fontSizeValue.textContent = `${size}px`;
  }
  scaleAsciiOutput();
}
function toggleAsciiEffect(): void {
  isAsciiEnabled = elements.asciiToggle.checked;
}

function handleColorChange(): void {
  elements.colorSchemeSelect.value = 'custom';
  updateColors();
}

const overlay = document.getElementById('overlay');

function toggleSidebar(): void {
  const sidebar = document.getElementById('sidebar');
  const toggleButton = document.getElementById('toggleSidebar');
  if (sidebar && overlay) {
    sidebar.classList.toggle('-translate-x-full');
    overlay.classList.toggle('hidden');
    if (toggleButton) {
      // Update the toggle button icon based on sidebar state
      if (sidebar.classList.contains('-translate-x-full')) {
        toggleButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        `;
      } else {
        toggleButton.innerHTML = `
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        `;
      }
    }
  }
}

function closeSidebar(): void {
  const sidebar = document.getElementById('sidebar');
  if (sidebar && overlay) {
    sidebar.classList.add('-translate-x-full');
    overlay.classList.add('hidden');
    if (elements.toggleSidebarButton) {
      elements.toggleSidebarButton.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
        </svg>
      `;
    }
  }
}



// Event Listeners and Initialization
setupWebcam();
elements.captureButton?.addEventListener('click', captureAscii);
elements.charSetSelect?.addEventListener('change', updateCharSet);
elements.colorSchemeSelect?.addEventListener('change', updateColorScheme);
elements.textColorInput?.addEventListener('input', handleColorChange);
elements.bgColorInput?.addEventListener('input', handleColorChange);
elements.fontSizeInput?.addEventListener('input', updateFontSize);
elements.asciiToggle?.addEventListener('change', toggleAsciiEffect);
elements.toggleSidebarButton?.addEventListener('click', toggleSidebar);
overlay?.addEventListener('click', closeSidebar);

// Initial setup
updateColorScheme();
setInitialFontSize();

// Responsive behavior
window.addEventListener('resize', () => {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth >= 640 && sidebar && overlay) {
    sidebar.classList.remove('-translate-x-full');
    overlay.classList.add('hidden');
  }
  setInitialFontSize();
  scaleAsciiOutput();
});