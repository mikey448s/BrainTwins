function submitEntry(entryNumber) {
    const textInput1 = document.getElementById('textInput1').value;
    const textInput2 = document.getElementById('textInput2').value;
    const loadingBox = document.getElementById('loadingBox');
    const resultBox = document.getElementById('resultBox');

    if (entryNumber === 1) {
        // Hide entry 1 and show entry 2
        document.getElementById('entry1').style.display = 'none';
        document.getElementById('entry2').style.display = 'block';
    } else {
        // Prepare the data for sending
        const data = { user1: textInput1, user2: textInput2, strictness: 1, category: 1 }; // Example data

        // Show loading box and hide entry 2
        loadingBox.style.display = 'block';
        document.getElementById('entry2').style.display = 'none';

        fetch('/submit', { // Make sure this matches your server endpoint
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        .then(response => response.json())
        .then(data => {
            document.getElementById('similarity').textContent = data.similarity; // Directly show Python script's response
            // Hide loading box and show result box with results
            loadingBox.style.display = 'none';
            resultBox.style.display = 'block';

            // Update result message based on the response
            //document.getElementById('similarity').textContent = data.similarity ? 'similar' : 'not similar';
        })
        .catch(error => {
            console.error('Error:', error);
            // Hide loading box and show result box with error message
            loadingBox.style.display = 'none';
            resultBox.style.display = 'block';
            document.getElementById('similarity').textContent = 'Error processing request';
        });
    }
}
function restartCycle() {
    const entry1 = document.getElementById('entry1');
    const entry2 = document.getElementById('entry2');
    const resultBox = document.getElementById('resultBox');

    // Show entry 1 and hide result box
    entry1.style.display = 'block';
    entry2.style.display = 'none'; // Ensure entry 2 is hidden
    resultBox.style.display = 'none';
}