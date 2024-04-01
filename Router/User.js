const express = require("express");
const router = express.Router();
const jwt = require('jsonwebtoken');
const path = require("path");

const UserAccount = require('../Model/UserAccount');

let SECRET_KEY = process.env.SECRET_KEY

const {verifyToken, verifiedUser} = require("../Authentication/verification")

// Featured APIs

router.post("/signup", async (req, res) => {

    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: 'Please Enter the required Data' });
        }

        let CheckUser = await CheckIfUserFound(email)

        if (CheckUser) {
            return res.status(401).json({ message: "Already have account, try to login instead of Signup" })
        }


        let UID = await SaveUser(email, password)

        res.cookie("UID", UID, {
            secure: process.env.NODE_ENV === "production",
            maxAge: 200000000 * 60 * 60 * 1000,
            httpOnly: true
        })

        const token = jwt.sign({ userId: UID }, SECRET_KEY);
        res.cookie("access_token", token, {
            secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
            maxAge: 200000000 * 60 * 60 * 1000,
            httpOnly: true
        }).status(200).json({ message: "SignUp Successfully" });

    } catch (error) {
        console.log(error);
        res.send("Error")
    }


})

router.post("/login", async (req, res) => {

    try {
        let { email, password } = req.body;

        if (!email || !password) {
            return res.status(401).json({ message: 'Please Enter the required Data' });
        }

        let user = await UserAccount.findOne({ email });

        if (user && password == user.password) {

            res.cookie("UID", user._id, {
                secure: process.env.NODE_ENV === "production",
                maxAge: 200000000 * 60 * 60 * 1000,
                httpOnly: true
            })

            const token = jwt.sign({ userId: user._id }, SECRET_KEY);
            res.cookie("access_token", token, {
                secure: process.env.NODE_ENV === "production", // Set to true if using HTTPS
                maxAge: 200000000 * 60 * 60 * 1000,
                httpOnly: true
            }).status(200).json({ message: "Login Successfully" });

        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }

    } catch (error) {
        res.send("Error")
    }


})



// Routes

router.get("/signup", async (req, res) => {

    try {
        res.sendFile(path.join(__dirname + '/../views/SignUp.html'));
    } catch (error) {
        res.send("Error")
    }

})

router.get("/login", async (req, res) => {

    try {
        res.sendFile(path.join(__dirname + '/../views/Login.html'));

    } catch (error) {
        res.send("Error")
    }

})

router.get("/", verifyToken, verifiedUser, async (req, res) => {

    try {
        res.sendFile(path.join(__dirname + '/../views/Rateweb.html'));
    } catch (error) {
        res.send("Error")
    }

})


// SignUp Functions

async function SaveUser(email, password) {
    const verified = false

    let data = new UserAccount({
        email, password, verified
    })

    let save = await data.save()

    return save._id;

}

async function CheckIfUserFound(email) {

    try {
        let Result = await UserAccount.findOne({ email })

        if (Result) {
            return true
        } else {
            return false
        }
    } catch (error) {
        return
    }

}

module.exports = router;