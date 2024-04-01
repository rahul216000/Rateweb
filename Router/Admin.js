const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require("path");

const UserAccount = require('../Model/UserAccount');
const SendEmail = require("../Messages/SendEmail")


router.post("/send-data", async (req, res) => {

    try {
        const UID = req.cookies.UID;
        let { weightarray, tuncharray, fileselected } = req.body;

        weightarray = JSON.parse(weightarray);
        weightarray = Object.values(weightarray);

        tuncharray = JSON.parse(tuncharray);
        tuncharray = Object.values(tuncharray);

        let username = await UserAccount.findOne({ "_id": UID });
        username = username.email;

        let TotalFineArr = []

        for (let i = 0; i < weightarray.length; i++) {
            let weight = weightarray[i]
            let tnch = tuncharray[i]
            let fine = weight * tnch / 100;
            fine = fine.toFixed(3);

            TotalFineArr.push(fine)
        }

        let TotalWeight = sumArray(weightarray).toFixed(3)
        let TotalFine = sumArray(TotalFineArr).toFixed(3)

        await SendDataViaEmail(username, fileselected, weightarray, tuncharray, TotalFineArr, TotalWeight, TotalFine);

        res.send("ok")

    } catch (error) {
        console.log(error);
        res.send("Error")
    }


})

function sumArray(arr) {
    let sum = 0;
    for (let i = 0; i < arr.length; i++) {
        sum += parseFloat(arr[i]);
    }
    return sum;
}

async function SendDataViaEmail(username, fileselected, weightarray, tuncharray, TotalFineArr, TotalWeight, TotalFine){

    const sender = {
        email: 'rastogi.rahul.21600@gmail.com',
        name: `${username} - Rateweb App`,
    }

    let data = ""

    for (let i = 0; i < weightarray.length; i++) {
        data+=`
        <div class="row">
          <div class="vertical-column">
            <div class="vertical-column-content" style="background-color: #FFE6E6;">
              <h3>${weightarray[i]}</h3>
            </div>
          </div>
          <div class="vertical-column">
            <div class="vertical-column-content" style="background-color: #E1AFD1;">
              <h3>${tuncharray[i]}</h3>
            </div>
          </div>
          <div class="vertical-column">
            <div class="vertical-column-content" style="background-color: #AD88C6;">
              <h3>${TotalFineArr[i]}</h3>
            </div>
          </div>
        </div>`
    }
    let content = `<!DOCTYPE html>
    <html lang="en">
    <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Template</title>
    <style>
      /* Styles for the email template */
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        margin: 0;
        padding: 0;
        background-color: #f6f6f6;
      }
      .container {
        max-width: 600px;
        margin: 0 auto;
        padding: 20px;
        background-color: #ffffff;
        border-radius: 10px;
        box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
      }
      .row {
        display: flex;
        flex-wrap: wrap;
        margin: 10px -10px;
      }
      .column {
        width: 100%;
        padding: 10px;
      }
      .vertical-column {
        width: 33.33%;
        padding: 5px;
      }
      h2, p, h3 {
        color: #ffffff;
      }
      .header-row {
        background-color: #FF6F61;
        color: #ffffff;
        text-align: center;
        padding: 20px;
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
      }
      .subheader-row {
        background-color: #49A6E9;
        color: #ffffff;
        text-align: center;
        padding: 20px;
        border-bottom-left-radius: 10px;
        border-bottom-right-radius: 10px;
      }
      .vertical-column-content {
        background-color: #AD88C6;
        border-radius: 10px;
        padding: 5px;
        margin-bottom: 5px;
        text-align: center;
      }
      @media screen and (max-width: 500px) {
        .column {
          width: 100%;
        }

        .vertical-column {
            width: 30%;
          }
      }
    </style>
    </head>
    <body>
      <div class="container">
        <div class="row header-row">
          <div class="column">
            <h2>${username}</h2>
          </div>
        </div>
        <div class="row subheader-row">
          <div class="column">
            <h2>${fileselected}</h2>
          </div>
        </div>
        <br>
        <br>
        ${data}
        <br>
        <br>
        <div class="row header-row">
          <div class="column">
            <h2>Total Weight</h2>
            <h2>${TotalWeight}</h2>
          </div>
        </div>
        <div class="row subheader-row">
          <div class="column">
            <h2>Total Fine</h2>
            <h2>${TotalFine}</h2>
          </div>
        </div>

      </div>
    </body>
    </html>
    
    `
    SendEmail(sender,'rahul.rastogi.216000@gmail.com', fileselected, content)
}
module.exports = router;