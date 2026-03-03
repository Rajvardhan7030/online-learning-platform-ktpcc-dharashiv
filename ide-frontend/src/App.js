// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import AuthModal from './components/AuthModal';
import './App.css';

function App() {
    const [language, setLanguage] = useState('html');
    const [code, setCode] = useState('<h1>Hello World</h1>\n<p>This runs in your browser!</p>\n<style>\n  h1 { color: #61dafb; }\n  body { font-family: sans-serif; }\n</style>');
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Auth and Save State
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');

 // Check if user is already logged in on page load
    useEffect(() => {
        // 1. Check if login data was passed through the URL (The Auth Bridge)
        const urlParams = new URLSearchParams(window.location.search);
        const authData = urlParams.get('auth');

        if (authData) {
            try {
                // Decode the data, save it to React's local storage, and log the user in
                const parsedData = JSON.parse(decodeURIComponent(authData));
                localStorage.setItem('ide_user', JSON.stringify(parsedData));
                setUser(parsedData);
                
                // Clean up the URL so the token isn't visible in the address bar
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error("Error parsing auth data from URL", error);
            }
        } else {
            // 2. If no URL data, check React's local storage normally
            const loggedInUser = localStorage.getItem('ide_user');
            if (loggedInUser) {
                setUser(JSON.parse(loggedInUser));
            }
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('ide_user');
        setUser(null);
        setOutput('');
    };

    const handleRunCode = async () => {
        setIsLoading(true);
        if (language === 'html') {
            setOutput(code);
            setIsLoading(false);
            return;
        }
        setTimeout(() => {
            setOutput(`[System Message]: Server-side execution is currently disabled on this machine to save resources.\n\nTo run ${language}, please deploy the backend to a cloud server with Docker support.`);
            setIsLoading(false);
        }, 500); 
    };

    // NEW: Function to save code to MongoDB
    const handleSaveCode = async () => {
        if (!user || !user.token) return;
        setSaveStatus('Saving...');

        try {
            // Send the code along with the JWT in the Authorization header
            await axios.post('http://localhost:5000/api/code/save', 
                { title: `My ${language} Snippet`, language, code },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setSaveStatus('Saved successfully!');
            setTimeout(() => setSaveStatus(''), 3000); // Clear message after 3s
        } catch (error) {
            console.error("Save error:", error);
            setSaveStatus('Error saving code');
        }
    };

    const handleLanguageChange = (e) => {
        const newLang = e.target.value;
        setLanguage(newLang);
        if (newLang === 'html') setCode('<h1>Hello World</h1>\n<p>This runs in your browser!</p>\n<style>\n  h1 { color: #61dafb; }\n  body { font-family: sans-serif; }\n</style>');
        else if (newLang === 'python') setCode('print("Hello from Python!")');
        else if (newLang === 'java') setCode('public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}');
        else if (newLang === 'c') setCode('#include <stdio.h>\n\nint main() {\n  printf("Hello from C!\\n");\n  return 0;\n}');
        else setCode('// JavaScript (Node.js mode)');
        setOutput('');
    };

    return (
        <div className="ide-container">
            <header className="header">
                <h2>eLearning IDE</h2>
                
                {/* Center controls: Language & Run */}
                <div className="controls">
                    <select value={language} onChange={handleLanguageChange}>
                        <option value="html">HTML/CSS/JS (Web)</option>
                        <option value="javascript">JavaScript (Node)</option>
                        <option value="python">Python</option>
                        <option value="java">Java</option>
                        <option value="c">C</option>
                    </select>
                    <button onClick={handleRunCode} disabled={isLoading}>
                        {isLoading ? 'Running...' : 'Run Code'}
                    </button>
                    {user && (
                        <button style={{ backgroundColor: '#28a745' }} onClick={handleSaveCode}>
                            Save Snippet
                        </button>
                    )}
                    <span style={{ marginLeft: '10px', color: '#4fc1ff', fontSize: '14px' }}>{saveStatus}</span>
                </div>

                {/* Right side: Login/Logout controls */}
                <div>
                    {user ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <span style={{ fontSize: '14px' }}>Welcome, {user.username}</span>
                            <button onClick={handleLogout} style={{ backgroundColor: '#dc3545' }}>Logout</button>
                        </div>
                    ) : (
                        <button onClick={() => setShowAuthModal(true)}>Log In</button>
                    )}
                </div>
            </header>

            <div className="main-content">
                <CodeEditor language={language === 'html' ? 'html' : language} code={code} setCode={setCode} />
                <div className="output-section">
                    <h3>Output</h3>
                    <div className="output-box">
                        {language === 'html' ? (
                            <iframe srcDoc={output} title="output" sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }} />
                        ) : (
                            <pre style={{ margin: 0, color: language === 'html' ? 'black' : '#ddd' }}>
                                {output || "Click 'Run Code' to see the output here."}
                            </pre>
                        )}
                    </div>
                </div>
            </div>

            {/* Render the modal if showAuthModal is true */}
            {showAuthModal && (
                <AuthModal 
                    onClose={() => setShowAuthModal(false)} 
                    onLoginSuccess={(userData) => setUser(userData)} 
                />
            )}
        </div>
    );
}

export default App;