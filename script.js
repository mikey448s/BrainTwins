// script.js
const socket = io();

function sendMessage(inputId) {
    const userInput = document.getElementById(inputId).value.trim();

    // Emit a 'message' event to the server
    socket.emit('message', { message: userInput });
}

// Listen for 'result' event from the server
socket.on('result', (data) => {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p><strong>${data.id} Result:</strong> ${data.result}</p>`;
});
