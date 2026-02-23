// backend/install_runtimes.js
async function installRuntimes() {
    try {
        console.log("1. Fetching available packages from local Piston API...");
        // Ask the local Docker container for all available language packages
        const response = await fetch('http://127.0.0.1:2000/api/v2/packages');
        const packages = await response.json();

        // Helper function to find the newest version of a specific language
        const getLatest = (lang) => packages.filter(p => p.language === lang).pop();
        
        // We need Python, Java, C (often packaged as gcc), and JavaScript
        const runtimesToInstall = [
            getLatest('python'),
            getLatest('java'),
            getLatest('c') || getLatest('gcc'),
            getLatest('javascript') || getLatest('node')
        ].filter(Boolean);

        console.log(`2. Found ${runtimesToInstall.length} runtimes to install. This might take a minute...`);

        // Loop through and tell the Docker container to install each one
        for (const runtime of runtimesToInstall) {
            console.log(`-> Installing ${runtime.language} (v${runtime.language_version})...`);
            await fetch('http://127.0.0.1:2000/api/v2/packages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ language: runtime.language, version: runtime.language_version })
            });
            console.log(`   ✅ ${runtime.language} installed successfully.`);
        }
        
        console.log("🎉 All done! Your sandbox is ready.");
    } catch (error) {
        console.error("❌ Error connecting to local Piston API. Is the Docker container running?", error.message);
    }
}

installRuntimes();