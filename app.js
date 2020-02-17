const express = require('express');
const app = express();
const request = require('request');

app.get('/', (req, res) => {
    res.send("Hello world");
});

//PORT
const port = process.env.PORT || 3000

app.listen(port, () => console.log(`Listening on ${port}`))