import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
import axios from 'axios';

//imports AXIOS types
import {AxiosPromise, AxiosResponse, AxiosError} from 'axios';

//import custom typing for API
import {NYCBSA} from 'nycbsa_types'


let authToken: null|string = 'eyJraWQiOiJpeXZKUEozY0d4SjJBb2ZlTHU5SjB3WFNtVzd0MmRtNmtyWW5adUtyZWVzPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJjNjYzYTFhMy1lMTU0LTQxMDktYjZiZi03MDE0NTFjMDE5YjUiLCJhdWQiOiJscXJxZmEyOHEzNW44YThsYmlvZjdzbzJkIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiNGEyNmQyZjctYmIzZC00OGE0LWJmZDgtMjVjZWFkNDQ2ZGM0IiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1ODM1MjM0MTEsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX25DandGUllLNSIsImNvZ25pdG86dXNlcm5hbWUiOiJnaWFuZnJhbmNvbnVzY2hlc2UiLCJleHAiOjE1ODM1MjcwMTEsImlhdCI6MTU4MzUyMzQxMSwiZW1haWwiOiJnaWFuZnJhbmNvbnVzY2hlc2VAZ21haWwuY29tIn0.bUzelq58FkfwO-Pdd9-FiozjSdj_pKj-oFibrlNrWqgNyyaJfhkv287cfrpHSpY366nJSiKWwsXN_sbCPg-tR4aS_B0JKJxHr_z4q1l3Y05JpRCYMYNBQDU8mOQ12rBphLlv45cDVWSHmgvfn4Wy5Ge74bO7pkw0F-JuJge7YEP-mznrXGWopRRJj29Z84Ul-VM9p1hO6MQa2GvWlf2PjwX8vqxV3jx9q6rL0kmohx8O4MxoClx0b7iakYMzp70u43aznrq844CElcAAP0ooZ90EL-FfhZC550dp0ruqQ1jW_Vcv8EhBn2K3kgtAfEr2OhLm_19MbB9QGZQwgJikxQ';
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
      console.log(err.request)
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
  const results = await sendHCD(arrayified)
  res.send(results);
  //redirect person to page
});


module.exports = router;

const testData: NYCBSA.RequestConfig =
{

    "household": [
        {
            "cashOnHand": 5000,
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
            "age": 28,
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
                    "amount": 30,
                    "type": "Wages",
                    "frequency": "Weekly"
                },
                {
                    "amount": 20,
                    "type": "SelfEmployment",
                    "frequency": "Weekly"
                }
            ],
            "expenses": [
                {
                    "amount": 1650,
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



