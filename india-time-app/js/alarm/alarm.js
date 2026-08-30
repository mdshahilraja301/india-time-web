

const TIME_API_URL =
    "https://utctime.app/api/now";


const ALARM_STORAGE_KEY =
    "indiaTimeOnlineAlarms";


const ACTIVE_ALARM_KEY =
    "indiaTimeActiveAlarm";


/*
   IMPORTANT:

   Agar tumhari offline alarm file ka path:

   offline/offline-alarm.html

   hai, to Alarm page se:
*/

const OFFLINE_ALARM_PAGE =
    "../offline/offline-alarm.html";



let audioContext = null;

let audioUnlocked = false;

let customAudio = null;

let toneTimers = [];

let globalEngineStarted = false;




function getAudioContext() {

    if (!audioContext) {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        if (!AudioContext) {

            console.error(
                "Web Audio API not supported."
            );

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

        if (
            ctx.state ===
            "suspended"
        ) {

            await ctx.resume();

        }


        /*
           Very small silent sound.
        */

        const oscillator =
            ctx.createOscillator();


        const gain =
            ctx.createGain();


        gain.gain.value =
            0.0001;


        oscillator.connect(
            gain
        );


        gain.connect(
            ctx.destination
        );


        oscillator.start();


        oscillator.stop(
            ctx.currentTime + 0.03
        );


        audioUnlocked =
            true;


        localStorage.setItem(
            "indiaTimeAudioUnlocked",
            "true"
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




function clearToneTimers() {

    toneTimers.forEach(
        timer => {

            clearTimeout(
                timer
            );

        }
    );


    toneTimers = [];
}




export function stopAlarmSound() {

    clearToneTimers();


    if (customAudio) {

        customAudio.pause();

        customAudio.currentTime =
            0;

        customAudio =
            null;
    }


    if (
        "vibrate" in navigator
    ) {

        navigator.vibrate(0);

    }


    document.title =
        "India Time";
}




function beep(
    frequency,
    duration,
    volume = 0.45,
    type = "sine"
) {

    const ctx =
        getAudioContext();


    if (!ctx) {
        return;
    }


    if (
        ctx.state ===
        "suspended"
    ) {

        ctx.resume().catch(
            () => {}
        );

    }


    const oscillator =
        ctx.createOscillator();


    const gain =
        ctx.createGain();


    oscillator.type =
        type;


    oscillator.frequency.value =
        frequency;


    oscillator.connect(
        gain
    );


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


    oscillator.start(
        start
    );


    oscillator.stop(
        end
    );
}




function classicTone() {

    beep(
        880,
        0.35,
        0.45,
        "sine"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    880,
                    0.35,
                    0.45,
                    "sine"
                );

            },
            500
        )
    );


    toneTimers.push(
        setTimeout(
            classicTone,
            1200
        )
    );
}




function emergencyTone() {

    beep(
        1000,
        0.25,
        0.50,
        "square"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    600,
                    0.25,
                    0.50,
                    "square"
                );

            },
            280
        )
    );


    toneTimers.push(
        setTimeout(
            emergencyTone,
            650
        )
    );
}




function morningTone() {

    beep(
        523,
        0.35,
        0.40,
        "sine"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    659,
                    0.35,
                    0.40,
                    "sine"
                );

            },
            400
        )
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    784,
                    0.50,
                    0.40,
                    "sine"
                );

            },
            800
        )
    );


    toneTimers.push(
        setTimeout(
            morningTone,
            1600
        )
    );
}




function energeticTone() {

    beep(
        1200,
        0.18,
        0.50,
        "triangle"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    1600,
                    0.18,
                    0.50,
                    "triangle"
                );

            },
            220
        )
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    2000,
                    0.18,
                    0.50,
                    "triangle"
                );

            },
            440
        )
    );


    toneTimers.push(
        setTimeout(
            energeticTone,
            700
        )
    );
}




