// 1. Define the total number of topics in your MVP course
const TOTAL_TOPICS = {
    htmlcss: 7,
    javascript: 10,
    python: 12
};

let progressChart;

// 2. Run this function when the dashboard page loads
window.onload = async function() {
    const user = JSON.parse(localStorage.getItem('ide_user'));
    if (!user) {
        window.location.href = 'auth.html';
        return;
    }

    // Try to fetch progress from backend first
    let progressData = { htmlcss: [], javascript: [], python: [] };
    
    try {
        const response = await fetch(`${API_BASE_URL}/api/auth/progress`, {
            headers: {
                'Authorization': `Bearer ${user.token}`
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            progressData = data.progress;
            // Sync with local storage
            Object.keys(progressData).forEach(course => {
                localStorage.setItem(`completed_${course}`, JSON.stringify(progressData[course]));
            });
        } else {
            // Fallback to local storage if backend fails
            progressData.htmlcss = JSON.parse(localStorage.getItem('completed_htmlcss')) || [];
            progressData.javascript = JSON.parse(localStorage.getItem('completed_javascript')) || [];
            progressData.python = JSON.parse(localStorage.getItem('completed_python')) || [];
        }
    } catch (error) {
        console.error("Error fetching progress:", error);
        progressData.htmlcss = JSON.parse(localStorage.getItem('completed_htmlcss')) || [];
    }

    updateUI(progressData);
    renderChart(progressData);
};

function updateUI(progressData) {
    // HTML/CSS Progress
    const completedCount = progressData.htmlcss.length;
    let progressPercentage = Math.round((completedCount / TOTAL_TOPICS.htmlcss) * 100);
    if (progressPercentage > 100) progressPercentage = 100;

    const progressBarFill = document.getElementById('html-progress-fill');
    const courseInfoParagraph = document.querySelector('.course-info p');

    if (progressBarFill) progressBarFill.style.width = progressPercentage + '%';
    if (courseInfoParagraph) {
        courseInfoParagraph.innerHTML = `Progress: <span id="html-progress-text">${progressPercentage}%</span> (${completedCount} / ${TOTAL_TOPICS.htmlcss} Topics)`;
    }
}

function renderChart(progressData) {
    const ctx = document.getElementById('progressChart').getContext('2d');
    
    const labels = ['HTML & CSS', 'JavaScript', 'Python'];
    const dataValues = [
        Math.round((progressData.htmlcss.length / TOTAL_TOPICS.htmlcss) * 100),
        Math.round((progressData.javascript.length / TOTAL_TOPICS.javascript) * 100),
        Math.round((progressData.python.length / TOTAL_TOPICS.python) * 100)
    ];

    if (progressChart) {
        progressChart.destroy();
    }

    progressChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Course Completion %',
                data: dataValues,
                backgroundColor: [
                    'rgba(227, 79, 38, 0.6)', // HTML Color
                    'rgba(247, 223, 30, 0.6)', // JS Color
                    'rgba(55, 118, 171, 0.6)'  // Python Color
                ],
                borderColor: [
                    '#e34f26',
                    '#f7df1e',
                    '#3776ab'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + "%";
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}

// 3. Reset Progress Function
async function resetProgress() {
    if(confirm("Are you sure you want to reset all your progress? This will clear data from both your browser and our servers.")) {
        const userString = localStorage.getItem('ide_user');
        if (!userString) return;
        const user = JSON.parse(userString);
        
        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/reset-progress`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            });
            
            if (response.ok) {
                // Clear locally only after backend confirms
                localStorage.removeItem('completed_htmlcss');
                localStorage.removeItem('completed_javascript');
                localStorage.removeItem('completed_python');
                alert("Progress reset successfully.");
                window.location.reload();
            } else {
                alert("Failed to reset progress on server. Please try again.");
            }
        } catch (error) {
            console.error("Error resetting progress:", error);
            alert("Connection error. Could not reset progress.");
        }
    }
}