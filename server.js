const express = require('express');
const { spawn } = require('child_process');

const app = express();
const port = 4000;

app.use(express.json()); // For parsing application/json
app.use(express.static('public/html')); // For parsing application/json
app.use(express.static('public/css')); // For parsing application/json
app.use(express.static('public')); // For parsing application/json
app.use(express.urlencoded({ extended: true })); // For parsing application/x-www-form-urlencoded

// Endpoint to handle the form submission.
app.post('/submit', (req, res) => {
    const { user1, user2, strictness, category } = req.body;

    const pythonProcess = spawn('python3', ['Requests.py', user1, user2, strictness, category]);

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
/*
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
*/
app.listen(port, '0.0.0.0', () => {
    console.log(`Server listening at http://0.0.0.0:${port}`);
});