function studentTone() {

    beep(
        1200,
        0.20,
        0.50,
        "square"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    1500,
                    0.20,
                    0.50,
                    "square"
                );

            },
            230
        )
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    1200,
                    0.20,
                    0.50,
                    "square"
                );

            },
            460
        )
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    1800,
                    0.35,
                    0.50,
                    "square"
                );

            },
            690
        )
    );


    toneTimers.push(
        setTimeout(
            studentTone,
            1300
        )
    );
}



function schoolTone() {

    beep(
        700,
        0.90,
        0.45,
        "sine"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    1000,
                    0.80,
                    0.40,
                    "sine"
                );

            },
            250
        )
    );


    toneTimers.push(
        setTimeout(
            schoolTone,
            1800
        )
    );
}



function digitalTone() {

    beep(
        1600,
        0.12,
        0.50,
        "square"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    800,
                    0.12,
                    0.50,
                    "square"
                );

            },
            170
        )
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    1600,
                    0.12,
                    0.50,
                    "square"
                );

            },
            340
        )
    );


    toneTimers.push(
        setTimeout(
            digitalTone,
            650
        )
    );
}



function extremeTone() {

    beep(
        1800,
        0.18,
        0.55,
        "sawtooth"
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    1000,
                    0.18,
                    0.55,
                    "sawtooth"
                );

            },
            200
        )
    );


    toneTimers.push(
        setTimeout(
            () => {

                beep(
                    2000,
                    0.18,
                    0.55,
                    "sawtooth"
                );

            },
            400
        )
    );


    toneTimers.push(
        setTimeout(
            extremeTone,
            700
        )
    );
}




