// 1. Data Source
const topicsData = {
    htmlcss: [
        { 
            titleEn: "1. Introduction to Web Development",
            titleHi: "1. वेब डेवलपमेंट का परिचय",
            youtubeUrlEn: "https://www.youtube.com/embed/EceJQ05KTf4?si=xY4CJp60m3vK0PWb", 
            docTextEn: "<h4>Welcome to Web Development!</h4><p>Web development is the building and maintenance of websites. The core technologies are HTML, CSS, and JavaScript.</p>",
            podcastEn: "public/audio/the intro of web-devlopment_eng.m4a", 
            youtubeUrlHi: "https://www.youtube.com/embed/z0n1aQ3IxWI", 
            docTextHi: "<h4>वेब डेवलपमेंट में आपका स्वागत है!</h4><p>वेब डेवलपमेंट वेबसाइटों के निर्माण और रखरखाव की प्रक्रिया है। मुख्य प्रौद्योगिकियां HTML, CSS और JavaScript हैं।</p>",
            podcastHi: "public/audio/the intro of web-devlopment_hindi.m4a" 
        },
        { 
            titleEn: "2. Introduction to HTML",
            titleHi: "2. HTML का परिचय",
            youtubeUrlEn: "https://www.youtube.com/embed/kUMe1FH4CHE?si=CyS26ZatebyqWzW1", 
            docTextEn: "<h4>Introduction to HTML</h4><p>HTML (HyperText Markup Language) is the standard markup language for documents designed to be displayed in a web browser.</p>",
            podcastEn: "#", 
            youtubeUrlHi: "https://www.youtube.com/embed/HcOc7P5BMi4?si=MtZP0XxmsIbv43kM", 
            docTextHi: "<h4>HTML का परिचय</h4><p>HTML (हाइपरटेक्स्ट मार्कअप भाषा) वेब ब्राउज़र में प्रदर्शित किए जाने वाले दस्तावेज़ों के लिए मानक मार्कअप भाषा है।</p>",
            podcastHi: "#" 
        },
      { 
            titleEn: "3. Introduction to CSS",
            titleHi: "3. CSS का परिचय",
            youtubeUrlEn: "https://www.youtube.com/embed/wRNinF7YQqQ?si=Ue3mHLQn9dxqP9Zt", 
            docTextEn: "",
            podcastEn: "", 
            youtubeUrlHi: "https://www.youtube.com/embed/ESnrn1kAD4E?si=HeACgffMT-dyHknW", 
            docTextHi: "",
            podcastHi: "" 
        },
    { 
            titleEn: "3. Form using HTML and CSS",
            youtubeUrlEn: "https://www.youtube.com/embed/hlwlM4a5rxg?si=8cKctJshZDDgF7m1", 
            docTextEn: "",
            podcastEn: "", 
            youtubeUrlHi: "https://www.youtube.com/embed/hlwlM4a5rxg?si=8cKctJshZDDgF7m1", 
            docTextHi: "",
            podcastHi: "" 
        },
        { 
            titleEn: "4. Project: Build a Simple Website",
            titleHi: "4. प्रोजेक्ट: एक सरल वेबसाइट बनाएं",
            youtubeUrlEn: "https://www.youtube.com/embed/nGhKIC_7Mkk?si=6VcYamJaNtkPHzZu", 
            docTextEn: "",
            podcastEn: "", 
            youtubeUrlHi: "https://www.youtube.com/embed/nGhKIC_7Mkk?si=6VcYamJaNtkPHzZu", 
            docTextHi: "",
            podcastHi: "" 
        },
    ], 
    javascript: [ 
    { 
        titleEn: "1. Introduction to JavaScript & Environment Setup",
        titleHi: "1. JavaScript का परिचय और वातावरण सेटअप",
        youtubeUrlEn: "https://www.youtube.com/embed/...", 
        docTextEn: "<h4>Getting Started with JS</h4><p>JavaScript is the programming language of the web. Learn about browser console, linking external JS files, using VS Code with Live Server, and the difference between client-side and server-side JS.</p>",
        podcastEn: "public/audio/js-intro-eng.m4a", 
        youtubeUrlHi: "https://www.youtube.com/embed/...", 
        docTextHi: "<h4>JS के साथ शुरुआत</h4><p>JavaScript वेब की प्रोग्रामिंग भाषा है। ब्राउज़र कंसोल, external JS फाइल्स लिंक करना, Live Server के साथ VS Code का उपयोग और client-side बनाम server-side JS के बीच अंतर सीखें।</p>",
        podcastHi: "public/audio/js-intro-hindi.m4a" 
    },
    { 
        titleEn: "2. Variables, Data Types & Operators",
        titleHi: "2. वेरिएबल्स, डेटा प्रकार और ऑपरेटर",
        youtubeUrlEn: "https://www.youtube.com/embed/...", 
        docTextEn: "<h4>JS Fundamentals</h4><p>Master var, let, and const declarations. Understand primitive types (string, number, boolean, null, undefined, symbol), typeof operator, template literals, and arithmetic/comparison/logical operators.</p>",
        podcastEn: "public/audio/js-variables-eng.m4a", 
        youtubeUrlHi: "https://www.youtube.com/embed/...", 
        docTextHi: "<h4>JS बुनियादी बातें</h4><p>Var, let और const घोषणाओं में महारत हासिल करें। प्रिमिटिव प्रकार (string, number, boolean, null, undefined, symbol), typeof ऑपरेटर, टेम्पलेट लिटरल्स और अंकगणितीय/तुलनात्मक/तार्किक ऑपरेटरों को समझें।</p>",
        podcastHi: "public/audio/js-variables-hindi.m4a" 
    },
    { 
        titleEn: "3. Control Flow: Conditionals & Loops",
        titleHi: "3. नियंत्रण प्रवाह: शर्तें और लूप्स",
        youtubeUrlEn: "https://www.youtube.com/embed/...", 
        docTextEn: "<h4>Logic Building</h4><p>Learn if-else-if statements, switch cases, ternary operators, for loops, while loops, do-while loops, break/continue statements, and iterating over arrays using for...of and for...in.</p>",
        podcastEn: "public/audio/js-controlflow-eng.m4a", 
        youtubeUrlHi: "https://www.youtube.com/embed/...", 
        docTextHi: "<h4>लॉजिक बिल्डिंग</h4><p>If-else-if स्टेटमेंट्स, स्विच केस, टर्नरी ऑपरेटर, for लूप्स, while लूप्स, do-while लूप्स, break/continue स्टेटमेंट्स और for...of और for...in का उपयोग करके एरे पर इटरेट करना सीखें।</p>",
        podcastHi: "public/audio/js-controlflow-hindi.m4a" 
    },
    { 
        titleEn: "4. Arrays, Objects & String Methods",
        titleHi: "4. एरे, ऑब्जेक्ट्स और स्ट्रिंग मेथड्स",
        youtubeUrlEn: "https://www.youtube.com/embed/...", 
        docTextEn: "<h4>Data Structures in JS</h4><p>Master array methods (push, pop, shift, unshift, splice, slice, map, filter, forEach), object creation and property access, and essential string methods (split, join, substring, replace, trim).</p>",
        podcastEn: "public/audio/js-datastructures-eng.m4a", 
        youtubeUrlHi: "https://www.youtube.com/embed/...", 
        docTextHi: "<h4>JS में डेटा संरचनाएं</h4><p>एरे मेथड्स (push, pop, shift, unshift, splice, slice, map, filter, forEach), ऑब्जेक्ट बनाना और प्रॉपर्टी एक्सेस, और आवश्यक स्ट्रिंग मेथड्स (split, join, substring, replace, trim) में महारत हासिल करें।</p>",
        podcastHi: "public/audio/js-datastructures-hindi.m4a" 
    },
    { 
        titleEn: "5. Functions, Scope & Arrow Functions",
        titleHi: "5. फंक्शन, स्कोप और ऐरो फंक्शन",
        youtubeUrlEn: "https://www.youtube.com/embed/...", 
        docTextEn: "<h4>Modern JavaScript Functions</h4><p>Understand function declarations vs expressions, parameters and return values, default parameters, block scope vs function scope, hoisting, and ES6 arrow functions with implicit returns.</p>",
        podcastEn: "public/audio/js-functions-eng.m4a", 
        youtubeUrlHi: "https://www.youtube.com/embed/...", 
        docTextHi: "<h4>आधुनिक JavaScript फंक्शन</h4><p>फंक्शन डिक्लेरेशन बनाम एक्सप्रेशन, पैरामीटर्स और रिटर्न वैल्यू, डिफॉल्ट पैरामीटर्स, ब्लॉक स्कोप बनाम फंक्शन स्कोप, होइस्टिंग और ES6 ऐरो फंक्शन इम्प्लिसिट रिटर्न के साथ समझें।</p>",
        podcastHi: "public/audio/js-functions-hindi.m4a" 
    },
    { 
        titleEn: "6. DOM Manipulation & Events",
        titleHi: "6. DOM मैनिपुलेशन और इवेंट्स",
        youtubeUrlEn: "https://www.youtube.com/embed/...", 
        docTextEn: "<h4>Interacting with Webpages</h4><p>Learn document.querySelector, changing textContent and innerHTML, modifying CSS styles via JS, adding/removing classes, event listeners (click, submit, keyup), and form validation basics.</p>",
        podcastEn: "public/audio/js-dom-eng.m4a", 
        youtubeUrlHi: "https://www.youtube.com/embed/...", 
        docTextHi: "<h4>वेबपेज से इंटरैक्ट करना</h4><p>Document.querySelector, textContent और innerHTML बदलना, JS के माध्यम से CSS स्टाइल्स संशोधित करना, क्लासेस जोड़ना/हटाना, इवेंट लिस्नर्स (click, submit, keyup) और फॉर्म वैलिडेशन बुनियादी बातें सीखें।</p>",
        podcastHi: "public/audio/js-dom-hindi.m4a" 
    },
    { 
        titleEn: "7. Async Programming, JSON & LocalStorage",
        titleHi: "7. एसिंक्रोनस प्रोग्रामिंग, JSON और LocalStorage",
        youtubeUrlEn: "https://www.youtube.com/embed/...", 
        docTextEn: "<h4>Advanced Web Concepts</h4><p>Understand setTimeout and setInterval, callbacks, Promises, async/await syntax, fetching data from APIs, parsing JSON, and storing data in browser using localStorage and sessionStorage.</p>",
        podcastEn: "public/audio/js-async-eng.m4a", 
        youtubeUrlHi: "https://www.youtube.com/embed/...", 
        docTextHi: "<h4>उन्नत वेब अवधारणाएं</h4><p>SetTimeout और setInterval, कॉलबैक्स, प्रॉमिसेस, async/await सिंटैक्स, APIs से डेटा फेच करना, JSON पार्स करना और localStorage और sessionStorage का उपयोग करके ब्राउज़र में डेटा संग्रहीत करना समझें।</p>",
        podcastHi: "public/audio/js-async-hindi.m4a" 
    }
],
     python: [
        { 
            titleEn: "1. Introduction to Python & Setup",
            titleHi: "1. Python का परिचय और सेटअप",
            youtubeUrlEn: "#", 
            docTextEn: "<h4>Python Basics</h4><p>Python is a high-level, interpreted programming language known for its readability. Learn to install Python, set up VS Code or PyCharm, and write your first 'Hello World' program.</p>",
            podcastEn: "", 
            youtubeUrlHi: "#", 
            docTextHi: "<h4>Python मूल बातें</h4><p>Python एक उच्च-स्तरीय, इंटरप्रेटेड प्रोग्रामिंग भाषा है जो अपनी पठनीयता के लिए जानी जाती है। Python इंस्टॉल करना, VS Code या PyCharm सेट अप करना और अपना पहला 'Hello World' प्रोग्राम लिखना सीखें।</p>",
            podcastHi: "" 
        },
        { 
            titleEn: "2. Variables, Data Types & Operators",
            titleHi: "2. वेरिएबल्स, डेटा प्रकार और ऑपरेटर",
            youtubeUrlEn: "#", 
            docTextEn: "<h4>Python Fundamentals</h4><p>Understand dynamic typing, variables, numeric types (int, float, complex), strings, booleans, type casting, and arithmetic/comparison/logical operators.</p>",
            podcastEn: "", 
            youtubeUrlHi: "#", 
            docTextHi: "<h4>Python बुनियादी बातें</h4><p>डायनामिक टाइपिंग, वेरिएबल्स, न्यूमेरिक प्रकार (int, float, complex), स्ट्रिंग्स, बूलियन, टाइप कास्टिंग और अंकगणितीय/तुलनात्मक/तार्किक ऑपरेटरों को समझें।</p>",
            podcastHi: "" 
        },
        { 
            titleEn: "3. Control Flow & Loops",
            titleHi: "3. नियंत्रण प्रवाह और लूप्स",
            youtubeUrlEn: "#", 
            docTextEn: "<h4>Decision Making</h4><p>Learn if-elif-else statements, match-case (Python 3.10+), for loops, while loops, range() function, break, continue, and pass statements with practical examples.</p>",
            podcastEn: "", 
            youtubeUrlHi: "#", 
            docTextHi: "<h4>निर्णय लेना</h4><p>If-elif-else स्टेटमेंट्स, match-case (Python 3.10+), for लूप्स, while लूप्स, range() फ़ंक्शन, break, continue और pass स्टेटमेंट्स व्यावहारिक उदाहरणों के साथ सीखें।</p>",
            podcastHi: "" 
        },
        { 
            titleEn: "4. Lists, Tuples & Dictionaries",
            titleHi: "4. लिस्ट्स, ट्यूपल्स और डिक्शनरीज",
            youtubeUrlEn: "#", 
            docTextEn: "<h4>Python Data Structures</h4><p>Master list operations (slicing, append, remove), tuple immutability, dictionary key-value pairs, sets, and list comprehensions for efficient coding.</p>",
            podcastEn: "", 
            youtubeUrlHi: "#", 
            docTextHi: "<h4>Python डेटा संरचनाएं</h4><p>लिस्ट ऑपरेशन्स (slicing, append, remove), ट्यूपल अपरिवर्तनीयता, डिक्शनरी key-value जोड़े, सेट्स और कुशल कोडिंग के लिए लिस्ट कम्प्रिहेंशन में महारत हासिल करें।</p>",
            podcastHi: "" 
        },
        { 
            titleEn: "5. Functions and Modules",
            titleHi: "5. फंक्शन और मॉड्यूल",
            youtubeUrlEn: "#", 
            docTextEn: "<h4>Code Reusability</h4><p>Learn to define functions with parameters and return values, lambda functions, *args and **kwargs, importing modules (math, random, datetime), and creating your own modules.</p>",
            podcastEn: "", 
            youtubeUrlHi: "#", 
            docTextHi: "<h4>कोड पुन:प्रयोज्यता</h4><p>पैरामीटर्स और रिटर्न वैल्यू के साथ फंक्शन परिभाषित करना, लैम्ब्डा फंक्शन, *args और **kwargs, मॉड्यूल इम्पोर्ट करना (math, random, datetime) और अपने खुद के मॉड्यूल बनाना सीखें।</p>",
            podcastHi: "" 
        },
        { 
            titleEn: "6. Object-Oriented Programming",
            titleHi: "6. ऑब्जेक्ट-ओरिएंटेड प्रोग्रामिंग",
            youtubeUrlEn: "#", 
            docTextEn: "<h4>OOP in Python</h4><p>Understand classes, objects, __init__ constructor, instance variables, methods, inheritance, method overriding, encapsulation (private variables), and polymorphism in Python.</p>",
            podcastEn: "", 
            youtubeUrlHi: "#", 
            docTextHi: "<h4>Python में OOP</h4><p>क्लासेस, ऑब्जेक्ट्स, __init__ कंस्ट्रक्टर, इंस्टेंस वेरिएबल्स, मेथड्स, इनहेरिटेंस, मेथड ओवरराइडिंग, एन्कैप्सुलेशन (private वेरिएबल्स) और पॉलीमॉर्फिज्म को समझें।</p>",
            podcastHi: "" 
        },
        { 
            titleEn: "7. File Handling & Error Management",
            titleHi: "7. फाइल हैंडलिंग और एरर प्रबंधन",
            youtubeUrlEn: "#", 
            docTextEn: "<h4>Working with External Data</h4><p>Learn to open, read, write, and close files using 'with' statement, handle CSV files with csv module, try-except-finally blocks, and common Python exceptions.</p>",
            podcastEn: "", 
            youtubeUrlHi: "#", 
            docTextHi: "<h4>बाहरी डेटा के साथ काम करना</h4><p>'with' स्टेटमेंट का उपयोग करके फाइलें खोलना, पढ़ना, लिखना और बंद करना, csv मॉड्यूल के साथ CSV फाइलें हैंडल करना, try-except-finally ब्लॉक और सामान्य Python exceptions सीखें।</p>",
            podcastHi: "" 
        }
    ]

};

