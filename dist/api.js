"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const axios_1 = __importDefault(require("axios"));
let authToken = '';
let authSuccess = true;
const getAuthToken = () => {
    const url = "https://screeningapi.cityofnewyork.us/authToken";
    axios_1.default({
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
        .then((res) => {
        //const parsed = JSON.parse(response.body);
        if (res.data.type === "SUCCESS") {
            authToken = res.data.token;
            console.log(authToken);
            //return response.data.token
        }
        else {
            authSuccess = false;
            // report failure
            console.log(res);
        }
    })
        .catch((err) => {
        authSuccess = false;
        console.log("Unable to connect with NYC Benefit Service");
    });
};
//setTimeout(() => sendHCD(testHousehold), 3000)
//Household Composition Data
const sendHCD = (userData) => {
    const url = "https://screeningapi.cityofnewyork.us/eligibilityPrograms";
    return axios_1.default({
        method: "post",
        url: url,
        data: userData,
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache",
            "Authorization": authToken
        }
    })
        .then((res) => {
        if (res.data.type === "SUCCESS") {
            console.log(res.data.eligiblePrograms);
            return res.data.eligiblePrograms;
        }
        else {
            authSuccess = false;
            // report failure
            //console.log(res);
        }
    })
        .catch((err) => {
        authSuccess = false;
        console.log(err.response.data.errors);
        return false;
    });
};
router.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!authToken) {
        getAuthToken();
        authSuccess
            ? res.send("Getting Token")
            : res.send("Auth request unsuccessful");
    }
    else {
        res.send("Token Successful");
    }
}));
router.post("/sendresults", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //res.send("Request recieved");
    //try catch block for errors
    const arrayified = [testData];
    const results = yield sendHCD(arrayified);
    //console.log(results);
    res.send(results);
    //redirect person to page
}));
module.exports = router;
const testData = {
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
//# sourceMappingURL=api.js.map