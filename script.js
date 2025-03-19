// Create starry background
function createStars() {
    const starsContainer = document.createElement('div');
    starsContainer.className = 'stars';
    document.body.appendChild(starsContainer);

    const numberOfStars = 200;
    for (let i = 0; i < numberOfStars; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        
        // Random size
        const size = Math.random() * 2;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        
        // Random twinkle animation
        star.style.animation = `twinkle ${2 + Math.random() * 3}s infinite ${Math.random() * 2}s`;
        
        starsContainer.appendChild(star);
    }
}

// Initialize stars
createStars();

class PomodoroTimer {
    constructor() {
        this.workTime = 25 * 60; // 25 minutes in seconds
        this.breakTime = 5 * 60; // 5 minutes in seconds
        this.timeLeft = this.workTime;
        this.isRunning = false;
        this.isWorkMode = true;
        this.sessionsCompleted = 0;
        this.timerInterval = null;

        // DOM elements
        this.timeDisplay = document.querySelector('.time-display');
        this.progressRing = document.querySelector('.progress-ring-circle');
        this.startBtn = document.getElementById('start');
        this.pauseBtn = document.getElementById('pause');
        this.resetBtn = document.getElementById('reset');
        this.workBtn = document.getElementById('work');
        this.breakBtn = document.getElementById('break');
        this.sessionsDisplay = document.getElementById('sessions');

        // Calculate progress ring circumference
        const circle = this.progressRing;
        const radius = circle.r.baseVal.value;
        this.circumference = radius * 2 * Math.PI;
        circle.style.strokeDasharray = `${this.circumference} ${this.circumference}`;

        // Initialize display
        this.updateDisplay();

        // Add event listeners
        this.startBtn.addEventListener('click', () => this.start());
        this.pauseBtn.addEventListener('click', () => this.pause());
        this.resetBtn.addEventListener('click', () => this.reset());
        this.workBtn.addEventListener('click', () => this.setMode('work'));
        this.breakBtn.addEventListener('click', () => this.setMode('break'));
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.timerInterval = setInterval(() => this.tick(), 1000);
            this.startBtn.disabled = true;
        }
    }

    pause() {
        this.isRunning = false;
        clearInterval(this.timerInterval);
        this.startBtn.disabled = false;
    }

    reset() {
        this.pause();
        this.timeLeft = this.isWorkMode ? this.workTime : this.breakTime;
        this.updateDisplay();
    }

    tick() {
        if (this.timeLeft > 0) {
            this.timeLeft--;
            this.updateDisplay();
        } else {
            this.completeSession();
        }
    }

    completeSession() {
        this.pause();
        if (this.isWorkMode) {
            this.sessionsCompleted++;
            this.sessionsDisplay.textContent = this.sessionsCompleted;
            this.setMode('break');
        } else {
            this.setMode('work');
        }
        this.playNotification();
    }

    setMode(mode) {
        this.isWorkMode = mode === 'work';
        this.timeLeft = this.isWorkMode ? this.workTime : this.breakTime;
        this.workBtn.classList.toggle('active', this.isWorkMode);
        this.breakBtn.classList.toggle('active', !this.isWorkMode);
        this.updateDisplay();
        this.pause();
    }

    updateDisplay() {
        // Update time display
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timeDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        // Update progress ring
        const totalTime = this.isWorkMode ? this.workTime : this.breakTime;
        const progress = this.timeLeft / totalTime;
        const offset = this.circumference * (1 - progress);
        this.progressRing.style.strokeDashoffset = offset;
    }

    playNotification() {
        // Create and play a simple beep sound
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.5;

        oscillator.start();
        setTimeout(() => oscillator.stop(), 200);
    }
}

// Initialize the timer when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PomodoroTimer();
}); 