const progLangSelect = document.getElementById('prog-lang-select');
const siteLangSelect = document.getElementById('site-lang-select');
const topicListElement = document.getElementById('topic-list');
const contentAreaElement = document.getElementById('content-area');

// SECURITY: Since topicsData is hardcoded, we trust it, but we use a basic sanitizer
// for anything that might be user-provided in the future.
function sanitizeHTML(html) {
    // In a production app, use DOMPurify: DOMPurify.sanitize(html)
    return html; 
}

// 2. Render Functions
function renderSubtopics() {
    const selectedCourse = progLangSelect.value;
    const selectedLang = siteLangSelect.value;
    const topics = topicsData[selectedCourse] || [];
    topicListElement.innerHTML = '';
    
    topics.forEach(topicObj => {
        const li = document.createElement('li');
        li.textContent = selectedLang === 'hi' ? (topicObj.titleHi || topicObj.titleEn) : topicObj.titleEn;
        li.className = "topic-item";
        li.addEventListener('click', () => { renderActionPanel(topicObj, selectedLang); });
        topicListElement.appendChild(li);
    });
}

// Function to save progress to backend
async function saveProgressToBackend(course, topic) {
    const user = JSON.parse(localStorage.getItem('ide_user'));
    if (!user || !user.token) return;

    try {
        await fetch(`${API_BASE_URL}/api/auth/update-progress`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ course, topic })
        });
    } catch (error) {
        console.error("Error saving progress to backend:", error);
    }
}

