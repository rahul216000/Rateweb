const express = require('express');
const app = express();
const path = require("path")
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const jwt = require('jsonwebtoken');


dotenv.config({ path: './config.env' });

let USERID = process.env.USERID
let SECRET_KEY = process.env.SECRET_KEY

// SetUp for adin to approve and decline users
// Rateweb setup to recieve data and send me over email
app.get("/admin", verifyToken, (req, res) => {

    try {
        res.sendFile(path.join(__dirname + '/views/InvoiceApp.html'));
    } catch (error) {
        res.send("Error")
    }

})

app.post("/login", async (req, res) => {

    const { password } = req.body;
    try {

        if (password != process.env.ADMIN_PASS) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }

        const token = jwt.sign({ userId: USERID }, SECRET_KEY);
        res.cookie("access_token", token, {
            secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
            httpOnly: true,
        }).status(200).json({ message: "Logged in" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
})

function verifyToken(req, res, next) {

    const token = req.cookies.access_token;
    if (!token) {
        return res.sendFile(path.join(__dirname + '/views/Login.html'));

    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.sendFile(path.join(__dirname + '/views/Login.html'));

        }

        next();
    });

}



app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Successfully Running, and App is listening on port " + PORT)
  } else {
    console.log('Server not started ' + error);
  }

});


