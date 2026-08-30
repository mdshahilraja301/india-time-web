const display =
    document.getElementById(
        "timer-display"
    );

const statusText =
    document.getElementById(
        "timer-status"
    );


const hoursInput =
    document.getElementById(
        "hours"
    );

const minutesInput =
    document.getElementById(
        "minutes"
    );

const secondsInput =
    document.getElementById(
        "seconds"
    );


const startButton =
    document.getElementById(
        "start-btn"
    );

const pauseButton =
    document.getElementById(
        "pause-btn"
    );

const resetButton =
    document.getElementById(
        "reset-btn"
    );


const toneSelect =
    document.getElementById(
        "timer-tone"
    );

const customToneInput =
    document.getElementById(
        "custom-tone"
    );

const previewToneButton =
    document.getElementById(
        "preview-tone-btn"
    );

const selectedTone =
    document.getElementById(
        "selected-tone"
    );




const STORAGE_KEY =
    "india_offline_timer";




let remainingSeconds = 0;

let timerRunning = false;

let timerInterval = null;

let selectedCustomFile = null;




function formatTime(totalSeconds) {

    totalSeconds =
        Math.max(
            0,
            Math.floor(totalSeconds)
        );


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) / 60
        );


    const seconds =
        totalSeconds % 60;


    return [

        String(hours)
            .padStart(2, "0"),

        String(minutes)
            .padStart(2, "0"),

        String(seconds)
            .padStart(2, "0")

    ].join(":");

}



function updateDisplay() {

    display.textContent =
        formatTime(
            remainingSeconds
        );

}




function getInputSeconds() {

    const hours =
        Math.max(
            0,
            Number(hoursInput.value) || 0
        );


    const minutes =
        Math.max(
            0,
            Number(minutesInput.value) || 0
        );


    const seconds =
        Math.max(
            0,
            Number(secondsInput.value) || 0
        );


    return (
        hours * 3600 +
        minutes * 60 +
        seconds
    );

}




function saveState() {

    const state = {

        remainingSeconds,

        timerRunning,

        savedAt:
            performance.now()

    };


    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
    );

}




function clearState() {

    localStorage.removeItem(
        STORAGE_KEY
    );

}




function startTimer() {

    if (timerRunning) {
        return;
    }


    /*
     * If timer is empty,
     * take value from inputs.
     */

    if (
        remainingSeconds <= 0
    ) {

        remainingSeconds =
            getInputSeconds();

    }


    if (
        remainingSeconds <= 0
    ) {

        statusText.textContent =
            "Set a timer first.";

        return;
    }


    timerRunning = true;


    statusText.textContent =
        "Timer running...";


    startButton.disabled = true;

    pauseButton.disabled = false;


    saveState();


    startInterval();

}




function startInterval() {

    stopInterval();


    timerInterval =
        setInterval(
            () => {

                if (
                    !timerRunning
                ) {
                    return;
                }


                remainingSeconds--;


                updateDisplay();


                saveState();


                if (
                    remainingSeconds <= 0
                ) {

                    finishTimer();

                }

            },
            1000
        );

}




function stopInterval() {

    if (
        timerInterval !== null
    ) {

        clearInterval(
            timerInterval
        );

        timerInterval = null;

    }

}



function pauseTimer() {

    if (
        !timerRunning
    ) {
        return;
    }


    timerRunning = false;


    stopInterval();


    statusText.textContent =
        "Timer paused.";


    startButton.disabled = false;

    pauseButton.disabled = true;


    saveState();

}





function resetTimer() {

    timerRunning = false;


    stopInterval();


    remainingSeconds = 0;


    updateDisplay();


    statusText.textContent =
        "Ready";


    startButton.disabled = false;

    pauseButton.disabled = true;


    clearState();

}




function finishTimer() {

    timerRunning = false;


    stopInterval();


    remainingSeconds = 0;


    updateDisplay();


    statusText.textContent =
        "⏰ Timer Complete!";


    startButton.disabled = false;

    pauseButton.disabled = true;


    clearState();


    /*
     * Play selected tone
     */

    playTimerTone();


    /*
     * Visual alert
     */

    const card =
        document.querySelector(
            ".timer-card"
        );


    if (card) {

        card.classList.add(
            "finished"
        );

    }

}




toneSelect.addEventListener(
    "change",
    () => {

        if (
            toneSelect.value ===
            "classic"
        ) {

            selectedCustomFile =
                null;


            selectedTone.textContent =
                "🔔 Classic Beep • Built-in";


            return;

        }


        if (
            toneSelect.value ===
            "my-tone"
        ) {

            customToneInput.click();

        }

    }
);




