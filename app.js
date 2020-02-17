const express = require('express');
const app = express();
const axios = require('axios').default;
const port = process.env.PORT || 3000;


let authToken = null;
let authSuccess = true;

const getAuthToken = () => {
    const url = "https://screeningapi.cityofnewyork.us/authToken";

    axios({
      method: "post",
      url: url,
      data: {
        username: "gianfranconuschese",
        password: "Checkup!234"
      },
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache"
      }
    })
      .then(response => {
        //const parsed = JSON.parse(response.body);
        if (response.data.type === "SUCCESS") {
          authToken = response.data.token;
          //return response.data.token
        } else {
            authSuccess = false;
          // report failure
            console.log(response)
        }
      })
      .catch(err => {
        authSuccess = false;
        console.log("Unable to connect with NYC Benefit Service");
      });
}


//setTimeout(() => console.log(authToken), 3000)


app.get('/', (req, res) => {
    if(!authToken){
        getAuthToken();
        authSuccess ? res.send("Getting Token") : res.send("Auth request unsuccessful")
    } else{
        res.send("Token Successful")
    }
});

app.post('/sendResults', (req, res) => {
    res.send("Here are your results");
})

//PORT


app.listen(port, () => console.log(`Listening on ${port}`))