import {
    saveOfflineAlarm,
    getOfflineAlarm,
    deleteOfflineAlarm
} from "./offline-storage.js";

import {
    unlockAlarmAudio,
    playBuiltInTone,
    playCustomAlarm,
    stopAlarmAudio,
    startOfflineAlarmEngine,
    stopOfflineAlarm
} from "./offline-alarm-engine.js";




const currentTimeElement =
    document.getElementById(
        "current-time"
    );

const currentDateElement =
    document.getElementById(
        "current-date"
    );

const alarmTimeInput =
    document.getElementById(
        "alarm-time"
    );

const setAlarmButton =
    document.getElementById(
        "set-alarm-btn"
    );

const alarmToneSelect =
    document.getElementById(
        "alarm-tone"
    );

const previewToneButton =
    document.getElementById(
        "preview-tone-btn"
    );

const customToneInput =
    document.getElementById(
        "custom-tone"
    );

const chooseMp3Button =
    document.getElementById(
        "choose-mp3-btn"
    );

const selectedFileElement =
    document.getElementById(
        "selected-file"
    );

const activeAlarmSection =
    document.getElementById(
        "active-alarm-section"
    );

const activeAlarmTimeElement =
    document.getElementById(
        "active-alarm-time"
    );

const alarmCountdownElement =
    document.getElementById(
        "alarm-countdown"
    );

const deleteAlarmButton =
    document.getElementById(
        "delete-alarm-btn"
    );

const alarmMessage =
    document.getElementById(
        "alarm-message"
    );

const stopAlarmButton =
    document.getElementById(
        "stop-alarm-btn"
    );



let selectedCustomFile = null;




function updateCurrentTime() {

    const now =
        new Date();


    const time =
        now.toLocaleTimeString(
            "en-IN",
            {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: true
            }
        );


    const date =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "2-digit",
                month: "long",
                year: "numeric"
            }
        );


    if (currentTimeElement) {

        currentTimeElement.textContent =
            time;

    }


    if (currentDateElement) {

        currentDateElement.textContent =
            date;

    }


    updateCountdown();
}




function createAlarmTimestamp(
    timeValue
) {

    const parts =
        timeValue.split(":");


    const hour =
        Number(parts[0]);


    const minute =
        Number(parts[1]);


    const second =
        Number(parts[2] || 0);


    const now =
        new Date();


    const target =
        new Date();


    target.setHours(
        hour,
        minute,
        second,
        0
    );


    /*
       Agar selected time aaj nikal gaya
       to kal ka alarm.
    */

    if (
        target.getTime() <=
        now.getTime()
    ) {

        target.setDate(
            target.getDate() + 1
        );

    }


    return target.getTime();
}




async function setAlarm() {

    if (!alarmTimeInput) {
        return;
    }


    const time =
        alarmTimeInput.value;


    if (!time) {

        alert(
            "Please select alarm time."
        );

        return;

    }


    /*
       Browser audio unlock.
    */

    await unlockAlarmAudio();


    const timestamp =
        createAlarmTimestamp(
            time
        );


    const tone =
        alarmToneSelect
            ? alarmToneSelect.value
            : "classic";


    const alarm = {

        id:
            Date.now(),

        time:
            time,

        targetTimestamp:
            timestamp,

        tone:
            tone,

        status:
            "active"

    };


    saveOfflineAlarm(
        alarm
    );


    renderAlarm();


    /*
       Preview / feedback.
    */

    if (alarmCountdownElement) {

        alarmCountdownElement.textContent =
            "Alarm successfully set.";

    }
}




function renderAlarm() {

    const alarm =
        getOfflineAlarm();


    if (!alarm) {

        if (activeAlarmSection) {
            activeAlarmSection.hidden = true;
        }

        if (alarmMessage) {
            alarmMessage.hidden = true;
        }

        return;
    }


    if (
        alarm.status ===
        "ringing"
    ) {

        showRingingUI();

        return;

    }


    if (activeAlarmSection) {

        activeAlarmSection.hidden =
            false;

    }


    if (alarmMessage) {

        alarmMessage.hidden =
            true;

    }


    if (activeAlarmTimeElement) {

        activeAlarmTimeElement.textContent =
            formatDisplayTime(
                alarm.time
            );

    }


    updateCountdown();
}




function formatDisplayTime(
    value
) {

    if (!value) {
        return "--:--";
    }


    const parts =
        value.split(":");


    let hour =
        Number(parts[0]);


    const minute =
        parts[1];


    const second =
        parts[2] || "00";


    const suffix =
        hour >= 12
            ? "PM"
            : "AM";


    hour =
        hour % 12;


    if (hour === 0) {
        hour = 12;
    }


    return `${String(hour).padStart(2, "0")}:${minute}:${second} ${suffix}`;
}




