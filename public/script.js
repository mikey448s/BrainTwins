function submitEntry(entryNumber) {
    // Assuming your inputs and logic are correctly set up as described
    // Additional implementation to send data to the server goes here

    // Prepare the data for sending
    const strictnessLevel = strictness; // Assuming 'strictness' is correctly updated by your existing code
    const user1 = document.getElementById('textInput1').value;
    const user2 = entryNumber === 2 ? document.getElementById('textInput2').value : '';
    const category = '1'; // This could be dynamic based on the page/lobby

    // Only proceed if both inputs are provided for the second entry
    if (entryNumber === 2) {
        fetch('/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ strictness: strictnessLevel, user1, user2, category }),
        })
        .then(response => response.json())
        .then(data => {
            // Handle the response from the server
            console.log(data); // For example, log it to the console or update the UI accordingly
            // Update UI based on comparison results
            const entriesSimilar = data.similarity; // Adapt this based on how your server responds
            const similaritySpan = document.getElementById('similarity');
            similaritySpan.textContent = entriesSimilar ? 'similar' : 'not similar';
            // Show result box, hide loading
            document.getElementById('loadingBox').style.display = 'none';
            document.getElementById('resultBox').style.display = 'block';
        })
        .catch(error => console.error('Error:', error));
    }
}