customToneInput.addEventListener(
    "change",
    event => {

        const file =
            event.target.files[0];


        if (!file) {

            toneSelect.value =
                "classic";

            selectedTone.textContent =
                "🔔 Classic Beep • Built-in";

            return;

        }


        const isMP3 =
            file.type ===
                "audio/mpeg" ||
            file.name
                .toLowerCase()
                .endsWith(".mp3");


        if (!isMP3) {

            alert(
                "Please select an MP3 file."
            );


            toneSelect.value =
                "classic";


            selectedTone.textContent =
                "🔔 Classic Beep • Built-in";


            return;

        }


        selectedCustomFile =
            file;


        selectedTone.textContent =
            `🎵 ${file.name}`;

    }
);




previewToneButton.addEventListener(
    "click",
    () => {

        if (
            toneSelect.value ===
            "my-tone"
        ) {

            if (
                !selectedCustomFile
            ) {

                alert(
                    "Please select an MP3 first."
                );

                return;

            }


            playCustomMP3(
                selectedCustomFile,
                true
            );


            return;

        }


        /*
         * Built-in preview
         */

        playClassicBeep(1);

    }
);



function playTimerTone() {

    if (
        toneSelect.value ===
        "my-tone"
    ) {

        if (
            selectedCustomFile
        ) {

            playCustomMP3(
                selectedCustomFile,
                false
            );

        } else {

            playClassicBeep(30);

        }


        return;

    }


    /*
     * Default built-in tone
     */

    playClassicBeep(30);

}




function playClassicBeep(
    totalTimes
) {

    const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;


    if (!AudioContext) {

        alert(
            "Audio is not supported by this browser."
        );

        return;

    }


    const audioContext =
        new AudioContext();


    /*
     * Browser audio unlock
     */

    if (
        audioContext.state ===
        "suspended"
    ) {

        audioContext.resume();

    }


    let count = 0;


    function beep() {

        if (
            count >= totalTimes
        ) {

            setTimeout(
                () => {

                    audioContext.close();

                },
                500
            );


            return;

        }


        const oscillator =
            audioContext.createOscillator();


        const gain =
            audioContext.createGain();


        oscillator.type =
            "sine";


        /*
         * Classic beep pattern
         */

        oscillator.frequency.value =
            count % 3 === 2
                ? 880
                : 660;


        oscillator.connect(
            gain
        );


        gain.connect(
            audioContext.destination
        );


        const now =
            audioContext.currentTime;


        gain.gain.setValueAtTime(
            0.0001,
            now
        );


        gain.gain
            .exponentialRampToValueAtTime(
                0.8,
                now + 0.03
            );


        gain.gain
            .exponentialRampToValueAtTime(
                0.0001,
                now + 0.35
            );


        oscillator.start(now);


        oscillator.stop(
            now + 0.4
        );


        count++;


        setTimeout(
            beep,
            550
        );

    }


    beep();

}



function playCustomMP3(
    file,
    preview = false
) {

    const url =
        URL.createObjectURL(
            file
        );


    const audio =
        new Audio(url);


    audio.volume = 1.0;


    /*
     * PREVIEW
     */

    if (preview) {

        audio.play().catch(
            error => {

                console.error(
                    "Preview failed:",
                    error
                );

            }
        );


        audio.addEventListener(
            "ended",
            () => {

                URL.revokeObjectURL(
                    url
                );

            }
        );


        return;

    }


   

    let count = 0;

    const totalPlays = 30;


    audio.addEventListener(
        "ended",
        () => {

            count++;


            if (
                count <
                totalPlays
            ) {

                audio.currentTime =
                    0;


                audio.play().catch(
                    error => {

                        console.error(
                            "MP3 play failed:",
                            error
                        );

                    }
                );

            } else {

                URL.revokeObjectURL(
                    url
                );

            }

        }
    );


    audio.play().catch(
        error => {

            console.error(
                "MP3 play failed:",
                error
            );

        }
    );

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




[
    hoursInput,
    minutesInput,
    secondsInput
].forEach(
    input => {

        input.addEventListener(
            "input",
            () => {

                if (
                    !timerRunning
                ) {

                    remainingSeconds =
                        getInputSeconds();


                    updateDisplay();

                }

            }
        );

    }
);




function loadSavedTimer() {

    const saved =
        localStorage.getItem(
            STORAGE_KEY
        );


    if (!saved) {

        updateDisplay();

        return;

    }


    try {

        const state =
            JSON.parse(saved);


        remainingSeconds =
            Number(
                state.remainingSeconds
            ) || 0;


        timerRunning =
            Boolean(
                state.timerRunning
            );


        updateDisplay();


        if (
            timerRunning &&
            remainingSeconds > 0
        ) {

            statusText.textContent =
                "Timer restored.";


            startButton.disabled =
                true;


            pauseButton.disabled =
                false;


            startInterval();

        }


    } catch (error) {

        console.error(
            "Unable to restore timer:",
            error
        );


        clearState();


        resetTimer();

    }

}



document.addEventListener(
    "visibilitychange",
    () => {

        /*
         * Timer intentionally continues
         * when user changes page/tab.
         */

        if (
            document.hidden
        ) {

            saveState();

        }

    }
);




loadSavedTimer();

updateDisplay();