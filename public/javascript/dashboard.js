// 1. Define the total number of topics in your MVP course
const TOTAL_HTML_TOPICS = 7;

// 2. Run this function when the dashboard page loads
window.onload = function() {
    const completedTopics = JSON.parse(localStorage.getItem('completed_htmlcss')) || [];
    const completedCount = completedTopics.length;
    let progressPercentage = Math.round((completedCount / TOTAL_HTML_TOPICS) * 100);
    
    if (progressPercentage > 100) progressPercentage = 100;

    const progressBarFill = document.getElementById('html-progress-fill');
    const courseInfoParagraph = document.querySelector('.course-info p');

    progressBarFill.style.width = progressPercentage + '%';
    courseInfoParagraph.innerHTML = `Progress: <span id="html-progress-text">${progressPercentage}%</span> (${completedCount} / ${TOTAL_HTML_TOPICS} Topics)`;
};

// 3. Reset Progress Function
function resetProgress() {
    if(confirm("Are you sure you want to reset your HTML & CSS progress?")) {
        localStorage.removeItem('completed_htmlcss');
        window.location.reload(); 
    }
}