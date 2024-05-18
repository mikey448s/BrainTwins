const express = require('express');
const { spawn } = require('child_process');
const nodemailer = require('nodemailer');
const validator = require('validator');
require('dotenv').config();

const app = express();
const port = 4000;

app.use(express.json()); // For parsing application/json
//app.use(express.static('public/html')); // For parsing application/json
app.use(express.static('public/css')); // For parsing application/json
app.use(express.static('public')); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Endpoint to handle the form submission.
app.post('/submit', (req, res) => {
    const { user1, user2, strictness, category } = req.body;

    const pythonProcess = spawn('python', ['Requests.py', user1, user2, strictness, category]);

    pythonProcess.stdout.on('data', (data) => {
        // Capture the output from your Python script
        //res.send(data.toString());
        res.json({ similarity: data.toString().trim() }); // Send JSON response
    });

    pythonProcess.stderr.on('data', (data) => {
        // Log errors if they occur
        console.error(`stderr: ${data}`);
    });
});

// Your email configuration and transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // Use your email provider
    auth: {
      user: 'michaelcrimxon@gmail.com', // Your email address
      pass: process.env.EMAIL_CRED // Your email password or app specific password
    }
  });
  
// Contact form route
app.post('/contact', (req, res) => {
const { name, email, message, cc } = req.body;

    // Honeypot field should be empty
    if (cc) return res.status(400).send('Spam detected!');

    // Validate and sanitize inputs
    if (
        !validator.isEmail(email) ||
        validator.isEmpty(name) ||
        validator.isEmpty(message)
    ) {
        return res.status(400).send('Invalid input!');
    }

    const sanitizedEmail = validator.normalizeEmail(email);
    const sanitizedMessage = validator.escape(message);
    const sanitizedname = validator.escape(name);

    const mailOptions = {
        from: sanitizedEmail,
        to: ['michaelcrimxon@gmail.com', process.env.EMAIL1, process.env.EMAIL2], // Where you want to receive the messages
        subject: `BRAINTWINS: New Message`,
        text: sanitizedMessage + "\n\nFrom: " + sanitizedname + "\n" + sanitizedEmail
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
            return res.status(500).send('Error sending email: ' + error.message);
        }      
        res.status(200).send('Email sent successfully: ' + info.response);
    });
});

/*
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
*/
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${port}`);
});
