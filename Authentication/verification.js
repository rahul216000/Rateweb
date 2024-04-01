const jwt = require('jsonwebtoken');
const path = require("path");
const UserAccount = require('../Model/UserAccount');

let SECRET_KEY = process.env.SECRET_KEY

function verifyToken(req, res, next) {

    const token = req.cookies.access_token;
    if (!token) {
        return res.sendFile(path.join(__dirname + '/../views/Login.html'));

    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.sendFile(path.join(__dirname + '/../views/Login.html'));
        }

        next();
    });

}

async function verifiedUser(req, res, next) {

    const UID = req.cookies.UID;

    if (!UID) {
        return res.sendFile(path.join(__dirname + '/../views/Login.html'));
    }

    let user = await UserAccount.findOne({ "_id": UID })

    if (user.verified) {
        next();
    } else {
        return res.sendFile(path.join(__dirname + '/../views/NotVerified.html'));
    }

}

module.exports = {verifyToken, verifiedUser}