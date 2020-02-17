//const express = require('express');
// const app = express();
const axios = require('axios').default;

const url = 'https://screeningapi.cityofnewyork.us/authToken';

let authToken;

axios({
    method: 'post',
    url: url,
    data: {
        "username": "gianfranconuschese",
        "password": "Checkup!234"
    },
    headers: {
    'Content-Type': 'application/json',
    'cache-control': 'no-cache'
    }
})
.then((response) => {
    //const parsed = JSON.parse(response.body);
    if(response.data.type === 'SUCCESS'){
        authToken = response.data.token
        //return response.data.token
    } else{
        // report failure
    }
    
})
.catch((err) => {
    console.log(err)
})

setTimeout(() => console.log(authToken), 3000)


// app.get('/', (req, res) => {
//     res.send("Hello world");
// });

// //PORT
// const port = process.env.PORT || 3000

// app.listen(port, () => console.log(`Listening on ${port}`))