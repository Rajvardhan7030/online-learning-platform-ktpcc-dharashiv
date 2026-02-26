// 1. UPGRADED Data Source: Final Year Project Syllabus Structure
const topicsData = {
    htmlcss: [
       
        { 
            title: "1. Introduction to Web Development", 
            
            // --- ENGLISH CONTENT ---
            youtubeUrlEn: "https://www.youtube.com/embed/EceJQ05KTf4?si=xY4CJp60m3vK0PWb", 
            docTextEn: `
                <h4>Welcome to Web Development!</h4>
                <p>Web development is the building and maintenance of websites. The core technologies are HTML, CSS, and JavaScript.</p>
            `,
            podcastEn: "/public/audio/the intro of web-devlopment_eng.m4a", 
            
            // --- HINDI CONTENT ---
            youtubeUrlHi: "https://www.youtube.com/embed/z0n1aQ3IxWI", 
            docTextHi: `
                <h4>वेब डेवलपमेंट में आपका स्वागत है!</h4>
                <p>वेब डेवलपमेंट वेबसाइटों के निर्माण और रखरखाव की प्रक्रिया है। मुख्य प्रौद्योगिकियां HTML, CSS और JavaScript हैं।</p>
            `,
            podcastHi: "/public/audio/the intro of web-devlopment_hindi.m4a" 
        },

      
        { 
            title: "2. HTML Fundamentals & Document Structure", 
            youtubeUrlEn: "", 
            youtubeUrlHi: "", 
            docTextEn: "<p>Content coming soon...</p>",
             docTextHi: "<p>जल्द आ रहा है...</p>", 
            podcastEn: "#",
             podcastHi: "#" 
        },
       { 
           title: "3. Content & Inline Elements", 
            youtubeUrlEn: "", 
            youtubeUrlHi: "", 
            docTextEn: "<p>Content coming soon...</p>",
             docTextHi: "<p>जल्द आ रहा है...</p>", 
            podcastEn: "#",
             podcastHi: "#" 
        },
         { 
           title: "4. Structural & Semantic HTML + Multimedia + Forms", 
            youtubeUrlEn: "", 
            youtubeUrlHi: "", 
            docTextEn: "<p>Content coming soon...</p>",
             docTextHi: "<p>जल्द आ रहा है...</p>", 
            podcastEn: "#",
             podcastHi: "#" 
        },
         
        { 
            title: "5. CSS Fundamentals & Styling Basics", 
            youtubeUrlEn: "", 
            youtubeUrlHi: "", 
            docTextEn: "<p>Content coming soon...</p>",
             docTextHi: "<p>जल्द आ रहा है...</p>", 
            podcastEn: "#",
             podcastHi: "#"  
        },
        { 
            title: "6. Layout & Positioning", 
            youtubeUrlEn: "", 
            youtubeUrlHi: "", 
            docTextEn: "<p>Content coming soon...</p>",
             docTextHi: "<p>जल्द आ रहा है...</p>", 
            podcastEn: "#",
             podcastHi: "#" 
        },
        { 
            title: "7. Responsive Design & Modern Features",
            youtubeUrlEn: "", 
            youtubeUrlHi: "", 
            docTextEn: "<p>Content coming soon...</p>",
             docTextHi: "<p>जल्द आ रहा है...</p>", 
            podcastEn: "#",
             podcastHi: "#" 
        }
    ],

    // Placeholders for other courses
    javascript: [{ title: "Coming Soon...", youtubeUrl: "", docText: "", podcastEn: "#", podcastHi: "#" }],
    python: [{ title: "Coming Soon...", youtubeUrl: "", docText: "", podcastEn: "#", podcastHi: "#" }],
    java: [{ title: "Coming Soon...", youtubeUrl: "", docText: "", podcastEn: "#", podcastHi: "#" }]
};

const languageSuffixes = { en: "", hi: " (in Hindi)", mr: " (in Marathi)" };

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
    
    topicListElement.innerHTML = '';
    
    topics.forEach(topicObj => {
        const li = document.createElement('li');
        li.textContent = topicObj.title + suffix;
        li.className = "topic-item";
        
        li.addEventListener('click', () => {
            renderActionPanel(topicObj, suffix, selectedLang);
        });
        
        topicListElement.appendChild(li);
    });
}

function renderActionPanel(topicObj, suffix, langCode) {
    const displayName = topicObj.title + suffix;
    
    // 1. Set Defaults (English)
    let podcastLink = topicObj.podcastEn;
    let videoLink = topicObj.youtubeUrlEn;
    let docContent = topicObj.docTextEn;

    // 2. Switch to Hindi if the user selected it
    if (langCode === 'hi') {
        podcastLink = topicObj.podcastHi;
        videoLink = topicObj.youtubeUrlHi;
        docContent = topicObj.docTextHi;
    }

    // 3. Safely encode the chosen document text to prevent HTML errors
    const safeDocText = encodeURIComponent(docContent || "<p>Content coming soon...</p>");

    // 4. Render the buttons with the correct localized links
    const htmlContent = `
        <div class="action-panel-content">
            <h2 class="action-header">${displayName}</h2>
            <div class="action-cards">
                <a href="#" onclick="openVideoModal('${videoLink}', '${displayName}')" class="action-card">
                    <i class="fas fa-video"></i>
                    <span>Watch Video</span>
                </a>
                
                <a href="#" onclick="openDocModal('${topicObj.title}', '${safeDocText}')" class="action-card">
                    <i class="fas fa-book-open"></i>
                    <span>Read Documentation</span>
                </a>
                
                <a href="${podcastLink}" class="action-card">
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

// 4. Video Modal Functions
function openVideoModal(videoUrl, title) {
    if (!videoUrl) {
        alert("This video is coming soon!");
        return;
    }
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('youtubeFrame').src = videoUrl;
    document.getElementById('videoModal').style.display = "block";
}

function closeVideoModal() {
    document.getElementById('videoModal').style.display = "none";
    // Clear the src to stop the video from playing in the background
    document.getElementById('youtubeFrame').src = "";
}
// Document Modal Functions
function openDocModal(title, encodedText) {
    document.getElementById('docModalTitle').textContent = title + " - Notes";
    
    // NEW: Decode the safe text back into readable HTML
    document.getElementById('docContent').innerHTML = decodeURIComponent(encodedText);
    
    document.getElementById('docModal').style.display = "block";
}

function closeDocModal() {
    document.getElementById('docModal').style.display = "none";
}
// 5. Event Listeners
progLangSelect.addEventListener('change', () => { renderSubtopics(); resetContentArea(); });
siteLangSelect.addEventListener('change', () => { renderSubtopics(); resetContentArea(); });

// 6. The Bridge Script
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

// Initialize
renderSubtopics();