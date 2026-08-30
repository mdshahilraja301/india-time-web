

//   - No internet
//   - Uses system/laptop time
//   - AM/PM compatible
//   - 8 built-in generated tones
//   - My Alarm local MP3
//   - Persistent alarm state


import {
    getOfflineAlarm,
    saveOfflineAlarm,
    deleteOfflineAlarm
} from "./offline-storage.js";




let audioContext = null;
let activeOscillators = [];
let activeTimeouts = [];

let customAlarmAudio = null;
let customAlarmURL = null;

let engineStarted = false;




function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return null;
        }

        audioContext =
            new AudioContext();
    }

    return audioContext;
}




export async function unlockAlarmAudio() {

    const ctx =
        getAudioContext();

    if (!ctx) {
        return false;
    }

    try {

        if (ctx.state === "suspended") {
            await ctx.resume();
        }

        /*
           Silent oscillator.
           Isse browser audio permission
           unlock karne me help karta hai.
        */

        const oscillator =
            ctx.createOscillator();

        const gain =
            ctx.createGain();

        gain.gain.value = 0.0001;

        oscillator.connect(gain);
        gain.connect(ctx.destination);

        oscillator.start();

        oscillator.stop(
            ctx.currentTime + 0.03
        );

        return true;

    } catch (error) {

        console.error(
            "Audio unlock failed:",
            error
        );

        return false;
    }
}



function createTone(
    frequency,
    duration,
    volume = 0.35,
    type = "sine"
) {

    const ctx =
        getAudioContext();

    if (!ctx) {
        return;
    }


    const oscillator =
        ctx.createOscillator();

    const gain =
        ctx.createGain();


    oscillator.type =
        type;

    oscillator.frequency.value =
        frequency;


    oscillator.connect(gain);

    gain.connect(
        ctx.destination
    );


    const start =
        ctx.currentTime;

    const end =
        start + duration;


    gain.gain.setValueAtTime(
        0.0001,
        start
    );


    gain.gain.exponentialRampToValueAtTime(
        volume,
        start + 0.02
    );


    gain.gain.exponentialRampToValueAtTime(
        0.0001,
        end
    );


    oscillator.start(start);

    oscillator.stop(end);


    activeOscillators.push(
        oscillator
    );
}



function classicBeep() {

    createTone(
        880,
        0.35,
        0.35,
        "sine"
    );

    schedule(
        classicBeep,
        500
    );
}



function emergencyTone() {

    createTone(
        880,
        0.25,
        0.4,
        "square"
    );

    schedule(
        () => {

            createTone(
                620,
                0.25,
                0.4,
                "square"
            );

        },
        300
    );

    schedule(
        emergencyTone,
        650
    );
}


function morningTone() {

    createTone(
        523.25,
        0.35,
        0.30,
        "sine"
    );

    schedule(
        () => {

            createTone(
                659.25,
                0.35,
                0.30,
                "sine"
            );

        },
        380
    );

    schedule(
        () => {

            createTone(
                783.99,
                0.50,
                0.30,
                "sine"
            );

        },
        760
    );

    schedule(
        morningTone,
        1500
    );
}



function energeticTone() {

    createTone(
        1000,
        0.18,
        0.40,
        "triangle"
    );

    schedule(
        () => {

            createTone(
                1400,
                0.18,
                0.40,
                "triangle"
            );

        },
        220
    );

    schedule(
        () => {

            createTone(
                1800,
                0.18,
                0.40,
                "triangle"
            );

        },
        440
    );

    schedule(
        energeticTone,
        700
    );
}




function studentWakeUpTone() {

    createTone(
        1200,
        0.22,
        0.45,
        "square"
    );

    schedule(
        () => {

            createTone(
                1500,
                0.22,
                0.45,
                "square"
            );

        },
        250
    );

    schedule(
        () => {

            createTone(
                1200,
                0.22,
                0.45,
                "square"
            );

        },
        500
    );

    schedule(
        () => {

            createTone(
                1800,
                0.35,
                0.45,
                "square"
            );

        },
        750
    );

    schedule(
        studentWakeUpTone,
        1300
    );
}




function schoolBellTone() {

    createTone(
        700,
        0.9,
        0.40,
        "sine"
    );

    schedule(
        () => {

            createTone(
                1000,
                0.8,
                0.35,
                "sine"
            );

        },
        250
    );

    schedule(
        schoolBellTone,
        1800
    );
}




function digitalAlertTone() {

    createTone(
        1600,
        0.12,
        0.45,
        "square"
    );

    schedule(
        () => {

            createTone(
                800,
                0.12,
                0.45,
                "square"
            );

        },
        170
    );

    schedule(
        () => {

            createTone(
                1600,
                0.12,
                0.45,
                "square"
            );

        },
        340
    );

    schedule(
        digitalAlertTone,
        650
    );
}