function playBuiltInTone(
    tone
) {

    stopAlarmSound();


    switch (tone) {

        case "emergency":

            emergencyTone();

            break;


        case "morning":

            morningTone();

            break;


        case "energetic":

            energeticTone();

            break;


        case "student":

            studentTone();

            break;


        case "school":

            schoolTone();

            break;


        case "digital":

            digitalTone();

            break;


        case "extreme":

            extremeTone();

            break;


        case "classic":

        default:

            classicTone();

            break;
    }


    document.title =
        "🔔 ALARM RINGING!";


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




async function playCustomMP3(
    file
) {

    stopAlarmSound();


    if (!file) {
        return;
    }


    const url =
        URL.createObjectURL(
            file
        );


    customAudio =
        new Audio(url);


    customAudio.loop =
        true;


    customAudio.volume =
        1.0;


    try {

        await customAudio.play();

        document.title =
            "🔔 ALARM RINGING!";

    } catch (error) {

        console.error(
            "MP3 playback failed:",
            error
        );

    }
}




function getAlarms() {

    try {

        const data =
            localStorage.getItem(
                ALARM_STORAGE_KEY
            );


        if (!data) {
            return [];
        }


        const alarms =
            JSON.parse(
                data
            );


        return Array.isArray(
            alarms
        )
            ? alarms
            : [];

    } catch {

        return [];

    }
}




function saveAlarms(
    alarms
) {

    localStorage.setItem(
        ALARM_STORAGE_KEY,
        JSON.stringify(
            alarms
        )
    );
}




export async function getOnlineIST() {

    const response =
        await fetch(
            TIME_API_URL,
            {
                cache: "no-store"
            }
        );


    if (!response.ok) {

        throw new Error(
            "Unable to connect to India Time server."
        );

    }


    const data =
        await response.json();


    if (!data.unix_ms) {

        throw new Error(
            "India Time server timestamp missing."
        );

    }


    return Number(
        data.unix_ms
    );
}




function createAlarmTimestamp(
    hour,
    minute,
    second,
    serverTimestamp
) {

    /*
       Server timestamp UTC milliseconds.
    */

    const serverDate =
        new Date(
            serverTimestamp
        );


    /*
       Convert to India time.

       IST = UTC + 5:30
    */

    const istDate =
        new Date(
            serverTimestamp +
            (5.5 * 60 * 60 * 1000)
        );


    const year =
        istDate.getUTCFullYear();


    const month =
        istDate.getUTCMonth();


    const day =
        istDate.getUTCDate();


    /*
       Calculate target in UTC
       corresponding to selected IST.
    */

    let target =
        Date.UTC(
            year,
            month,
            day,
            hour,
            minute,
            second
        )
        -
        (5.5 * 60 * 60 * 1000);


    /*
       If selected time already passed,
       schedule tomorrow.
    */

    if (
        target <=
        serverTimestamp
    ) {

        target +=
            24 * 60 * 60 * 1000;

    }


    return target;
}



export async function addOnlineAlarm() {

    const timeInput =
        document.getElementById(
            "alarm-time"
        );


    const nameInput =
        document.getElementById(
            "alarm-name"
        );


    const toneInput =
        document.getElementById(
            "alarm-tone"
        );


    const status =
        document.getElementById(
            "alarm-status"
        );


    if (!timeInput) {
        return;
    }


    if (!timeInput.value) {

        alert(
            "Please select alarm time."
        );

        return;

    }


    try {

        /*
           Unlock audio.
        */

        await unlockAlarmAudio();


        /*
           Get REAL online IST.
        */

        const serverTimestamp =
            await getOnlineIST();


        const parts =
            timeInput.value.split(":");


        const hour =
            Number(
                parts[0]
            );


        const minute =
            Number(
                parts[1]
            );


        const second =
            Number(
                parts[2] || 0
            );


        const targetTimestamp =
            createAlarmTimestamp(
                hour,
                minute,
                second,
                serverTimestamp
            );


        const alarm = {

            id:
                Date.now(),

            name:
                nameInput?.value.trim() ||
                "Alarm",

            time:
                timeInput.value,

            tone:
                toneInput?.value ||
                "classic",

            targetTimestamp:
                targetTimestamp,

            enabled:
                true,

            triggered:
                false,

            ringing:
                false

        };


        const alarms =
            getAlarms();


        alarms.push(
            alarm
        );


        saveAlarms(
            alarms
        );


        if (status) {

            status.textContent =
                "✓ Alarm set using India Standard Time";

        }


        renderAlarmList();


        /*
           Clear name.
        */

        if (nameInput) {

            nameInput.value =
                "";

        }


    } catch (error) {

        console.error(
            error
        );


        if (status) {

            status.textContent =
                "Unable to connect to India Time server.";

        }

    }
}




function formatAMPM(
    time
) {

    const parts =
        time.split(":");


    let hour =
        Number(
            parts[0]
        );


    const minute =
        parts[1];


    const second =
        parts[2] ||
        "00";


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12;


    if (
        hour === 0
    ) {

        hour =
            12;

    }


    return (
        String(
            hour
        ).padStart(
            2,
            "0"
        )
        +
        ":" +
        minute +
        ":" +
        second +
        " " +
        suffix
    );
}


export function renderAlarmList() {

    const list =
        document.getElementById(
            "alarm-list"
        );


    const count =
        document.getElementById(
            "alarm-count"
        );


    if (!list) {
        return;
    }


    const alarms =
        getAlarms();


    if (count) {

        count.textContent =
            alarms.length;

    }


    if (
        alarms.length ===
        0
    ) {

        list.innerHTML = `

            <div class="empty-alarm">

                <div class="empty-icon">
                    ⏰
                </div>

                <h3>
                    No alarms yet
                </h3>

                <p>
                    Set your first alarm above.
                </p>

            </div>

        `;

        return;

    }


    list.innerHTML =
        alarms
            .map(
                alarm => `

                <div
                    class="alarm-item"
                    data-id="${alarm.id}"
                >

                    <div>

                        <strong>
                            ${escapeHTML(
                                alarm.name
                            )}
                        </strong>

                        <div>
                            ${formatAMPM(
                                alarm.time
                            )}
                        </div>

                        <small>
                            ${alarm.tone}
                        </small>

                    </div>


                    <button
                        type="button"
                        class="delete-alarm"
                        data-id="${alarm.id}"
                    >
                        🗑️
                    </button>

                </div>

            `
            )
            .join("");


    /*
       Delete buttons.
    */

    document
        .querySelectorAll(
            ".delete-alarm"
        )
        .forEach(
            button => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteAlarm(
                            button.dataset.id
                        );

                    }
                );

            }
        );
}




function escapeHTML(
    value
) {

    return String(
        value
    )
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}