function updateCountdown() {

    const alarm =
        getOfflineAlarm();


    if (!alarm) {
        return;
    }


    if (
        alarm.status !==
        "active"
    ) {
        return;
    }


    const difference =
        Number(
            alarm.targetTimestamp
        ) -
        Date.now();


    if (difference <= 0) {

        if (alarmCountdownElement) {

            alarmCountdownElement.textContent =
                "Alarm ringing...";

        }

        return;
    }


    const totalSeconds =
        Math.floor(
            difference / 1000
        );


    const hours =
        Math.floor(
            totalSeconds / 3600
        );


    const minutes =
        Math.floor(
            (totalSeconds % 3600) /
            60
        );


    const seconds =
        totalSeconds % 60;


    if (alarmCountdownElement) {

        alarmCountdownElement.textContent =
            `Rings in ${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

    }
}




function showRingingUI() {

    if (activeAlarmSection) {

        activeAlarmSection.hidden =
            true;

    }


    if (alarmMessage) {

        alarmMessage.hidden =
            false;

    }
}




function deleteAlarm() {

    const alarm =
        getOfflineAlarm();


    if (!alarm) {
        return;
    }


    const confirmed =
        confirm(
            "Delete this alarm?"
        );


    if (!confirmed) {
        return;
    }


    stopAlarmAudio();

    deleteOfflineAlarm();


    if (activeAlarmSection) {

        activeAlarmSection.hidden =
            true;

    }


    if (alarmMessage) {

        alarmMessage.hidden =
            true;

    }


    document.title =
        "Offline Alarm • India Time";
}




function stopRingingAlarm() {

    stopOfflineAlarm();


    if (alarmMessage) {

        alarmMessage.hidden =
            true;

    }


    if (activeAlarmSection) {

        activeAlarmSection.hidden =
            true;

    }


    document.title =
        "Offline Alarm • India Time";
}




async function previewTone() {

    await unlockAlarmAudio();


    stopAlarmAudio();


    const tone =
        alarmToneSelect.value;


    if (
        tone ===
        "my-alarm"
    ) {

        if (!selectedCustomFile) {

            alert(
                "Please choose an MP3 file first."
            );

            return;

        }


        await playCustomAlarm(
            selectedCustomFile
        );


        /*
           Preview custom MP3 ko
           8 seconds baad stop.
        */

        setTimeout(
            () => {

                stopAlarmAudio();

            },
            8000
        );


        return;
    }


    await playBuiltInTone(
        tone
    );


    /*
       Preview ko 5 sec ke baad stop.
    */

    setTimeout(
        () => {

            stopAlarmAudio();

        },
        5000
    );
}




function chooseMP3() {

    if (customToneInput) {

        customToneInput.click();

    }
}




function handleMP3(event) {

    const file =
        event.target.files[0];


    if (!file) {
        return;
    }


    /*
       Sirf MP3 allow.
    */

    if (
        file.type !==
        "audio/mpeg"
    ) {

        alert(
            "Please select an MP3 file."
        );

        customToneInput.value =
            "";

        return;
    }


    selectedCustomFile =
        file;


    if (selectedFileElement) {

        selectedFileElement.textContent =
            `🎵 ${file.name}`;

    }


    /*
       Automatically select My Alarm.
    */

    if (alarmToneSelect) {

        alarmToneSelect.value =
            "my-alarm";

    }
}




function handleToneChange() {

    if (!alarmToneSelect) {
        return;
    }


    const tone =
        alarmToneSelect.value;


    if (chooseMp3Button) {

        if (
            tone ===
            "my-alarm"
        ) {

            chooseMp3Button.style.display =
                "block";

        } else {

            chooseMp3Button.style.display =
                "none";

        }

    }
}




async function restoreAlarm() {

    const alarm =
        getOfflineAlarm();


    if (!alarm) {

        renderAlarm();

        return;

    }


    /*
       Agar ringing state saved hai,
       UI ko ringing dikhao.
    */

    if (
        alarm.status ===
        "ringing"
    ) {

        showRingingUI();

        /*
           Custom file refresh ke baad
           available nahi hoti.
           Built-in tone fallback chalega.
        */

        if (
            alarm.tone !==
            "my-alarm"
        ) {

            await playBuiltInTone(
                alarm.tone
            );

        }

        return;
    }


    renderAlarm();
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




if (setAlarmButton) {

    setAlarmButton.addEventListener(
        "click",
        setAlarm
    );

}


if (deleteAlarmButton) {

    deleteAlarmButton.addEventListener(
        "click",
        deleteAlarm
    );

}


if (stopAlarmButton) {

    stopAlarmButton.addEventListener(
        "click",
        stopRingingAlarm
    );

}


if (previewToneButton) {

    previewToneButton.addEventListener(
        "click",
        previewTone
    );

}


if (chooseMp3Button) {

    chooseMp3Button.addEventListener(
        "click",
        chooseMP3
    );

}


if (customToneInput) {

    customToneInput.addEventListener(
        "change",
        handleMP3
    );

}


if (alarmToneSelect) {

    alarmToneSelect.addEventListener(
        "change",
        handleToneChange
    );

}




async function initialize() {

    updateCurrentTime();

    handleToneChange();

    await restoreAlarm();


    /*
       Common engine start.
    */

    startOfflineAlarmEngine(
        selectedCustomFile
    );
}


initialize();




setInterval(
    updateCurrentTime,
    1000
);




document.addEventListener(
    "visibilitychange",
    async () => {

        if (!document.hidden) {

            updateCurrentTime();

            await restoreAlarm();

        }

    }
);