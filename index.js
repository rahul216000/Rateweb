const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const dotenv = require("dotenv");
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");

dotenv.config({ path: './config.env' });

app.use(express.json())
app.use(cookieParser())

const DB = process.env.DATABASE;
mongoose.set("strictQuery", false);
mongoose.connect(DB).then(() => {
    console.log('Connected');
}).catch((e) => { console.log('Not connected' + e); })

app.use(require('./Router/User'));
app.use(require('./Router/Admin'));

app.listen(PORT, (error) => {
  if (!error) {
    console.log("Server is Successfully Running, and App is listening on port " + PORT)
  } else {
    console.log('Server not started ' + error);
  }
});

