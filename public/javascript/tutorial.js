
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

        // 3. Functions

        /**
         * Renders the sidebar list based on currently selected programming & site languages
         */
        function renderSubtopics() {
            const selectedProgLang = progLangSelect.value;
            const selectedSiteLang = siteLangSelect.value;
            const topics = topicsData[selectedProgLang];
            const suffix = languageSuffixes[selectedSiteLang];

            // Clear current list
            topicListElement.innerHTML = '';

            // Generate list items
            topics.forEach((topic, index) => {
                const li = document.createElement('li');
                li.className = 'topic-item';
                // Append dummy translation suffix if not English
                const translatedTopic = `${topic}${suffix}`;
                li.textContent = translatedTopic;
                
                // Add click listener
                li.addEventListener('click', () => {
                    handleTopicClick(li, translatedTopic);
                });

                topicListElement.appendChild(li);
            });
        }

        /**
         * Handles clicking on a sidebar subtopic
         * Highlights the active item and displays the 3 option cards.
         */
        function handleTopicClick(clickedElement, topicName) {
            // Remove 'active' class from all siblings
            const allItems = topicListElement.querySelectorAll('.topic-item');
            allItems.forEach(item => item.classList.remove('active'));
            
            // Add 'active' class to clicked element
            clickedElement.classList.add('active');

            // Render the Action Panel inside content area
            renderActionPanel(topicName);
        }

        /**
         * Renders the 3 action cards (Video, Docs, Podcast) for a selected topic
         */
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
                    </div>
                </div>
            `;
            contentAreaElement.innerHTML = htmlContent;
        }

        /**
         * Resets the content area back to the placeholder state
         */
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
            // If a topic was already selected, reset the panel to avoid mismatched states
            resetContentArea(); 
        });

        // 5. Initial Render on Page Load
        renderSubtopics();

    