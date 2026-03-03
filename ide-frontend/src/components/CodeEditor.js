// src/components/CodeEditor.js
import React from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ language, code, setCode }) => {
    // Function to handle changes in the editor
    const handleEditorChange = (value) => {
        setCode(value);
    };

    return (
        <div className="editor-section">
            <Editor
                height="100%"
                theme="vs-dark" // Professional dark theme
                language={language}
                value={code}
                onChange={handleEditorChange}
                options={{
                    minimap: { enabled: false }, // Hides the minimap to save space
                    fontSize: 16,
                }}
            />
        </div>
    );
};

export default CodeEditor;