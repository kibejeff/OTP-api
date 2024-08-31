const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");

//const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the "public" directory

// Serve the HTML file
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "index.html"));
});

let otpStorage = {}; // A simple in-memory store; use a database in production

// Endpoint to send OTP
app.post("/send-otp", (req, res) => {
    const { mobile } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    // Store OTP and mobile number
    otpStorage[mobile] = otp;

    // Send OTP via SMS (replace with your SMS service API)
    axios
        .post("https://appliapay.com/smsintegrate", {
            mobile: mobile,
            message: `Your OTP is ${otp}`,
        })
        .then((response) => {
            res.json({ success: true });
        })
        .catch((error) => {
            res.json({ success: false });
        });
});

// Endpoint to verify OTP
app.post("/verify-otp", (req, res) => {
    const { mobile, otp } = req.body;

    if (otpStorage[mobile] === parseInt(otp, 10)) {
        delete otpStorage[mobile]; // OTP is used, remove it
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
