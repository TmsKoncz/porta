// Clock function to update every second
function updateClock() {
    const now = new Date();
    const clockElement = document.getElementById('clock');
    clockElement.textContent = now.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
}

setInterval(updateClock, 1000);
updateClock();

// Function to fetch data from BKK API and display it
async function fetchDepartures() {
    const urls = [
        'https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop?minutesBefore=2&minutesAfter=30&stopId=BKK_F03329&includeRouteId=BKK_0450&includeRouteId=BKK_0920&includeRouteId=BKK_0921&onlyDepartures=false&limit=10&lat=47.5190576&lon=19.2303757&radius=100&minResult=5&appVersion=1.1.abc&version=4&includeReferences=true&key=ac123998-5f7a-4cfa-85b0-beceecfc41cb',  // First URL
        'https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop?minutesBefore=2&minutesAfter=30&stopId=BKK_F03328&includeRouteId=BKK_0460&includeRouteId=BKK_1460&onlyDepartures=false&limit=10&lat=47.5190576&lon=19.2303757&radius=100&minResult=5&appVersion=1.1.abc&version=4&includeReferences=true&key=ac123998-5f7a-4cfa-85b0-beceecfc41cb',  // Second URL
        'https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop?minutesBefore=2&minutesAfter=30&stopId=BKK_19841&includeRouteId=BKK_H8&onlyDepartures=false&limit=10&lat=47.5190576&lon=19.2303757&radius=100&minResult=5&appVersion=1.1.abc&version=4&includeReferences=true&key=ac123998-5f7a-4cfa-85b0-beceecfc41cb',  // Third URL
        'https://futar.bkk.hu/api/query/v1/ws/otp/api/where/arrivals-and-departures-for-stop?minutesBefore=2&minutesAfter=30&stopId=BKK_F03327&includeRouteId=BKK_0460&onlyDepartures=false&limit=10&lat=47.5190576&lon=19.2303757&radius=100&minResult=5&appVersion=1.1.abc&version=4&includeReferences=true&key=ac123998-5f7a-4cfa-85b0-beceecfc41cb'   // Fourth URL
    ];

    let allDepartures = [];

    // Fetching data from each URL
    for (const url of urls) {
        try {
            const response = await fetch(url);
            const data = await response.json();
            allDepartures = allDepartures.concat(data.data.entry.arrivalsAndDepartures);
        } catch (error) {
            console.error('Failed to fetch data from', url, error);
        }
    }

    // Sort by departure time
    allDepartures.sort((a, b) => a.scheduledDeparture - b.scheduledDeparture);

    // Displaying the next 9 departures
    const tableBody = document.getElementById('departure-table');
    tableBody.innerHTML = '';

    allDepartures.slice(0, 9).forEach(departure => {
        const row = document.createElement('tr');

        const lineCell = document.createElement('td');
        lineCell.textContent = departure.routeShortName;
        row.appendChild(lineCell);

        const destinationCell = document.createElement('td');
        destinationCell.textContent = departure.tripHeadsign;
        row.appendChild(destinationCell);

        const departureTimeCell = document.createElement('td');
        const departureTime = new Date(departure.scheduledDeparture * 1000);
        departureTimeCell.textContent = departureTime.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
        row.appendChild(departureTimeCell);

        const minutesCell = document.createElement('td');
        const minutesLeft = Math.round((departure.scheduledDeparture * 1000 - Date.now()) / 60000);
        minutesCell.textContent = `${minutesLeft} perc`;
        row.appendChild(minutesCell);

        const exitCell = document.createElement('td');
        exitCell.textContent = departure.stopId.split('_')[1];  // Extracting exit info
        row.appendChild(exitCell);

        tableBody.appendChild(row);
    });
}

// Fetch departures every 30 seconds
setInterval(fetchDepartures, 30000);
fetchDepartures();

// Assuming `data` is the object from the API response
const stopTimes = data.data.entry.stopTimes;

// Initialize an empty array to hold departure times
const departures = [];

// Loop through the stopTimes and extract departure times
stopTimes.forEach(stop => {
    const departure = {
        stopId: stop.stopId,
        stopHeadsign: stop.stopHeadsign,
        actualDeparture: stop.departureTime, // Scheduled departure time
        predictedDeparture: stop.predictedDepartureTime // Predicted departure time, if available
    };

    // Push the departure data into the array
    departures.push(departure);
});

console.log(departures);
