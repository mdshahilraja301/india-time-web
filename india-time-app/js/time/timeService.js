 

const TIME_API_URL =
    "https://utctime.app/api/now";

 
 

export async function getIndiaTime() {

    try {

        const response =
            await fetch(
                TIME_API_URL,
                {
                    cache: "no-store"
                }
            );


        

        if (!response.ok) {

            throw new Error(
                `Time server error: ${response.status}`
            );

        }


         

        const data =
            await response.json();


       

        if (!data.unix_ms) {

            throw new Error(
                "Server timestamp not received"
            );

        }


       

        return {

            serverTimestamp:
                Number(data.unix_ms)

        };


    } catch (error) {

        /*
         * IMPORTANT:
         *
         * Error ko hide nahi karna hai.
         *
         * app.js is error ko detect karke
         * Offline Mode par switch karega.
         */

        console.error(
            "India Time Server unavailable:",
            error
        );


        throw error;

    }

}
