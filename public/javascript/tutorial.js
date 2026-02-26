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

      
      // --- 2. HTML STRUCTURE ---
        { 
            title: "2. HTML Fundamentals & Document Structure", 
            youtubeUrlEn: "", 
            docTextEn: "<h4>The Boilerplate</h4><p>Every HTML document needs <code>&lt;!DOCTYPE html&gt;</code>, a <code>&lt;head&gt;</code> for metadata, and a <code>&lt;body&gt;</code> for visible content.</p>",
            podcastEn: "/public/audio/html-structure-en.mp3", 
            
            youtubeUrlHi: "", 
            docTextHi: "<h4>HTML संरचना</h4><p>प्रत्येक HTML दस्तावेज़ को एक मानक संरचना की आवश्यकता होती है।</p>",
            podcastHi: "/public/audio/html-structure-hi.mp3" 
        },

        // --- 3. INLINE ELEMENTS ---
        { 
            title: "3. Content & Inline Elements", 
            youtubeUrlEn: "", 
            docTextEn: "<h4>Text Formatting</h4><p>Use <code>&lt;strong&gt;</code> for bold text, <code>&lt;em&gt;</code> for italics, and <code>&lt;a&gt;</code> for hyperlinks.</p>",
            podcastEn: "/public/audio/html-inline-en.mp3", 

            youtubeUrlHi: "", 
            docTextHi: "<h4>इनलाइन तत्व</h4><p>टेक्स्ट को स्वरूपित करने के लिए इन टैग्स का उपयोग करें।</p>",
            podcastHi: "/public/audio/html-inline-hi.mp3" 
        },

        // --- 4. SEMANTIC HTML ---
        { 
            title: "4. Structural & Semantic HTML + Forms", 
            youtubeUrlEn: "", 
            docTextEn: "<h4>Semantic Tags</h4><p>Tags like <code>&lt;header&gt;</code>, <code>&lt;main&gt;</code>, and <code>&lt;footer&gt;</code> make your code readable and accessible.</p>",
            podcastEn: "/public/audio/html-semantic-en.mp3", 

            youtubeUrlHi: "", 
            docTextHi: "<h4>सिमेंटिक HTML</h4><p>ये टैग ब्राउज़र को सामग्री का अर्थ बताते हैं।</p>",
            podcastHi: "/public/audio/html-semantic-hi.mp3" 
        },

        // --- 5. CSS BASICS ---
        { 
            title: "5. CSS Fundamentals & Styling Basics", 
            youtubeUrlEn: "", 
            docTextEn: "<h4>CSS Selectors</h4><p>CSS is used to style HTML. You can select elements by Tag, <code>.class</code>, or <code>#id</code>.</p>",
            podcastEn: "/public/audio/css-basics-en.mp3", 

            youtubeUrlHi: "", 
            docTextHi: "<h4>CSS मूल बातें</h4><p>CSS का उपयोग HTML को स्टाइल करने के लिए किया जाता है।</p>",
            podcastHi: "/public/audio/css-basics-hi.mp3" 
        },

        // --- 6. CSS LAYOUT ---
        { 
            title: "6. Layout & Positioning", 
            youtubeUrlEn: "", 
            docTextEn: "<h4>Flexbox and Grid</h4><p>Modern layouts use Flexbox for 1D alignments and CSS Grid for 2D complex layouts.</p>",
            podcastEn: "/public/audio/css-layout-en.mp3", 

            youtubeUrlHi: "", 
            docTextHi: "<h4>लेआउट</h4><p>आधुनिक वेब डिज़ाइन में Flexbox और Grid का उपयोग होता है।</p>",
            podcastHi: "/public/audio/css-layout-hi.mp3" 
        },

        // --- 7. RESPONSIVE DESIGN ---
        { 
            title: "7. Responsive Design & Modern Features", 
            youtubeUrlEn: "", 
            docTextEn: "<h4>Media Queries</h4><p>Use <code>@media (max-width: 768px)</code> to change styles on mobile devices.</p>",
            podcastEn: "/public/audio/css-responsive-en.mp3", 

            youtubeUrlHi: "https://www.youtube.com/embed/1Rs2ND1ryYc?start=3500&end=3600", 
            docTextHi: "<h4>रेस्पॉन्सिव डिज़ाइन</h4><p>मोबाइल उपकरणों पर वेबसाइट को सही दिखाने के लिए मीडिया क्वेरीज़ का उपयोग करें।</p>",
            podcastHi: "/public/audio/css-responsive-hi.mp3" 
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
// ==========================================
// 4. Modal Functions with Graceful Fallbacks
// ==========================================

function openVideoModal(videoUrl, title) {
    // 1. Check if the video URL is missing or just a placeholder
    if (!videoUrl || videoUrl === '#' || videoUrl.includes('YOUR_HINDI_VIDEO_ID')) {
        alert("This video is currently being recorded and will be available soon!");
        return; // Stop the modal from opening
    }
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('youtubeFrame').src = videoUrl;
    document.getElementById('videoModal').style.display = "block";
}

function closeVideoModal() {
    document.getElementById('videoModal').style.display = "none";
    document.getElementById('youtubeFrame').src = "";
}

function openDocModal(title, encodedText) {
    const text = decodeURIComponent(encodedText);
    // 2. Check if the doc is just the placeholder text
    if (!text || text.includes('coming soon') || text.includes('जल्द आ रहा है')) {
         alert("The documentation for this topic is currently being written by our AI. Check back later!");
         return;
    }
    document.getElementById('docModalTitle').textContent = title + " - Notes";
    document.getElementById('docContent').innerHTML = text;
    document.getElementById('docModal').style.display = "block";
}

function closeDocModal() {
    document.getElementById('docModal').style.display = "none";
}

function openPodcastModal(title, audioUrl) {
    // 3. Check if the audio file is missing
    if (!audioUrl || audioUrl === '#') {
        alert("The AI is currently generating the podcast for this topic. Please check back later!");
        return;
    }
    document.getElementById('podcastModalTitle').textContent = title + " - Audio Lesson";
    const audioPlayer = document.getElementById('audioPlayer');
    
    audioPlayer.src = audioUrl;
    document.getElementById('podcastModal').style.display = "block";
    
    audioPlayer.play().catch(e => console.log("Autoplay prevented by browser, waiting for user click."));
}

function closePodcastModal() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    document.getElementById('podcastModal').style.display = "none";
}