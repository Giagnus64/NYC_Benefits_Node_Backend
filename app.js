const express = require('express');
const app = express();
const axios = require('axios').default;
const api = require('./api.js');
const port = process.env.PORT || 3000;

app.use(express.json());
app.use('/api', api);

app.get('/', (req, res) => {
    res.redirect(300, '/api')
});

app.listen(port, () => console.log(`Listening on ${port}`))

const testHousehold = [
  {
    "household": [
      {
        "cashOnHand": "5000",
        "livingRentalType": "RentControlled",
        "livingRenting": "true",
        "livingOwner": "false",
        "livingStayingWithFriend": "false",
        "livingHotel": "false",
        "livingShelter": "false",
        "livingPreferNotToSay": "false"
      }
    ],
    "person": [
      {
        "age": "28",
        "householdMemberType": "HeadOfHousehold",
        "livingRentalOnLease": "true",
        "unemployed": "true",
        "unemployedWorkedLast18Months": "true",
        "benefitsMedicaid": "true",
        "livingOwnerOnDeed": "false",
        "student": "false",
        "studentFulltime": "false",
        "pregnant": "false",
        "blind": "false",
        "disabled": "false",
        "veteran": "false",
        "benefitsMedicaidDisability": "false",
        "incomes": [
          {
            "amount": "0",
            "type": "Wages",
            "frequency": "Weekly"
          }
        ],
        "expenses": [
          {
            "amount": "1650",
            "type": "Rent",
            "frequency": "Monthly"
          }
        ]
      }
    ],
    "withholdPayload": "true"
  }
];