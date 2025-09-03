document.addEventListener('DOMContentLoaded', () => {
    const topicForm = document.getElementById('topic-form');
    const topicInput = document.getElementById('topic-input');
    const contentContainer = document.getElementById('content-container');
    const mainTitle = document.querySelector('h1');

    // --- MOCK API FETCHER ---
    // Simulates fetching data from the AI service.
    function fetchAiData(query) {
        return new Promise((resolve, reject) => {
            if (mockAiData[query]) {
                resolve(mockAiData[query]);
            } else {
                reject(`Content for "${query}" not found.`);
            }
        });
    }

    // --- RENDERING FUNCTIONS ---

    function clearContent() {
        contentContainer.innerHTML = '';
    }

    // Renders a list of clickable items (sections or sub-sections)
    function renderList(title, items) {
        clearContent();

        const listTitle = document.createElement('h2');
        listTitle.textContent = title;
        contentContainer.appendChild(listTitle);

        const ul = document.createElement('ul');
        items.forEach(itemText => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = itemText;
            a.href = '#'; // Make it behave like a link
            li.appendChild(a);
            ul.appendChild(li);
        });
        contentContainer.appendChild(ul);
    }

    // Renders the final documentation content
    function renderContent(data) {
        clearContent();
        contentContainer.innerHTML = data.content;
    }

    // Renders an error message
    function renderError(message) {
        clearContent();
        const errorMsg = document.createElement('p');
        errorMsg.textContent = message;
        contentContainer.appendChild(errorMsg);
    }

    // --- EVENT HANDLERS ---

    // Handle the initial topic submission
    topicForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = topicInput.value.trim();
        if (!query) return;

        fetchAiData(query)
            .then(data => {
                if (data.type === 'topic') {
                    renderList(`Sections for: ${data.title}`, data.sections);
                } else {
                    // Handle cases where user directly types a section/sub-section name
                    handleContentNavigation(data);
                }
            })
            .catch(error => {
                renderError(error);
            });
    });

    // Handle clicks on dynamic content using event delegation
    contentContainer.addEventListener('click', (event) => {
        if (event.target.tagName === 'A') {
            event.preventDefault();
            const query = event.target.textContent;

            fetchAiData(query)
                .then(data => {
                    handleContentNavigation(data);
                })
                .catch(error => {
                    renderError(error);
                });
        }
    });

    // Resets the view to the initial state when the main title is clicked
    mainTitle.addEventListener('click', () => {
        topicInput.value = '';
        clearContent();
        const p = document.createElement('p');
        p.textContent = 'Please enter a topic above and click "Generate Content" to start your learning journey.';
        contentContainer.appendChild(p);
    });

    // Helper to decide what to render based on data type
    function handleContentNavigation(data) {
        if (data.type === 'section') {
            renderList(`Sub-sections for: ${data.title}`, data.subsections);
        } else if (data.type === 'subsection') {
            renderContent(data);
        }
    }
});
