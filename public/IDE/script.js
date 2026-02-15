let editor;

require.config({
    paths: { vs: "https://unpkg.com/monaco-editor@latest/min/vs" }
});

require(["vs/editor/editor.main"], function () {

    editor = monaco.editor.create(
        document.getElementById("editor"),
        {
            value: "// Write your code here",
            language: "javascript",
            theme: "vs-dark",
            automaticLayout: true
        }
    );
});


async function runCode() {

    const language = document.getElementById("language").value;
    const code = editor.getValue();
    const outputBox = document.getElementById("output");

    outputBox.textContent = "Running...";

    // HTML & CSS preview locally
    if (language === "html" || language === "css") {
        const win = window.open();
        win.document.write(code);
        outputBox.textContent = "Opened in new preview tab.";
        return;
    }

    try {
        const response = await fetch(
            "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
                    "X-RapidAPI-Key": "YOUR_RAPIDAPI_KEY"
                },
                body: JSON.stringify({
                    source_code: code,
                    language_id: language
                })
            }
        );

        const result = await response.json();

        outputBox.textContent =
            result.stdout ||
            result.stderr ||
            result.compile_output ||
            "No Output";

    } catch (err) {
        outputBox.textContent = "Error running code.";
    }
}