function deleteAlarm(
    id
) {

    const alarms =
        getAlarms();


    const updated =
        alarms.filter(
            alarm =>
                String(
                    alarm.id
                ) !==
                String(id)
        );


    saveAlarms(
        updated
    );


    renderAlarmList();
}




async function checkOnlineAlarms() {

    const alarms =
        getAlarms();


    if (
        alarms.length ===
        0
    ) {

        return;

    }


    let serverNow;


    try {

        serverNow =
            await getOnlineIST();

    } catch {

        /*
           INTERNET/API LOST
        */

        autoSwitchToOffline();

        return;

    }


    for (
        const alarm of alarms
    ) {

        if (
            !alarm.enabled
        ) {
            continue;
        }


        if (
            alarm.triggered
        ) {
            continue;
        }


        if (
            serverNow >=
            Number(
                alarm.targetTimestamp
            )
        ) {

            await ringOnlineAlarm(
                alarm
            );

        }

    }
}




async function ringOnlineAlarm(
    alarm
) {

    const alarms =
        getAlarms();


    const index =
        alarms.findIndex(
            item =>
                String(
                    item.id
                ) ===
                String(
                    alarm.id
                )
        );


    if (
        index ===
        -1
    ) {

        return;

    }


    /*
       Mark immediately.
    */

    alarms[index].triggered =
        true;


    alarms[index].ringing =
        true;


    saveAlarms(
        alarms
    );


    localStorage.setItem(
        ACTIVE_ALARM_KEY,
        JSON.stringify(
            alarm
        )
    );


    document.title =
        "🔔 ALARM RINGING!";


    /*
       Custom MP3 cannot survive
       page navigation because File object
       is local to current page.

       Built-in tones work everywhere.
    */

    if (
        alarm.tone ===
        "my-alarm"
    ) {

        /*
           If currently on alarm page
           and custom file exists,
           alarm.js UI will handle it.

           Otherwise fallback.
        */

        playBuiltInTone(
            "classic"
        );

    } else {

        playBuiltInTone(
            alarm.tone
        );

    }


    /*
       Show stop button if available.
    */

    const stopButton =
        document.getElementById(
            "stop-alarm-btn"
        );


    if (stopButton) {

        stopButton.hidden =
            false;

    }
}




export function stopGlobalAlarm() {

    stopAlarmSound();


    localStorage.removeItem(
        ACTIVE_ALARM_KEY
    );


    const alarms =
        getAlarms();


    const updated =
        alarms.map(
            alarm => ({

                ...alarm,

                ringing:
                    false

            })
        );


    saveAlarms(
        updated
    );


    const stopButton =
        document.getElementById(
            "stop-alarm-btn"
        );


    if (stopButton) {

        stopButton.hidden =
            true;

    }


    const status =
        document.getElementById(
            "alarm-status"
        );


    if (status) {

        status.textContent =
            "Alarm stopped.";

    }
}




function autoSwitchToOffline() {

    /*
       Don't redirect repeatedly.
    */

    if (
        sessionStorage.getItem(
            "indiaTimeOfflineRedirect"
        ) ===
        "true"
    ) {

        return;

    }


    sessionStorage.setItem(
        "indiaTimeOfflineRedirect",
        "true"
    );


    /*
       Backup online alarms.
       Offline system can use this later.
    */

    const alarms =
        getAlarms();


    localStorage.setItem(
        "indiaTimeOfflineBackupAlarms",
        JSON.stringify(
            alarms
        )
    );


    

    const path =
        window.location.pathname;


    let offlinePath =
        "../offline/offline-alarm.html";


    if (
        path.endsWith(
            "/index.html"
        )
        ||
        path.endsWith("/")
    ) {

        offlinePath =
            "./offline/offline-alarm.html";

    }


    if (
        path.includes(
            "/pages/"
        )
    ) {

        offlinePath =
            "../offline/offline-alarm.html";

    }


    window.location.href =
        offlinePath;
}




