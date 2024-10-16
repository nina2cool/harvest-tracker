const express = require('express');
const cors = require('cors');
const https = require("https");
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());

var options = {
    protocol: "https:",
    hostname: "api.harvestapp.com",
    headers: {
        "User-Agent": "Node.js Harvest API Sample",
        "Authorization": "Bearer " + process.env.HARVEST_ACCESS_TOKEN,
        "Harvest-Account-ID": process.env.HARVEST_ACCOUNT_ID
    }
}

app.get('/api/time-entries', (req, res) => {

    options.path = "/v2/time_entries?from=2024-10-01";

    https.get(options, (apiRes) => { // Renamed the `res` variable to `apiRes` to avoid confusion
        const { statusCode } = apiRes;

        if (statusCode !== 200) {
            console.error(`Request failed with status: ${statusCode}`);
            res.status(statusCode).json({ error: `Request failed with status: ${statusCode}` }); // Send error response to the client
            return;
        }

        apiRes.setEncoding('utf8');
        let rawData = '';
        apiRes.on('data', (chunk) => { rawData += chunk; });
        apiRes.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                res.json(parsedData); // Send the parsed data back to the client
            } catch (e) {
                console.error(e.message);
                res.status(500).json({ error: 'Error parsing API response' }); // Send parse error response to the client
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        res.status(500).json({ error: `Request error: ${e.message}` }); // Send request error response to the client
    });
});

app.get('/api/users', (req, res) => {

    options.path = "/v2/users?is_active=true";

    https.get(options, (apiRes) => {
        const { statusCode } = apiRes;

        if (statusCode !== 200) {
            console.error(`Request failed with status: ${statusCode}`);
            res.status(statusCode).json({ error: `Request failed with status: ${statusCode}` }); // Send error response to the client
            return;
        }

        apiRes.setEncoding('utf8');
        let rawData = '';
        apiRes.on('data', (chunk) => { rawData += chunk; });
        apiRes.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                res.json(parsedData); // Send the parsed data back to the client
            } catch (e) {
                console.error(e.message);
                res.status(500).json({ error: 'Error parsing API response' }); // Send parse error response to the client
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        res.status(500).json({ error: `Request error: ${e.message}` }); // Send request error response to the client
    });

});

app.get('/api/roles', (req, res) => {

    options.path = "/v2/roles";

    https.get(options, (apiRes) => {
        const { statusCode } = apiRes;

        if (statusCode !== 200) {
            console.error(`Request failed with status: ${statusCode}`);
            res.status(statusCode).json({ error: `Request failed with status: ${statusCode}` }); // Send error response to the client
            return;
        }

        apiRes.setEncoding('utf8');
        let rawData = '';
        apiRes.on('data', (chunk) => { rawData += chunk; });
        apiRes.on('end', () => {
            try {
                const parsedData = JSON.parse(rawData);
                res.json(parsedData); // Send the parsed data back to the client
            } catch (e) {
                console.error(e.message);
                res.status(500).json({ error: 'Error parsing API response' }); // Send parse error response to the client
            }
        });
    }).on('error', (e) => {
        console.error(`Got error: ${e.message}`);
        res.status(500).json({ error: `Request error: ${e.message}` }); // Send request error response to the client
    });

});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
