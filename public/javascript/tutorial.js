// 1. Data Source: Programming Languages & Subtopics
const topicsData = {
    javascript: [
        "Variables & Data Types", "Operators", "Functions", 
        "Arrays", "Objects", "DOM Manipulation", "Async / Await"
    ],
    htmlcss: [
        "Basic Structure", "Semantic Tags", "CSS Selectors", 
        "Flexbox", "Grid", "Responsive Design", "Animations"
    ],
    java: [
        "Variables & Data Types", "Operators", "Control Statements", 
        "Arrays", "OOP Concepts", "Exception Handling", "Collections"
    ],
    python: [
        "Variables & Data Types", "Operators", "Functions", 
        "Lists & Tuples", "Dictionaries", "Modules", "File Handling"
    ],
    c: [
        "Variables & Data Types", "Operators", "Control Statements", 
        "Arrays", "Functions", "Pointers", "Structures"
    ]
};

// Site Language suffixes for dummy translation requirement
const languageSuffixes = {
    en: "",
    hi: " (in Hindi)",
    mr: " (in Marathi)"
};

// 2. DOM Elements Selection
const progLangSelect = document.getElementById('prog-lang-select');
const siteLangSelect = document.getElementById('site-lang-select');
const topicListElement = document.getElementById('topic-list');
const contentAreaElement = document.getElementById('content-area');

// 3. Render Functions
function renderSubtopics() {
    const selectedCourse = progLangSelect.value;
    const selectedLang = siteLangSelect.value;
    const suffix = languageSuffixes[selectedLang] || "";
    
    const topics = topicsData[selectedCourse] || [];
    
    // Clear the current list
    topicListElement.innerHTML = '';
    
    // Generate the new list
    topics.forEach(topic => {
        const li = document.createElement('li');
        li.textContent = topic + suffix;
        li.className = "topic-item"; // Added class for styling
        
        // When a user clicks a topic, render the action cards!
        li.addEventListener('click', () => {
            renderActionPanel(topic + suffix);
        });
        
        topicListElement.appendChild(li);
    });
}

function renderActionPanel(topicName) {
    const htmlContent = `
        <div class="action-panel-content">
            <h2 class="action-header">${topicName}</h2>
            <div class="action-cards">
                <a href="#video" class="action-card">
                    <i class="fas fa-video"></i>
                    <span>Watch Video</span>
                </a>
                <a href="#docs" class="action-card">
                    <i class="fas fa-book-open"></i>
                    <span>Read Documentation</span>
                </a>
                <a href="#podcast" class="action-card">
                    <i class="fas fa-podcast"></i>
                    <span>Listen Podcast</span>
                </a>
                <a href="#" onclick="openIDE(event)" class="action-card" style="border-color: #0067f6;">
                    <i class="fas fa-laptop-code" style="color: #0067f6;"></i>
                    <span>Practice in IDE</span>
                </a>
            </div>
        </div>
    `;
    contentAreaElement.innerHTML = htmlContent;
}

function resetContentArea() {
    contentAreaElement.innerHTML = `
        <div class="placeholder-text">
            <i class="fas fa-hand-pointer" style="font-size: 3rem; margin-bottom: 1rem; color: #ccc;"></i><br>
            Please select a subtopic from the menu to start learning.
        </div>
    `;
}

// 4. Event Listeners for Select Dropdowns
progLangSelect.addEventListener('change', () => {
    renderSubtopics();
    resetContentArea(); // Reset right panel when language changes
});

siteLangSelect.addEventListener('change', () => {
    renderSubtopics();
    resetContentArea(); // Reset right panel when language changes
});

// 5. Initial Render on Page Load
renderSubtopics();

// 6. The Bridge Script to open the React IDE
function openIDE(event) {
    event.preventDefault(); 
    const userData = localStorage.getItem('ide_user');
    if (userData) {
        const encodedData = encodeURIComponent(userData);
        window.open(`http://localhost:3000/?auth=${encodedData}`, '_blank');
    } else {
        window.open('http://localhost:3000', '_blank');
    }
}