function renderActionPanel(topicObj, langCode) {
    const displayName = langCode === 'hi' ? (topicObj.titleHi || topicObj.titleEn) : topicObj.titleEn;
    
    // Progress Tracking
    const selectedCourse = progLangSelect.value;
    let completedTopics = JSON.parse(localStorage.getItem('completed_' + selectedCourse)) || [];
    if (!completedTopics.includes(topicObj.titleEn)) {
        completedTopics.push(topicObj.titleEn);
        localStorage.setItem('completed_' + selectedCourse, JSON.stringify(completedTopics));
        
        // Save to backend as well
        saveProgressToBackend(selectedCourse, topicObj.titleEn);
    }

    let podcastLink = topicObj.podcastEn;
    let videoLink = topicObj.youtubeUrlEn;
    let docContent = topicObj.docTextEn;

    if (langCode === 'hi') {
        podcastLink = topicObj.podcastHi || topicObj.podcastEn;
        videoLink = topicObj.youtubeUrlHi || topicObj.youtubeUrlEn;
        docContent = topicObj.docTextHi || topicObj.docTextEn;
    }

    // Fix absolute paths to be relative to root
    if (podcastLink && !podcastLink.startsWith('http') && !podcastLink.startsWith('/')) {
        // @raj:this file is in public/javascript/tutorial.js, so we need to go up two levels to reach the root
      
        podcastLink = '../../' + podcastLink;
    }

    const safeDocText = encodeURIComponent(docContent || "<p>Content coming soon...</p>");

    const htmlContent = `
        <div class="action-panel-content">
            <h2 class="action-header">${displayName}</h2>
            <div class="action-cards">
                <a href="#" onclick="openVideoModal('${videoLink}', '${displayName}')" class="action-card">
                    <i class="fas fa-video"></i><span>Watch Video</span>
                </a>
                <a href="#" onclick="openDocModal('${displayName}', '${safeDocText}')" class="action-card">
                    <i class="fas fa-book-open"></i><span>Read Documentation</span>
                </a>
               <a href="#" onclick="openPodcastModal('${displayName}', '${podcastLink}')" class="action-card">
                    <i class="fas fa-podcast"></i><span>Listen Podcast</span>
                </a>
                <a href="#" onclick="openIDE(event)" class="action-card" style="border-color: #0067f6;">
                    <i class="fas fa-laptop-code" style="color: #0067f6;"></i><span>Practice in IDE</span>
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

// 3. Modal Functions with Graceful Fallbacks (Duplicates removed!)
function openVideoModal(videoUrl, title) {
    if (!videoUrl || videoUrl === '#' || videoUrl.includes('YOUR_HINDI_VIDEO_ID')) {
        alert("This video is currently being recorded and will be available soon!");
        return; 
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
    if (!audioUrl || audioUrl === '#') {
        alert("The AI is currently generating the podcast for this topic. Please check back later!");
        return;
    }
    document.getElementById('podcastModalTitle').textContent = title + " - Audio Lesson";
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.src = audioUrl;
    document.getElementById('podcastModal').style.display = "block";
    audioPlayer.play().catch(e => console.log("Autoplay prevented by browser."));
}

function closePodcastModal() {
    const audioPlayer = document.getElementById('audioPlayer');
    audioPlayer.pause();
    audioPlayer.currentTime = 0;
    document.getElementById('podcastModal').style.display = "none";
}

// 4. Initialize Listeners
progLangSelect.addEventListener('change', () => { renderSubtopics(); resetContentArea(); });
siteLangSelect.addEventListener('change', () => { renderSubtopics(); resetContentArea(); });
renderSubtopics();