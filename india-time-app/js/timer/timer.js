const hoursInput = document.getElementById("hours");
const minutesInput = document.getElementById("minutes");
const secondsInput = document.getElementById("seconds");

const display = document.getElementById("timer-display");
const status = document.getElementById("timer-status");

const startButton = document.getElementById("start-btn");
const pauseButton = document.getElementById("pause-btn");
const resetButton = document.getElementById("reset-btn");


let remainingMilliseconds = 0;
let timerRunning = false;

let lastPerformanceTime = 0;
let animationFrame = null;


 

let audioContext = null;


/*
    Browser Audio Engine initialize karta hai.
*/
function initializeAudio() {

    if (!audioContext) {
        audioContext = new (
            window.AudioContext ||
            window.webkitAudioContext
        )();
    }

    if (audioContext.state === "suspended") {
        audioContext.resume();
    }
}


 
function playBeep(frequency, startTime, duration) {

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(
        frequency,
        startTime
    );

    gainNode.gain.setValueAtTime(
        0.0001,
        startTime
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.8,
        startTime + 0.02
    );

    gainNode.gain.exponentialRampToValueAtTime(
        0.0001,
        startTime + duration
    );

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
}



 
function playTimerSound() {

    initializeAudio();

    const now = audioContext.currentTime;

    const totalBeeps = 100;

    const beepDuration = 0.20;
    const gap = 0.25;

    for (let i = 0; i < totalBeeps; i++) {

        const startTime =
            now + (i * gap);

        /*
            Har 3rd beep thoda high pitch
            rakha gaya hai.
        */

        const frequency =
            (i + 1) % 3 === 0
                ? 1046
                : 880;

        playBeep(
            frequency,
            startTime,
            beepDuration
        );
    }
}


 

function formatTime(milliseconds) {

    const totalSeconds =
        Math.ceil(milliseconds / 1000);

    const hours =
        Math.floor(totalSeconds / 3600);

    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );

    const seconds =
        totalSeconds % 60;

    return [
        String(hours).padStart(2, "0"),
        String(minutes).padStart(2, "0"),
        String(seconds).padStart(2, "0")
    ].join(":");
}


 

function updateDisplay() {

    display.textContent =
        formatTime(remainingMilliseconds);
}


 

function getInputMilliseconds() {

    let hours =
        Number(hoursInput.value) || 0;

    let minutes =
        Number(minutesInput.value) || 0;

    let seconds =
        Number(secondsInput.value) || 0;


    hours =
        Math.max(
            0,
            Math.floor(hours)
        );

    minutes =
        Math.max(
            0,
            Math.floor(minutes)
        );

    seconds =
        Math.max(
            0,
            Math.floor(seconds)
        );


    minutes =
        Math.min(59, minutes);

    seconds =
        Math.min(59, seconds);


    hoursInput.value = hours;

    minutesInput.value = minutes;

    secondsInput.value = seconds;


    return (
        (
            hours * 3600 +
            minutes * 60 +
            seconds
        ) * 1000
    );
}


 

function startTimer() {

    if (timerRunning) {
        return;
    }


    /*
        Audio ko Start button ke user interaction
        ke andar initialize karna important hai.
    */

    initializeAudio();


    /*
        New timer.
    */

    if (remainingMilliseconds <= 0) {

        remainingMilliseconds =
            getInputMilliseconds();
    }


    if (remainingMilliseconds <= 0) {

        status.textContent =
            "Please set a timer first.";

        return;
    }


    timerRunning = true;

    lastPerformanceTime =
        performance.now();


    startButton.disabled = true;

    pauseButton.disabled = false;

    status.textContent =
        "Timer running...";


    runTimer();
}


 

function runTimer() {

    if (!timerRunning) {
        return;
    }


    const now =
        performance.now();

    const elapsed =
        now - lastPerformanceTime;

    lastPerformanceTime = now;


    remainingMilliseconds -=
        elapsed;


    if (remainingMilliseconds <= 0) {

        remainingMilliseconds = 0;

        updateDisplay();

        timerFinished();

        return;
    }


    updateDisplay();


    animationFrame =
        requestAnimationFrame(
            runTimer
        );
}


 

function pauseTimer() {

    if (!timerRunning) {
        return;
    }


    timerRunning = false;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    startButton.disabled = false;

    pauseButton.disabled = true;

    status.textContent =
        "Timer paused";
}


 

function resetTimer() {

    timerRunning = false;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    remainingMilliseconds =
        getInputMilliseconds();


    updateDisplay();


    startButton.disabled = false;

    pauseButton.disabled = true;

    status.textContent =
        "Ready";
}


 

function timerFinished() {

    timerRunning = false;


    if (animationFrame) {

        cancelAnimationFrame(
            animationFrame
        );

        animationFrame = null;
    }


    startButton.disabled = false;

    pauseButton.disabled = true;


    status.textContent =
        "⏰ Timer finished!";


    /*
        🔊 Timer sound
    */

    playTimerSound();
}


 

function inputChanged() {

    if (timerRunning) {
        return;
    }

    resetTimer();
}


 
startButton.addEventListener(
    "click",
    startTimer
);

pauseButton.addEventListener(
    "click",
    pauseTimer
);

resetButton.addEventListener(
    "click",
    resetTimer
);

hoursInput.addEventListener(
    "change",
    inputChanged
);

minutesInput.addEventListener(
    "change",
    inputChanged
);

secondsInput.addEventListener(
    "change",
    inputChanged
);


 

resetTimer();