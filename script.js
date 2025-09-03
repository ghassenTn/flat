document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    // IMPORTANT: Do NOT hardcode your API key here in a real application.
    // This is a placeholder and should be replaced with a secure method
    // for handling secrets, like a backend proxy or environment variables.
    const GEMINI_API_KEY = "PASTE_YOUR_NEW_API_KEY_HERE";
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // --- DOM ELEMENTS ---
    const topicForm = document.getElementById('topic-form');
    const topicInput = document.getElementById('topic-input');
    const contentContainer = document.getElementById('content-container');
    const mainTitle = document.querySelector('h1');

    // --- STATE ---
    // Keep track of the current topic to provide context for prompts.
    let currentTopic = '';

    // --- API FETCHER ---
    async function fetchAiData(prompt) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: prompt
                        }]
                    }]
                })
            });

            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`);
            }

            const data = await response.json();
            // Extract the text from the response.
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error fetching from Gemini API:", error);
            return "Error: Could not fetch a response from the AI. Please check the console for details.";
        }
    }

    // --- RENDERING FUNCTIONS ---

    function clearContent() {
        contentContainer.innerHTML = '';
        const loading = document.createElement('p');
        loading.textContent = 'Generating...';
        contentContainer.appendChild(loading);
    }

    // Renders a list of clickable items (sections or sub-sections)
    function renderList(title, listText, context) {
        contentContainer.innerHTML = ''; // Clear loading message

        const listTitle = document.createElement('h2');
        listTitle.textContent = title;
        contentContainer.appendChild(listTitle);

        const ul = document.createElement('ul');
        // Parse the numbered list from the AI's response.
        const items = listText.trim().split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim());

        items.forEach(itemText => {
            if (!itemText) return; // Skip empty lines
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = itemText;
            a.href = '#';
            // Store the context for the next click handler.
            a.dataset.context = context;
            li.appendChild(a);
            ul.appendChild(li);
        });
        contentContainer.appendChild(ul);
    }

    // Renders the final documentation content
    function renderContent(htmlContent) {
        contentContainer.innerHTML = htmlContent;
    }

    // --- EVENT HANDLERS ---

    // Handle the initial topic submission
    topicForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = topicInput.value.trim();
        if (!query || !GEMINI_API_KEY.startsWith('AIza')) {
            renderContent("<p>Please enter a topic and ensure your API key is set in script.js.</p>");
            return;
        }
        currentTopic = query;
        clearContent();

        const prompt = `For the learning topic "${currentTopic}", provide a numbered list of the main sections. Respond with only the numbered list, with each item on a new line.`;
        const responseText = await fetchAiData(prompt);
        renderList(`Sections for: ${currentTopic}`, responseText, 'section');
    });

    // Handle clicks on dynamic content using event delegation
    contentContainer.addEventListener('click', async (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const query = event.target.textContent;
            const context = event.target.dataset.context;

            clearContent();
            let prompt = '';
            if (context === 'section') {
                prompt = `For the learning section "${query}" within the topic "${currentTopic}", provide a numbered list of the relevant sub-sections. Respond with only the numbered list, with each item on a new line.`;
                const responseText = await fetchAiData(prompt);
                renderList(`Sub-sections for: ${query}`, responseText, 'subsection');
            } else if (context === 'subsection') {
                prompt = `Generate a detailed but beginner-friendly documentation page for the topic "${query}". The overall subject is "${currentTopic}". Use simple HTML tags for structure, like <h2> for the title, <p> for paragraphs, and <pre><code> for any code examples.`;
                const responseHtml = await fetchAiData(prompt);
                renderContent(responseHtml);
            }
        }
    });

    // Resets the view to the initial state when the main title is clicked
    mainTitle.addEventListener('click', () => {
        currentTopic = '';
        topicInput.value = '';
        contentContainer.innerHTML = '<p>Please enter a topic above and click "Generate Content" to start your learning journey.</p>';
    });
});
