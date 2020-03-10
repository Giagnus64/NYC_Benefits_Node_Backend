import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
import axios from 'axios';

//imports AXIOS types
import {AxiosPromise, AxiosResponse, AxiosError} from 'axios';

//import custom typing for API
import {NYCBSA} from 'nycbsa_types'


let authToken: null|string = '';
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
    .then((res: AxiosResponse)  => {
      //const parsed = JSON.parse(response.body);
      if (res.data.type === "SUCCESS") {
        authToken = res.data.token;
        console.log(authToken);
        //return response.data.token
      } else {
        authSuccess = false;
        // report failure
        console.log(res);
      }
    })
    .catch((err: AxiosError) => {
      authSuccess = false;
      console.log("Unable to connect with NYC Benefit Service");
    });
};

//setTimeout(() => sendHCD(testHousehold), 3000)
//Household Composition Data
const sendHCD = (userData: any) => {
  const url = "https://screeningapi.cityofnewyork.us/eligibilityPrograms";

  return axios({
    method: "post",
    url: url,
    data: userData,
    headers: {
      "Content-Type": "application/json",
      "cache-control": "no-cache",
      "Authorization": authToken
    }
  })
    .then((res: AxiosResponse) => {
      if (res.data.type === "SUCCESS") {
        console.log(res.data.eligiblePrograms);
        return res.data.eligiblePrograms;
      } else {
        authSuccess = false;
        // report failure
        //console.log(res);
      }
    })
    .catch((err: AxiosError) => {
      
      authSuccess = false;
      
      console.log(err.response.data.errors)
      return false
    });
};

router.get("/", async (req: Request, res: Response) => {
  if (!authToken) {
    getAuthToken();
    authSuccess
      ? res.send("Getting Token")
      : res.send("Auth request unsuccessful");
  } else {
    res.send("Token Successful");

  }
});

router.post("/sendresults", async (req: Request, res: Response) => {
  //res.send("Request recieved");
  //try catch block for errors
  const arrayified = [testData]
  const results = await sendHCD(arrayified);
  //console.log(results);
  res.send(results);
  //redirect person to page
});


module.exports = router;

const testData: NYCBSA.RequestConfig =
{

    "household": [
        {
            "cashOnHand": "5000",
            "livingRentalType": "RentControlled",
            "livingRenting": true,
            "livingOwner": false,
            "livingStayingWithFriend": false,
            "livingHotel": false,
            "livingShelter": false,
            "livingPreferNotToSay": false
        }
    ],
    "person": [
        {
            "age": "28",
            "householdMemberType": "HeadOfHousehold",
            "livingRentalOnLease": true,
            "unemployed": true,
            "unemployedWorkedLast18Months": true,
            "benefitsMedicaid": true,
            "livingOwnerOnDeed": false,
            "student": false,
            "studentFulltime": false,
            "pregnant": false,
            "blind": false,
            "disabled": false,
            "veteran": false,
            "benefitsMedicaidDisability": false,
            "incomes": [
                {
                    "amount": "30",
                    "type": "Wages",
                    "frequency": "Weekly"
                },
                {
                    "amount": "20",
                    "type": "SelfEmployment",
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
    "withholdPayload": true
};

// const testData = 
//     {
//       "household": [
//         {
//           "cashOnHand": "5000",
//           "livingRentalType": "RentControlled",
//           "livingRenting": "true",
//           "livingOwner": "false",
//           "livingStayingWithFriend": "false",
//           "livingHotel": "false",
//           "livingShelter": "false",
//           "livingPreferNotToSay": "false"
//         }
//       ],
//       "person": [
//         {
//           "age": "35",
//           "householdMemberType": "HeadOfHousehold",
//           "livingRentalOnLease": "true",
//           "unemployed": "true",
//           "unemployedWorkedLast18Months": "true",
//           "benefitsMedicaid": "true",
//           "livingOwnerOnDeed": "false",
//           "student": "false",
//           "studentFulltime": "false",
//           "pregnant": "false",
//           "blind": "false",
//           "disabled": "false",
//           "veteran": "false",
//           "benefitsMedicaidDisability": "false",
//           "incomes": [
//             {
//               "amount": "200",
//               "type": "SelfEmployment",
//               "frequency": "Biweekly"
//             },
//             {
//               "amount": "200",
//               "type": "Gifts",
//               "frequency": "Monthly"
//             }
//           ],
//           "expenses": [
//             {
//               "amount": "1600",
//               "type": "Rent",
//               "frequency": "Monthly"
//             }
//           ]
//         }
//       ],
//       "withholdPayload": "true"
//     }
  

//TODO: Establish Requests are working with correct typings, might have to stringify the JSON
//TODO: Make another file with Benefits and Programs API, configure that Api



