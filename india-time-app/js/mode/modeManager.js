import {
    formatSystemTime,
    formatSystemDate
} from "../time/systemTime.js";




const systemTime =
    document.getElementById("system-time");

const systemDate =
    document.getElementById("system-date");

const onlineModeButton =
    document.getElementById("online-mode-btn");

const connectionStatus =
    document.getElementById("connection-status");



function updateSystemClock() {

    if (!systemTime || !systemDate) {
        return;
    }

    systemTime.textContent =
        formatSystemTime();

    systemDate.textContent =
        formatSystemDate();
}




async function checkInternetConnection() {

    if (!navigator.onLine) {
        return false;
    }


    try {

        /*
            Try to reach a small online resource.

            cache: no-store means browser should
            make a fresh request.
        */

        const response =
            await fetch(
                "https://www.google.com/favicon.ico",
                {
                    method: "HEAD",
                    cache: "no-store",
                    mode: "no-cors"
                }
            );


        /*
            With no-cors the response can be opaque,
            but successful fetch means connection
            was available.
        */

        return true;

    } catch (error) {

        return false;
    }
}




async function goOnline() {

    connectionStatus.textContent =
        "🌐 Checking internet connection...";


    const connected =
        await checkInternetConnection();


    if (!connected) {

        connectionStatus.textContent =
            "❌ Internet is not available yet.";

        return;
    }


    connectionStatus.textContent =
        "🌐 Internet connected. Opening Online Mode...";


    setTimeout(
        () => {

            window.location.href =
                "./index.html";

        },
        500
    );
}



if (onlineModeButton) {

    onlineModeButton.addEventListener(
        "click",
        goOnline
    );
}




window.addEventListener(
    "online",
    async () => {

        connectionStatus.textContent =
            "🌐 Internet detected. Checking connection...";


        const connected =
            await checkInternetConnection();


        if (connected) {

            connectionStatus.textContent =
                "✓ Internet connected. You can switch to Online Mode.";

        }

    }
);




window.addEventListener(
    "offline",
    () => {

        connectionStatus.textContent =
            "📴 Internet disconnected. Offline Mode is active.";

    }
);




async function updateConnectionStatus() {

    if (!navigator.onLine) {

        connectionStatus.textContent =
            "📴 No internet • System time is being used.";

        return;
    }


    const connected =
        await checkInternetConnection();


    if (connected) {

        connectionStatus.textContent =
            "🌐 Internet available • Offline Mode is active.";

    } else {

        connectionStatus.textContent =
            "📴 Internet unavailable • System time is being used.";

    }
}




updateSystemClock();

updateConnectionStatus();




setInterval(
    updateSystemClock,
    1000
);




setInterval(
    async () => {

        const connected =
            await checkInternetConnection();


        if (connected) {

            connectionStatus.textContent =
                "🌐 Internet available • You can go Online.";

        } else {

            connectionStatus.textContent =
                "📴 Offline Mode • System time is active.";

        }

    },
    10000
);