function extremeWakeUpTone() {

    createTone(
        1800,
        0.18,
        0.50,
        "sawtooth"
    );

    schedule(
        () => {

            createTone(
                1000,
                0.18,
                0.50,
                "sawtooth"
            );

        },
        200
    );

    schedule(
        () => {

            createTone(
                2000,
                0.18,
                0.50,
                "sawtooth"
            );

        },
        400
    );

    schedule(
        extremeWakeUpTone,
        700
    );
}



function schedule(
    callback,
    delay
) {

    const timeout =
        setTimeout(
            callback,
            delay
        );

    activeTimeouts.push(
        timeout
    );
}



function stopGeneratedAudio() {

    activeTimeouts.forEach(
        timeout => clearTimeout(timeout)
    );

    activeTimeouts = [];


    activeOscillators.forEach(
        oscillator => {

            try {
                oscillator.stop();
            } catch (error) {
                // Already stopped
            }

        }
    );


    activeOscillators = [];
}



export function stopAlarmAudio() {

    stopGeneratedAudio();


    if (customAlarmAudio) {

        customAlarmAudio.pause();

        customAlarmAudio.currentTime =
            0;

        customAlarmAudio =
            null;
    }
}



const toneFunctions = {

    classic:
        classicBeep,

    emergency:
        emergencyTone,

    morning:
        morningTone,

    energetic:
        energeticTone,

    student:
        studentWakeUpTone,

    school:
        schoolBellTone,

    digital:
        digitalAlertTone,

    extreme:
        extremeWakeUpTone

};



export async function playBuiltInTone(
    tone
) {

    await unlockAlarmAudio();

    stopGeneratedAudio();


    const toneFunction =
        toneFunctions[tone];


    if (!toneFunction) {

        classicBeep();

        return;

    }


    toneFunction();
}



export async function playCustomAlarm(
    file
) {

    stopAlarmAudio();


    if (!file) {
        return false;
    }


    if (customAlarmURL) {

        URL.revokeObjectURL(
            customAlarmURL
        );

    }


    customAlarmURL =
        URL.createObjectURL(file);


    customAlarmAudio =
        new Audio(
            customAlarmURL
        );


    customAlarmAudio.loop =
        true;

    customAlarmAudio.volume =
        1.0;


    try {

        await customAlarmAudio.play();

        return true;

    } catch (error) {

        console.error(
            "Custom alarm playback failed:",
            error
        );

        return false;
    }
}




export async function playStoredAlarm(
    alarm,
    customFile = null
) {

    if (!alarm) {
        return;
    }


    if (
        alarm.tone ===
        "my-alarm"
    ) {

        if (customFile) {

            await playCustomAlarm(
                customFile
            );

        } else {

            /*
               Browser refresh ke baad
               local File object available
               nahi hota.
            */

            await playBuiltInTone(
                "classic"
            );
        }

        return;
    }


    await playBuiltInTone(
        alarm.tone
    );
}




export async function ringOfflineAlarm(
    alarm,
    customFile = null
) {

    if (!alarm) {
        return;
    }


    if (
        alarm.status ===
        "ringing"
    ) {

        return;

    }


    alarm.status =
        "ringing";


    saveOfflineAlarm(
        alarm
    );


    document.title =
        "🔔 ALARM RINGING!";


    await playStoredAlarm(
        alarm,
        customFile
    );


    /*
       Browser vibration.
    */

    if (
        "vibrate" in navigator
    ) {

        navigator.vibrate([
            700,
            300,
            700,
            300,
            1000
        ]);

    }
}




export function stopOfflineAlarm() {

    stopAlarmAudio();

    deleteOfflineAlarm();


    if (
        "vibrate" in navigator
    ) {

        navigator.vibrate(0);

    }


    document.title =
        "Offline Alarm • India Time";
}




export async function checkOfflineAlarm(
    customFile = null
) {

    const alarm =
        getOfflineAlarm();


    if (!alarm) {
        return null;
    }


    if (
        alarm.status ===
        "ringing"
    ) {

        return alarm;

    }


    if (
        Date.now() >=
        Number(
            alarm.targetTimestamp
        )
    ) {

        await ringOfflineAlarm(
            alarm,
            customFile
        );

    }


    return getOfflineAlarm();
}




export function startOfflineAlarmEngine(
    customFile = null
) {

    if (engineStarted) {
        return;
    }


    engineStarted = true;


    /*
       Check immediately.
    */

    checkOfflineAlarm(
        customFile
    );


    /*
       Check every 500ms.
    */

    setInterval(
        () => {

            checkOfflineAlarm(
                customFile
            );

        },
        500
    );
}
