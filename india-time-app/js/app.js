
import {
    getIndiaTime
} from "./time/timeService.js";


 

const timeElement =
    document.getElementById("india-time");

const dateElement =
    document.getElementById("india-date");

const statusElement =
    document.getElementById("status");


 

let serverTimestamp = null;

 
let switchingToOffline = false;

 

function switchToOffline() {

    

    if (switchingToOffline) {

        return;

    }


    switchingToOffline = true;


    console.log(
        "Switching to Offline Mode..."
    );


     

    window.location.replace(
        "./offline.html"
    );

}




async function syncIndiaTime() {

    try {

        

        if (!navigator.onLine) {

            if (statusElement) {

                statusElement.textContent =
                    "📴 Internet disconnected";

            }


            switchToOffline();

            return;

        }


         

        const result =
            await getIndiaTime();


        

        serverTimestamp =
            result.serverTimestamp;


        

        updateClock();


         

        if (statusElement) {

            statusElement.textContent =
                "Connected • IST Server";

        }


        console.log(
            "✓ India Time synchronized"
        );


    } catch (error) {

        console.error(
            "India Time synchronization failed:",
            error
        );


        if (statusElement) {

            statusElement.textContent =
                "📴 Server unavailable";

        }


         

        switchToOffline();

    }

}


 

function updateClock() {

     

    if (
        serverTimestamp === null
    ) {

        return;

    }


     

    const now =
        new Date(serverTimestamp);

 
    const time =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",

                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",

                hour12: true
            }
        ).format(now);


    

    const date =
        new Intl.DateTimeFormat(
            "en-IN",
            {
                timeZone: "Asia/Kolkata",

                weekday: "long",

                day: "2-digit",

                month: "long",

                year: "numeric"
            }
        ).format(now);


    

    if (timeElement) {

        timeElement.textContent =
            time;

    }


   

    if (dateElement) {

        dateElement.textContent =
            date;

    }


     

    serverTimestamp += 1000;

}


 

window.addEventListener(
    "offline",
    () => {

        console.warn(
            "📴 Internet connection lost"
        );


        if (statusElement) {

            statusElement.textContent =
                "📴 Switching to Offline Mode...";

        }


         

        switchToOffline();

    }
);


 

window.addEventListener(
    "online",
    () => {

        console.log(
            "🌐 Internet connection detected"
        );


         

        syncIndiaTime();

    }
);


 

async function startApp() {

    /*
     * If there is no internet
     * when index.html opens.
     */

    if (!navigator.onLine) {

        switchToOffline();

        return;

    }


    
    await syncIndiaTime();

}


 

startApp();


 

setInterval(
    updateClock,
    1000
);


 
setInterval(
    async () => {

        /*
         * Check browser connection first.
         */

        if (!navigator.onLine) {

            switchToOffline();

            return;

        }


        

        try {

            const result =
                await getIndiaTime();


            serverTimestamp =
                result.serverTimestamp;


            updateClock();


            if (statusElement) {

                statusElement.textContent =
                    "Connected • IST Server";

            }


        } catch (error) {

            console.warn(
                "IST server check failed."
            );


            switchToOffline();

        }

    },

    

    30000
);
