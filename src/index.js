const express = require('express');
const { addRecordWithTTL , getRecord} = require("./redisClient");
const { getUUID } = require("./getUUID")

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.post('/', async (req, res) => {
    const { link } = req.body;

    if (!link) {
        return res.status(400).json({ error: 'Link is required.' });
    }

    try {
        let uuid = getUUID()

        await addRecordWithTTL(uuid + "", link, 3600);
        res.status(200).json({ 
            message: 'Link saved successfully.' ,
            shortendLink : `http://localhost:${PORT}/${uuid + ""}`
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to save link in the database.' });
    }
});

app.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const link = await getRecord(id);

        if (link) {
            const formattedLink = link.startsWith('http://') || link.startsWith('https://') ? link : `http://${link}`;
            
            res.redirect(formattedLink);
        } else {
            res.status(404).json({ error: 'Link not found or may have expired.' });
        }
    } catch (err) {
        res.status(500).json({ error: 'Failed to retrieve link. There was an error processing the request.' });
    }
});



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
