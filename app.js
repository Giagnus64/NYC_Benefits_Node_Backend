const express = require('express');
const app = express();
const axios = require('axios').default;
const port = process.env.PORT || 3000;


let authToken =
  "eyJraWQiOiJpeXZKUEozY0d4SjJBb2ZlTHU5SjB3WFNtVzd0MmRtNmtyWW5adUtyZWVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNjYzYTFhMy1lMTU0LTQxMDktYjZiZi03MDE0NTFjMDE5YjUiLCJhdWQiOiJscXJxZmEyOHEzNW44YThsYmlvZjdzbzJkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiZTUyMTZiYTItZjZiYi00YTVmLWE2OTUtMTM2YzA1ZmJkYTllIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1ODIyMzAzMTQsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX25DandGUllLNSIsImNvZ25pdG86dXNlcm5hbWUiOiJnaWFuZnJhbmNvbnVzY2hlc2UiLCJleHAiOjE1ODIyMzM5MTQsImlhdCI6MTU4MjIzMDMxNCwiZW1haWwiOiJnaWFuZnJhbmNvbnVzY2hlc2VAZ21haWwuY29tIn0.ZzffB_2KqV31oI9jfOJbrGz8mIV_VXTIFJnrfc6jauGCjPOn_iDHJa89QUTrEZV3h04S4q99W195v43Hjv8r5Ywma29bhkOHVht5tBOHMihNzFgLW4ooihI79GAJ_xmvr1z5nz5x6Yn6NQQUn0IJ5voGWgGXj7_fQF1JFSCRUupw1VX1_x1bJu67wapjOIeTk1WNtVsRbY54xCb4Hx-kQaVnmAmklSF5OMAKGh0TRABtbMWelFyBjkKrPjtvwOlI83Zq85cTceucdHdmVe2zoC1nmXTrO39M5EYpA54CZBkuLsXlyMToA8F8RJqHSNppdeO_FkLf7x6VICTE8qwP2g";
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


//setTimeout(() => sendHCD(testHousehold), 3000)
//Household Composition Data
const sendHCD = (results) => {
    const url = "https://screeningapi.cityofnewyork.us/eligibilityPrograms";

    axios({
      method: "post",
      url: url,
      data: results,
      headers: {
        "Content-Type": "application/json",
        "cache-control": "no-cache",
        "Authorization": authToken
      },
    })
      .then(response => {
        if (response.data.type === "SUCCESS") {
          console.log(response.data.eligiblePrograms)
          return response.data.eligiblePrograms
        } else {
          authSuccess = false;
          // report failure
          console.log(response);
        }
      })
      .catch(err => {
        authSuccess = false;
        console.log("Unable to connect with NYC Benefit Service");
      });
}

app.get('/', (req, res) => {
    // if(!authToken){
    //     getAuthToken();
    //     authSuccess ? res.send("Getting Token") : res.send("Auth request unsuccessful")
    // } else{
    //     res.send("Token Successful")
    // }
    res.send(sendHCD(testHousehold));
});

app.post('/sendresults', (req, res) => {
    
})

//PORT


app.listen(port, () => console.log(`Listening on ${port}`))

const testHousehold = [
  {
    household: [
      {
        cashOnHand: "5000",
        livingRentalType: "RentControlled",
        livingRenting: "true",
        livingOwner: "false",
        livingStayingWithFriend: "false",
        livingHotel: "false",
        livingShelter: "false",
        livingPreferNotToSay: "false"
      }
    ],
    person: [
      {
        age: "28",
        householdMemberType: "HeadOfHousehold",
        livingRentalOnLease: "true",
        unemployed: "true",
        unemployedWorkedLast18Months: "true",
        benefitsMedicaid: "true",
        livingOwnerOnDeed: "false",
        student: "false",
        studentFulltime: "false",
        pregnant: "false",
        blind: "false",
        disabled: "false",
        veteran: "false",
        benefitsMedicaidDisability: "false",
        incomes: [
          {
            amount: "0",
            type: "Wages",
            frequency: "Weekly"
          }
        ],
        expenses: [
          {
            amount: "1650",
            type: "Rent",
            frequency: "Monthly"
          }
        ]
      }
    ],
    withholdPayload: "true"
  }
];