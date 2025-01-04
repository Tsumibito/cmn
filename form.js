document.addEventListener("DOMContentLoaded", () => {
    let userIP = '';

    /**
     * Fetches the user's public IP address using the ipify API.
     */
    async function fetchUserIP() {
        try {
            const response = await fetch("https://api.ipify.org?format=json");
            if (!response.ok) throw new Error('Failed to fetch IP address.');
            const data = await response.json();
            userIP = data.ip;
            console.log("IP received:", userIP);
        } catch (error) {
            console.error("Error fetching IP:", error);
        }
    }

    /**
     * Populates the hidden 'data' field with necessary information in JSON format.
     */
    function fillDataField() {
        if (!userIP) {
            console.warn('IP address not yet fetched. Data field will be filled after fetching IP.');
            return;
        }

        const dataField = document.getElementById('data');
        if (!dataField) {
            console.error('Element with id="data" not found.');
            return;
        }

        // Determine the language based on the URL
        const lang = window.location.href.includes('/en/') ? 'EN' : 'FR';

        // Get the current page URL
        const pageURL = window.location.href;

        // Get the current date in ISO format (YYYY-MM-DD)
        const currentDate = new Date().toISOString().split('T')[0];

        // Get the current time in 24-hour format (HH:MM)
        const currentTime = new Date().toLocaleTimeString('en-GB', { 
            hour12: false, 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        // Create the JSON object with the collected data
        const formData = {
            Lang: lang,
            URL: pageURL,
            Date: currentDate,
            Time: currentTime,
            IP: userIP
        };

        // Set the value of the hidden 'data' field
        dataField.value = JSON.stringify(formData);
        console.log('Data field populated:', dataField.value);
    }

    // Cache DOM elements to avoid repeated queries
    const submitButton = document.getElementById('form_submit');
    const form = document.getElementById('Form-Content');

    if (submitButton) {
        /**
         * Event handler for the 'click' event on the submit button.
         */
        submitButton.addEventListener('click', () => {
            fillDataField();
        });

        /**
         * Event handler for the 'mouseenter' event on the submit button.
         * Optional: Debounce if necessary to prevent multiple rapid calls.
         */
        submitButton.addEventListener('mouseenter', () => {
            fillDataField();
        });
    } else {
        console.error('Submit button with id="form_submit" not found.');
    }

    if (form) {
        /**
         * Event handler for the 'submit' event on the form.
         * Ensures that the 'data' field is populated before submission.
         */
        form.addEventListener('submit', (event) => {
            const dataField = document.getElementById('data');
            if (dataField && dataField.value === "") {
                console.warn('Data field is empty. Populating before submission.');
                fillDataField();

                // Delay form submission to ensure the 'data' field is filled
                setTimeout(() => {
                    form.submit();
                }, 100);

                // Prevent the initial form submission
                event.preventDefault();
            }
        });
    } else {
        console.error('Form with id="Form-Content" not found.');
    }

    // Initiate the IP fetching process
    fetchUserIP();
});
