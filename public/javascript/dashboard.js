// 1. Define the total number of topics in your MVP course
const TOTAL_HTML_TOPICS = 7;

// 2. Run this function when the dashboard page loads
window.onload = function() {
    // Get the array of completed topics from Local Storage
    const completedTopics = JSON.parse(localStorage.getItem('completed_htmlcss')) || [];
    
    // Count how many unique topics they have clicked
    const completedCount = completedTopics.length;
    
    // Calculate the percentage (e.g., 3 / 7 = 0.42 * 100 = 42%)
    let progressPercentage = Math.round((completedCount / TOTAL_HTML_TOPICS) * 100);
    
    // Make sure it doesn't accidentally go over 100%
    if (progressPercentage > 100) progressPercentage = 100;

    // 3. Update the Dashboard HTML Elements dynamically
    const progressBarFill = document.getElementById('html-progress-fill');
    const progressTextSpan = document.getElementById('html-progress-text');
    const courseInfoParagraph = document.querySelector('.course-info p');

    // Stretch the blue bar using CSS width
    progressBarFill.style.width = progressPercentage + '%';
    
    // Update the text to show exact numbers
    courseInfoParagraph.innerHTML = `Progress: <span id="html-progress-text">${progressPercentage}%</span> (${completedCount} / ${TOTAL_HTML_TOPICS} Topics)`;
};