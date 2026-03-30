# IDE Implementation: The Code Execution Engine

## Frontend Architecture (React)
- **App.js:** The main orchestrator. It manages the code state (HTML, CSS, JS), handles language switching, and synchronizes with the Monaco Editor.
- **CodeEditor.js:** A wrapper around the `@monaco-editor/react` library. It provides a professional code editing experience with syntax highlighting and IntelliSense.

## Code Execution: How It Works
1. **State Management:** The IDE maintains three separate variables: `html`, `css`, and `js`.
2. **The "Output" System:** We use an `<iframe>` to render the user's code. This provides a "sandbox" for security.
3. **Execution Logic:**
   - Every time the user types or clicks "Run", the IDE generates a complete HTML document string.
   - It combines the HTML, wraps the CSS in `<style>` tags, and the JS in `<script>` tags.
   - It then uses `srcDoc` (a modern iframe attribute) to inject this string into the iframe.
   - The browser then renders the code instantly, giving the user live feedback.

## Server-side Execution (Future Scope)
For languages like Python or Java, we've planned a backend execution engine. This would send the code to the server, run it in a secure Docker container, and return the output to the IDE's terminal.
