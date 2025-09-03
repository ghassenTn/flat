document.addEventListener('DOMContentLoaded', () => {
    // --- CONFIGURATION ---
    // IMPORTANT: Do NOT hardcode your API key here.
    // Replace "PASTE_YOUR_NEW_API_KEY_HERE" with your actual Gemini API key.
    // In a real application, use a secure method to handle this secret.
    const GEMINI_API_KEY = "PASTE_YOUR_NEW_API_KEY_HERE";
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

    // --- DOM ELEMENTS ---
    const topicForm = document.getElementById('topic-form');
    const topicInput = document.getElementById('topic-input');
    const contentContainer = document.getElementById('content-container');
    const mainTitle = document.querySelector('h1');
    const loginForm = document.getElementById('login-form');
    const usernameInput = document.getElementById('username-input');
    const userStatus = document.getElementById('user-status');
    const welcomeMessage = document.getElementById('welcome-message');
    const logoutButton = document.getElementById('logout-button');

    // --- STATE ---
    let currentTopic = '';
    let currentUser = null;
    let courseData = {};

    // --- DATA & UI LOGIC ---
    function saveCourseData() {
        if (currentUser) {
            localStorage.setItem(`courseData_${currentUser}`, JSON.stringify(courseData));
        }
    }

    function loadCourseData() {
        if (currentUser) {
            const savedData = localStorage.getItem(`courseData_${currentUser}`);
            courseData = savedData ? JSON.parse(savedData) : {};
        } else {
            courseData = {};
        }
    }

    function updateUiForLoginState() {
        currentUser = localStorage.getItem('username') || null;
        if (currentUser) {
            welcomeMessage.textContent = `Welcome, ${currentUser}!`;
            userStatus.hidden = false;
            loginForm.hidden = true;
            loadCourseData();
        } else {
            userStatus.hidden = true;
            loginForm.hidden = false;
            courseData = {};
        }
    }

    // --- API FETCHER & RENDERERS ---
    async function fetchAiData(prompt) {
        try {
            const response = await fetch(GEMINI_API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
            });
            if (!response.ok) {
                throw new Error(`API error! status: ${response.status}`);
            }
            const data = await response.json();
            return data.candidates[0].content.parts[0].text;
        } catch (error) {
            console.error("Error fetching from Gemini API:", error);
            return "Error: Could not fetch a response from the AI.";
        }
    }

    function renderList(title, items, context) {
        contentContainer.innerHTML = '';
        const listTitle = document.createElement('h2');
        listTitle.textContent = title;
        contentContainer.appendChild(listTitle);
        const ul = document.createElement('ul');
        const listItems = Array.isArray(items) ? items : items.trim().split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim());

        listItems.forEach(itemText => {
            if (!itemText) return;
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = itemText;
            a.href = '#';
            a.dataset.context = context;
            li.appendChild(a);
            ul.appendChild(li);
        });
        contentContainer.appendChild(ul);
    }

    function renderContent(htmlContent) {
        contentContainer.innerHTML = htmlContent;
    }

    function clearContent(loading = true) {
        contentContainer.innerHTML = '';
        if (loading) {
            const loadingMsg = document.createElement('p');
            loadingMsg.textContent = 'Generating...';
            contentContainer.appendChild(loadingMsg);
        }
    }

    // --- EVENT HANDLERS ---
    loginForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const username = usernameInput.value.trim();
        if (username) {
            localStorage.setItem('username', username);
            updateUiForLoginState();
            usernameInput.value = '';
        }
    });

    logoutButton.addEventListener('click', () => {
        localStorage.removeItem(`courseData_${currentUser}`);
        localStorage.removeItem('username');
        updateUiForLoginState();
    });

    topicForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const query = topicInput.value.trim();
        if (!query) return;
        if (!currentUser) {
            alert("Please log in to save and view your progress.");
            return;
        }
        currentTopic = query;

        if (courseData[currentTopic] && courseData[currentTopic].sections) {
            console.log("Loading sections from localStorage...");
            renderList(`Sections for: ${currentTopic}`, courseData[currentTopic].sections, 'section');
            return;
        }

        clearContent();
        const prompt = `For the learning topic "${currentTopic}", provide a numbered list of the main sections.`;
        const responseText = await fetchAiData(prompt);
        const sections = responseText.trim().split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim());

        courseData[currentTopic] = { sections: sections };
        saveCourseData();
        renderList(`Sections for: ${currentTopic}`, sections, 'section');
    });

    contentContainer.addEventListener('click', async (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const query = event.target.textContent;
            const context = event.target.dataset.context;

            if (courseData[currentTopic] && courseData[currentTopic][query]) {
                const savedItem = courseData[currentTopic][query];
                if (context === 'section' && savedItem.subsections) {
                    console.log("Loading subsections from localStorage...");
                    renderList(`Sub-sections for: ${query}`, savedItem.subsections, 'subsection');
                    return;
                } else if (context === 'subsection' && savedItem.html) {
                    console.log("Loading content from localStorage...");
                    renderContent(savedItem.html);
                    return;
                }
            }

            clearContent();
            let prompt = '';
            if (context === 'section') {
                prompt = `For the learning section "${query}" within "${currentTopic}", provide a numbered list of sub-sections.`;
                const responseText = await fetchAiData(prompt);
                const subsections = responseText.trim().split('\n').map(item => item.replace(/^\d+\.\s*/, '').trim());

                courseData[currentTopic][query] = { subsections: subsections };
                saveCourseData();
                renderList(`Sub-sections for: ${query}`, subsections, 'subsection');

            } else if (context === 'subsection') {
                prompt = `Generate detailed documentation for the topic "${query}" under the main subject "${currentTopic}".`;
                const responseHtml = await fetchAiData(prompt);

                courseData[currentTopic][query] = { html: responseHtml };
                saveCourseData();
                renderContent(responseHtml);
            }
        }
    });

    mainTitle.addEventListener('click', () => {
        topicInput.value = '';
        contentContainer.innerHTML = '<p>Please enter a topic above and click "Generate Content" to start your learning journey.</p>';
    });

    // --- INITIALIZATION ---
    updateUiForLoginState();
});
