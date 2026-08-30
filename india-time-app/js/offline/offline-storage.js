


const OFFLINE_ALARM_KEY = "indiaTimeOfflineAlarm";
const OFFLINE_TIMER_KEY = "indiaTimeOfflineTimer";



export function saveOfflineAlarm(alarm) {
    localStorage.setItem(
        OFFLINE_ALARM_KEY,
        JSON.stringify(alarm)
    );
}


export function getOfflineAlarm() {
    try {
        const data = localStorage.getItem(
            OFFLINE_ALARM_KEY
        );

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Alarm storage error:",
            error
        );

        return null;
    }
}


export function deleteOfflineAlarm() {
    localStorage.removeItem(
        OFFLINE_ALARM_KEY
    );
}



export function saveOfflineTimer(timer) {
    localStorage.setItem(
        OFFLINE_TIMER_KEY,
        JSON.stringify(timer)
    );
}


export function getOfflineTimer() {
    try {
        const data = localStorage.getItem(
            OFFLINE_TIMER_KEY
        );

        if (!data) {
            return null;
        }

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "Timer storage error:",
            error
        );

        return null;
    }
}


export function deleteOfflineTimer() {
    localStorage.removeItem(
        OFFLINE_TIMER_KEY
    );
}
