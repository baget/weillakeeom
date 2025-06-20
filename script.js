// Quotes data
const quotes = [
    { text: "It is Anat's Bug", author: "Oren" },
    { text: "It is Mahammad's Bug", author: "Oren" },
    { text: "It is a Firmware Bug", author: "Oren" },
    { text: "It is a Hardware Bug", author: "Oren" },
    { text: "Works on my platform", author: "Oren" },
    { text: "It compiled", author: "Oren" },
    { text: "Validation didn't test it", author: "Oren" },
    { text: "I ran UT17 on it", author: "Oren" },
    { text: "There are no bugs in Software", author: "Oren" },
    { text: "Kartik! Kartik!", author: "Oren" }
];

// Set target date to June 20, 2025 midnight Jerusalem time
const targetDate = new Date('2025-06-20T00:00:00+03:00');
console.log('Initial target date:', targetDate.toUTCString()); // Debug target date

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

// Function to get current time in Jerusalem timezone
function getCurrentTime() {
    const now = new Date();
    
    // Get time in Jerusalem timezone
    const jerusalemTime = new Date(now.toLocaleString('en-US', {
        timeZone: 'Asia/Jerusalem'
    }));
    
    console.log('Debug getCurrentTime:');
    console.log('Browser local time:', now.toString());
    console.log('UTC time:', now.toUTCString());
    console.log('Jerusalem time:', jerusalemTime.toString());
    
    return jerusalemTime;
}

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
    
    // Update both faces immediately on initialization
    if (forceUpdate) {
        frontFace.textContent = newValue;
        backFace.textContent = newValue;
        return;
    }
    
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
function updateDigits(container, value, count = 2, forceUpdate = false) {
    const flipCards = container.querySelectorAll('.flip-card');
    const paddedValue = value.toString().padStart(count, '0');
    
    [...flipCards].forEach((flipCard, index) => {
        updateDigit(flipCard, paddedValue[index] || '0', forceUpdate);
    });
}

// Function to calculate time units
function calculateTimeUnits() {
    const now = getCurrentTime();
    let difference = targetDate - now;
    
    // If target date has passed, use absolute value for counting up
    const isCountingUp = difference < 0;
    difference = Math.abs(difference);
    
    // Calculate time units
    const totalDays = Math.floor(difference / (1000 * 60 * 60 * 24));
    const remainingTime = difference % (1000 * 60 * 60 * 24);
    
    console.log('Current date:', now.toUTCString());
    console.log('Target date:', targetDate.toUTCString());
    console.log(isCountingUp ? 'Days passed:' : 'Days remaining:', totalDays);
    console.log('Milliseconds:', remainingTime);
    
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((difference % (1000 * 60)) / 1000);
    
    return {
        days: totalDays,
        hours: hours,
        minutes: minutes,
        seconds: seconds,
        isCountingUp: isCountingUp
    };
}

// Function to update the countdown
function updateCountdown(forceUpdate = false) {
    const timeUnits = calculateTimeUnits();
    
    // Calculate required digits for days
    const daysLength = timeUnits.days.toString().length;
    const digitsNeeded = Math.max(2, daysLength); // At least 2 digits
    
    console.log('Days value:', timeUnits.days); // Debug days value
    
    // Update title based on counting direction
    const title = document.querySelector('h1');
    if (timeUnits.isCountingUp) {
        title.textContent = 'Time Since Weil Lake EOM';
    } else {
        title.textContent = 'Weil Lake EOM (20-June-2025)';
    }
    
    // Update digits
    updateDigits(daysDigits, timeUnits.days, digitsNeeded, forceUpdate);
    updateDigits(hoursDigits, timeUnits.hours, 2, forceUpdate);
    updateDigits(minutesDigits, timeUnits.minutes, 2, forceUpdate);
    updateDigits(secondsDigits, timeUnits.seconds, 2, forceUpdate);
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
    // Set initial values without animation
    updateCountdown(true);
    displayRandomQuote();

    // Add refresh quote button listener
    const refreshButton = document.getElementById('refresh-quote');
    refreshButton.addEventListener('click', displayRandomQuote);
}

// Start the application
init();

// Start updates after a short delay to ensure proper initialization
setTimeout(() => {
    // Update countdown every second
    setInterval(updateCountdown, 1000);
    
    // Optional: Update immediately when the page becomes visible again
    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateCountdown();
        }
    });
}, 100);