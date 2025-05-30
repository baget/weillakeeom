// Quotes data
const quotes = [
    { text: "It is Anat's Bug", author: "Oren" },
    { text: "It is Mahammad's Bug", author: "Oren" },
    { text: "It is a Firmware Bug", author: "Oren" },
    { text: "It is a Hardware Bug", author: "Oren" },
    { text: "Works on my platform", author: "Oren" },
    { text: "It complied", author: "Oren" },
    { text: "Validation didn't test it", author: "Oren" },
    { text: "I ran UT17 on it", author: "Oren" }
];

// Target date: June 20, 2025
const targetDate = new Date('2025-06-20T00:00:00');

// DOM elements
const daysDigits = document.querySelector('.days');
const hoursDigits = document.querySelector('.hours');
const minutesDigits = document.querySelector('.minutes');
const secondsDigits = document.querySelector('.seconds');
const quoteEl = document.getElementById('quote');
const authorEl = document.getElementById('author');

// Animation duration should match CSS transition
const ANIMATION_DURATION = 700; // 700ms to match CSS

// Track last update time for each digit
const lastUpdates = new Map();

// Function to update a single digit
function updateDigit(flipCard, newValue, forceUpdate = false) {
    const card = flipCard.querySelector('.card');
    const frontFace = card.querySelector('.card-face-front');
    const backFace = card.querySelector('.card-face-back');
    
    if (frontFace.textContent === newValue && !forceUpdate) return;
    
    // Check if enough time has passed since last update
    const now = Date.now();
    const lastUpdate = lastUpdates.get(flipCard) || 0;
    if (!forceUpdate && now - lastUpdate < ANIMATION_DURATION) return;
    
    // Update last update time
    lastUpdates.set(flipCard, now);
    
    // Update back face and trigger flip
    backFace.textContent = newValue;
    card.classList.add('flip');
    
    // Update front face after animation
    setTimeout(() => {
        frontFace.textContent = newValue;
        card.classList.remove('flip');
    }, ANIMATION_DURATION);
}

// Function to update multiple digits
function updateDigits(container, value, count = 2) {
    const flipCards = container.querySelectorAll('.flip-card');
    const paddedValue = value.toString().padStart(count, '0');
    
    [...flipCards].forEach((flipCard, index) => {
        updateDigit(flipCard, paddedValue[index] || '0');
    });
}

// Function to calculate time units
function calculateTimeUnits(difference) {
    const days = Math.max(0, Math.floor(difference / (1000 * 60 * 60 * 24)));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return { days, hours, minutes, seconds };
}

// Function to update the countdown
function updateCountdown() {
    const now = new Date();
    const difference = targetDate - now;
    
    if (difference <= 0) {
        // If we've reached or passed the target date
        updateDigits(daysDigits, 0, 1);
        updateDigits(hoursDigits, 0);
        updateDigits(minutesDigits, 0);
        updateDigits(secondsDigits, 0);
        return;
    }
    
    const timeUnits = calculateTimeUnits(difference);
    
    updateDigits(daysDigits, timeUnits.days, 1);
    updateDigits(hoursDigits, timeUnits.hours);
    updateDigits(minutesDigits, timeUnits.minutes);
    updateDigits(secondsDigits, timeUnits.seconds);
}

// Function to display a random quote
function displayRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
    
    quoteEl.textContent = quote.text;
    authorEl.textContent = `- ${quote.author}`;
}

// Initialize
function init() {
    const timeUnits = calculateTimeUnits(targetDate - new Date());
    
    // Set initial values without animation
    document.querySelectorAll('.card-face').forEach(face => {
        if (face.parentElement.parentElement.parentElement.classList.contains('days')) {
            face.textContent = timeUnits.days.toString().padStart(1, '0');
        } else if (face.parentElement.parentElement.parentElement.classList.contains('hours')) {
            const digit = face.parentElement.parentElement.parentElement.children[1] === face.parentElement.parentElement ? 
                timeUnits.hours % 10 : Math.floor(timeUnits.hours / 10);
            face.textContent = digit;
        } else if (face.parentElement.parentElement.parentElement.classList.contains('minutes')) {
            const digit = face.parentElement.parentElement.parentElement.children[1] === face.parentElement.parentElement ? 
                timeUnits.minutes % 10 : Math.floor(timeUnits.minutes / 10);
            face.textContent = digit;
        } else if (face.parentElement.parentElement.parentElement.classList.contains('seconds')) {
            const digit = face.parentElement.parentElement.parentElement.children[1] === face.parentElement.parentElement ? 
                timeUnits.seconds % 10 : Math.floor(timeUnits.seconds / 10);
            face.textContent = digit;
        }
    });
    
    displayRandomQuote();
}

// Start the application
init();

// Update countdown every second
const countdown = setInterval(updateCountdown, 1000);

// Optional: Update immediately when the page becomes visible again
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
        updateCountdown();
    }
});