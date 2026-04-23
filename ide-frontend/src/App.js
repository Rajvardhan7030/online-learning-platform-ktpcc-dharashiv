// src/App.js
import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import AuthModal from './components/AuthModal';
import './App.css';

import { API_URL, MAIN_FRONTEND_URL } from './config';

function App() {
    const [language, setLanguage] = useState('html');
    const [codes, setCodes] = useState({
        html: '<h1>Hello World</h1>\n<p>This runs in your browser!</p>\n<style>\n  h1 { color: #61dafb; }\n  body { font-family: sans-serif; }\n</style>',
        javascript: '// JavaScript (Node.js mode)\nconsole.log("Hello from Node!");',
        python: 'print("Hello from Python!")',
        java: 'public class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello from Java!");\n  }\n}',
        c: '#include <stdio.h>\n\nint main() {\n  printf("Hello from C!\\n");\n  return 0;\n}'
    });
    const [output, setOutput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    // Auth and Save State
    const [user, setUser] = useState(null);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [saveStatus, setSaveStatus] = useState('');
    const [showOutput, setShowOutput] = useState(false);

    const setCode = (newCode) => {
        setCodes(prev => ({ ...prev, [language]: newCode }));
    };
    const code = codes[language];

    // 1. Restore user session on page load (Local Storage or URL Auth Bridge)
    useEffect(() => {
        // Check for ?auth= parameter first (Auth Bridge)
        const urlParams = new URLSearchParams(window.location.search);
        const authData = urlParams.get('auth');

        if (authData) {
            try {
                const decodedData = JSON.parse(decodeURIComponent(authData));
                setUser(decodedData);
                localStorage.setItem('ide_user', JSON.stringify(decodedData));
                // Clean up the URL
                window.history.replaceState({}, document.title, window.location.pathname);
            } catch (error) {
                console.error("Failed to parse auth data from URL.");
            }
        } else {
            const storedUser = localStorage.getItem('ide_user');
            if (storedUser) {
                try {
                    setUser(JSON.parse(storedUser));
                } catch (error) {
                    console.error("Failed to parse user session.");
                }
            }
        }
    }, []);

    // Handle logout with dynamic URL from config
    const handleLogout = useCallback(() => {
        if (window.confirm("Are you sure you want to log out from the IDE?")) {
            setUser(null); 
            localStorage.removeItem('ide_user');
            setOutput('');
            window.location.href = MAIN_FRONTEND_URL;
        }
    }, []);

    const handleRunCode = async () => {
        setIsLoading(true);
        if (language === 'html') {
            setOutput(code);
            setIsLoading(false);
            setShowOutput(true);
            return;
        }
        
        try {
            const response = await axios.post(`${API_URL}/api/code/execute`, { language, code });
            setOutput(response.data.output || "No output returned.");
            setShowOutput(true);
        } catch (error) {
            setOutput(error.response?.data?.output || error.response?.data?.message || "Error executing code");
            setShowOutput(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCode = async () => {
        if (!user || !user.token) {
            setShowAuthModal(true);
            return;
        }
        
        const snippetTitle = window.prompt("Enter a title for your snippet:", `My ${language} Snippet`);
        if (!snippetTitle) return; // User cancelled

        setSaveStatus('Saving...');

        try {
            await axios.post(`${API_URL}/api/code/save`, 
                { title: snippetTitle, language, code },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setSaveStatus('Saved successfully!');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error("Save error:", error);
            setSaveStatus(error.response?.data?.message || 'Error saving code');
        }
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setOutput('');
    };

    return (
        <div className="ide-container">
            <header className="header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img src="logo.jpeg" alt="Logo" style={{ borderRadius: '50%' }} />
                    <h2 style={{ margin: 0, fontSize: '20px', color: '#6C63FF' }}>E-Learn IDE</h2>
                </div>
                
                <div className="controls">
                    <select value={language} onChange={handleLanguageChange}>
                        <option value="html">HTML/CSS/JS (Web)</option>
                        <option value="javascript">JavaScript (Node)</option>
                        <option value="python">Python</option>
                       
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
                <div className="editor-wrapper" style={{ width: '100%' }}>
                    <CodeEditor language={language === 'html' ? 'html' : language} code={code} setCode={setCode} />
                </div>
                
                {showOutput && (
                    <div className="output-overlay">
                        <div className="output-modal">
                            <div className="output-header">
                                <h3>Execution Result</h3>
                                <button className="close-output" onClick={() => setShowOutput(false)}>&times;</button>
                            </div>
                            <div className="output-box">
                                {language === 'html' ? (
                                    <iframe srcDoc={output} title="output" sandbox="allow-scripts" style={{ width: '100%', height: '100%', border: 'none', backgroundColor: '#fff' }} />
                                ) : (
                                    <pre style={{ margin: 0, color: '#ddd', whiteSpace: 'pre-wrap' }}>
                                        {output || "Execution finished with no output."}
                                    </pre>
                                )}
                            </div>
                        </div>
                    </div>
                )}
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
