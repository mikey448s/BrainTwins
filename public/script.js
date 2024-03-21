// Start with all dots filled, representing a strictness value of 2
let strictness = 3; // Adjusted to 3 because we're using a 1-based index for ease of implementation

// Adjust the strictness based on the dot clicked
function adjustStrictness(dotIndex) {
    strictness = dotIndex + 1; // This sets strictness based on clicked dot. Dot 1 -> strictness 1 (0 in your desired mapping)

    updateDots(); // Update the visual state of the dots

    // Log adjusted strictness value to align with your desired 0-based mapping
    console.log('Strictness level: ', strictness - 1);
}

// Update the visual state of the dots based on the current strictness
function updateDots() {
    for (let i = 0; i < 3; i++) {
        let dot = document.getElementById('dot' + (i + 1));
        if (i < strictness) {
            dot.classList.add('filled');
        } else {
            dot.classList.remove('filled');
        }
    }
}

// Toggle the visibility of the strictness level description
function toggleDescription() {
    var description = document.getElementById('description');
    description.style.display = description.style.display === 'block' ? 'none' : 'block';
}

// Initially update the dots to reflect the default state
document.addEventListener('DOMContentLoaded', (event) => {
    updateDots();
});

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
        const data = { user1: textInput1, user2: textInput2, strictness: strictness - 1, category: category }; // Example data

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

// JavaScript for handling scroll to top functionality
var prevScrollpos = window.pageYOffset;
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    var currentScrollPos = window.pageYOffset;
    var windowHeight = window.innerHeight;
    var bodyHeight = document.body.scrollHeight;

    if (currentScrollPos < (bodyHeight - windowHeight) / 2) {
        // Show the arrow when scrolling up before reaching the bottom half of the page
        document.getElementById("scrollToTop").style.opacity = "1";
    } else {
        // Hide the arrow when scrolling down or reaching the bottom half of the page
        document.getElementById("scrollToTop").style.opacity = "0";
    }
}