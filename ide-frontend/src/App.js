// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CodeEditor from './components/CodeEditor';
import AuthModal from './components/AuthModal';
import './App.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

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

    const setCode = (newCode) => {
        setCodes(prev => ({ ...prev, [language]: newCode }));
    };
    const code = codes[language];

    // 1. SOLVES THE WARNING: Use useEffect to automatically restore the user's session on page load
    useEffect(() => {
        const storedUser = localStorage.getItem('ide_user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (error) {
                console.error("Failed to parse user session.");
            }
        }
    }, []);

    // 2. SOLVES THE ERROR: Define the missing handleLogout function
    const handleLogout = () => {
        setUser(null); // Clear React state
        localStorage.removeItem('ide_user'); // Clear browser storage
        setOutput(''); // Optional: clear output screen on logout
    };

    const handleRunCode = async () => {
        setIsLoading(true);
        if (language === 'html') {
            setOutput(code);
            setIsLoading(false);
            return;
        }
        
        try {
            const response = await axios.post(`${API_URL}/api/code/execute`, { language, code });
            setOutput(response.data.output);
        } catch (error) {
            setOutput(error.response?.data?.output || "Error executing code");
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveCode = async () => {
        if (!user || !user.token) return;
        setSaveStatus('Saving...');

        try {
            await axios.post(`${API_URL}/api/code/save`, 
                { title: `My ${language} Snippet`, language, code },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );
            setSaveStatus('Saved successfully!');
            setTimeout(() => setSaveStatus(''), 3000);
        } catch (error) {
            console.error("Save error:", error);
            setSaveStatus('Error saving code');
        }
    };

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setOutput('');
    };

    // The return() block stays exactly the same as your original code
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
                    // Make sure the modal also saves the user to localStorage when they log in!
                    onLoginSuccess={(userData) => {
                        setUser(userData);
                        localStorage.setItem('ide_user', JSON.stringify(userData));
                    }} 
                />
            )}
        </div>
    );
}

export default App;