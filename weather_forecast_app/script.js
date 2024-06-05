document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'XAW4E7XSTDNGQNP6GXBD7UK2Y';
    const urlTemplate = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/{0}/{1}/{2}?unitGroup=metric&key={3}&lang=ua&contentType=json';
    let lastJson;

    document.getElementById('search').addEventListener('click', async function() {
        const city = document.getElementById('city').value;
        const period = document.querySelector('input[name="period"]:checked').value;
        const dateFrom = new Date().toISOString().split('T')[0];
        const days = period === 'today' ? 0 : period === '7days' ? 6 : 13;
        const dateTo = new Date();
        dateTo.setDate(dateTo.getDate() + days);
        const formattedDateTo = dateTo.toISOString().split('T')[0];

        const url = urlTemplate.replace('{0}', city).replace('{1}', dateFrom).replace('{2}', formattedDateTo).replace('{3}', apiKey);
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Network response was not ok');
            lastJson = await response.json();
            let forecastText = '';
            lastJson.days.forEach(day => {
                const date = new Date(day.datetime).toLocaleDateString('ua-UA');
                const conditions = day.description;
                const maxTemp = day.tempmax;
                const minTemp = day.tempmin;
                forecastText += `Дата: ${date}\nПогодні умови: ${conditions}\nМаксимальна температура: ${maxTemp}°C\nМінімальна температура: ${minTemp}°C\n\n`;
            });
            document.getElementById('forecast').value = forecastText;
        } catch (error) {
            console.error('Fetch error: ', error);
        }
    });

    document.getElementById('saveAsText').addEventListener('click', function() {
        const text = document.getElementById('forecast').value;
        const city = document.getElementById('city').options[document.getElementById('city').selectedIndex].text;
        const fileName = `${city} ${new Date().toLocaleDateString('ua-UA')}.txt`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });

    document.getElementById('saveAsJson').addEventListener('click', function() {
        const json = JSON.stringify(lastJson, null, 2);
        const city = document.getElementById('city').options[document.getElementById('city').selectedIndex].text;
        const fileName = `${city} ${new Date().toLocaleDateString('ua-UA')}.json`;
        const blob = new Blob([json], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    });
});
