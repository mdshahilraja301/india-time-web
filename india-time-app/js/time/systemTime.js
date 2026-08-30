export function getSystemTime() {
    return new Date();
}


export function formatSystemTime() {

    const now = getSystemTime();

    return new Intl.DateTimeFormat("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true
    }).format(now);
}


export function formatSystemDate() {

    const now = getSystemTime();

    return new Intl.DateTimeFormat("en-IN", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric"
    }).format(now);
}