export function startGlobalOnlineAlarm() {

    if (
        globalEngineStarted
    ) {

        return;

    }


    globalEngineStarted =
        true;


    /*
       Check immediately.
    */

    checkOnlineAlarms();


    /*
       Every second.
    */

    setInterval(
        () => {

            checkOnlineAlarms();

        },
        1000
    );


    /*
       Browser says internet offline.
    */

    window.addEventListener(
        "offline",
        () => {

            autoSwitchToOffline();

        }
    );


    /*
       Browser says internet online.
    */

    window.addEventListener(
        "online",
        () => {

            checkOnlineAlarms();

        }
    );


    /*
       Page becomes visible.
    */

    document.addEventListener(
        "visibilitychange",
        () => {

            if (
                !document.hidden
            ) {

                checkOnlineAlarms();

            }

        }
    );
}




function initializeAlarmPage() {

    const addButton =
        document.getElementById(
            "add-alarm-btn"
        );


    const previewButton =
        document.getElementById(
            "preview-tone-btn"
        );


    const toneSelect =
        document.getElementById(
            "alarm-tone"
        );


    const customTone =
        document.getElementById(
            "custom-tone"
        );


    const customWrapper =
        document.getElementById(
            "custom-tone-wrapper"
        );


    const stopButton =
        document.getElementById(
            "stop-alarm-btn"
        );


    /*
       Add alarm.
    */

    if (addButton) {

        addButton.addEventListener(
            "click",
            addOnlineAlarm
        );

    }


    /*
       Tone selector.
    */

    if (toneSelect) {

        toneSelect.addEventListener(
            "change",
            () => {

                if (
                    customWrapper
                ) {

                    customWrapper.classList.toggle(
                        "hidden",
                        toneSelect.value !==
                        "my-alarm"
                    );

                }

            }
        );

    }


    /*
       Preview.
    */

    if (previewButton) {

        previewButton.addEventListener(
            "click",
            async () => {

                await unlockAlarmAudio();


                stopAlarmSound();


                const tone =
                    toneSelect?.value ||
                    "classic";


                if (
                    tone ===
                    "my-alarm"
                ) {

                    const file =
                        customTone?.files?.[0];


                    if (!file) {

                        alert(
                            "Please select an MP3 first."
                        );

                        return;

                    }


                    await playCustomMP3(
                        file
                    );


                    setTimeout(
                        () => {

                            stopAlarmSound();

                        },
                        8000
                    );


                    return;

                }


                playBuiltInTone(
                    tone
                );


                setTimeout(
                    () => {

                        stopAlarmSound();

                    },
                    5000
                );

            }
        );

    }


    /*
       Stop.
    */

    if (stopButton) {

        stopButton.addEventListener(
            "click",
            stopGlobalAlarm
        );

    }


   

    renderAlarmList();


    
    updateAlarmPageClock();


    

    startGlobalOnlineAlarm();
}



async function updateAlarmPageClock() {

    const element =
        document.getElementById(
            "current-ist"
        );


    if (!element) {
        return;
    }


    try {

        const timestamp =
            await getOnlineIST();


        function update() {

            const now =
                timestamp +
                (
                    Date.now()
                    -
                    performance.timeOrigin
                );


            const date =
                new Date(
                    now
                );


            const ist =
                new Date(
                    now +
                    (
                        5.5 *
                        60 *
                        60 *
                        1000
                    )
                );


            let hours =
                ist.getUTCHours();


            const minutes =
                String(
                    ist.getUTCMinutes()
                ).padStart(
                    2,
                    "0"
                );


            const seconds =
                String(
                    ist.getUTCSeconds()
                ).padStart(
                    2,
                    "0"
                );


            const suffix =
                hours >= 12
                    ? "PM"
                    : "AM";


            hours =
                hours % 12;


            if (
                hours === 0
            ) {

                hours =
                    12;

            }


            element.textContent =
                `${String(hours).padStart(2, "0")}:${minutes}:${seconds} ${suffix}`;

        }


        update();


        setInterval(
            update,
            1000
        );


    } catch {

        element.textContent =
            "Offline";

    }
}




if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initializeAlarmPage
    );

} else {

    initializeAlarmPage();

}




document.addEventListener(
    "click",
    () => {

        unlockAlarmAudio();

    },
    {
        once: true
    }
);
