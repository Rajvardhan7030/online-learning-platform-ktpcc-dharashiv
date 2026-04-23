const forumState = {
    threads: []
};

function getCurrentUser() {
    try {
        return JSON.parse(localStorage.getItem('ide_user'));
    } catch (error) {
        return null;
    }
}

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function formatDate(dateValue) {
    return new Date(dateValue).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'short'
    });
}

function updateStats() {
    const threadCount = document.getElementById('thread-count');
    const answerCount = document.getElementById('answer-count');
    const totalAnswers = forumState.threads.reduce((sum, thread) => sum + thread.answers.length, 0);

    if (threadCount) threadCount.textContent = String(forumState.threads.length);
    if (answerCount) answerCount.textContent = String(totalAnswers);
}

function renderThreads() {
    const threadList = document.getElementById('thread-list');
    const user = getCurrentUser();

    if (!threadList) return;

    if (!forumState.threads.length) {
        threadList.innerHTML = '<div class="thread-empty">No questions yet. Start the first discussion.</div>';
        updateStats();
        return;
    }

    threadList.innerHTML = forumState.threads.map((thread) => `
        <article class="thread-card">
            <div class="thread-header">
                <div>
                    <h3>${escapeHtml(thread.title)}</h3>
                    <p class="thread-meta">Asked by ${escapeHtml(thread.author?.username || 'Community member')} on ${formatDate(thread.createdAt)}</p>
                </div>
                <strong>${thread.answers.length} answers</strong>
            </div>
            <p class="thread-body">${escapeHtml(thread.body)}</p>
            <div class="thread-tags">
                ${(thread.tags || []).map((tag) => `<span>${escapeHtml(tag)}</span>`).join('')}
            </div>
            <section class="answer-list">
                ${thread.answers.length ? thread.answers.map((answer) => `
                    <article class="answer-item">
                        <p class="answer-meta">Answered by ${escapeHtml(answer.author?.username || 'Community member')} on ${formatDate(answer.createdAt)}</p>
                        <p class="answer-body">${escapeHtml(answer.body)}</p>
                    </article>
                `).join('') : '<p class="thread-meta">No answers yet. Be the first to help.</p>'}
            </section>
            <form class="answer-form" data-thread-id="${thread.id}">
                <label for="answer-${thread.id}">Your answer</label>
                <textarea id="answer-${thread.id}" rows="4" placeholder="${user ? 'Share a helpful answer.' : 'Sign in to answer questions.'}" ${user ? '' : 'disabled'}></textarea>
                <button type="submit" ${user ? '' : 'disabled'}>Post Answer</button>
                <p class="form-message"></p>
            </form>
        </article>
    `).join('');

    updateStats();
}

async function loadThreads() {
    const threadList = document.getElementById('thread-list');
    if (threadList) {
        threadList.innerHTML = '<div class="thread-empty">Loading discussions...</div>';
    }

    try {
        const response = await fetch(`${API_BASE_URL}/api/forum/threads`);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to load discussions');
        }

        forumState.threads = result.data || [];
        renderThreads();
    } catch (error) {
        if (threadList) {
            threadList.innerHTML = `<div class="thread-empty">${escapeHtml(error.message)}</div>`;
        }
    }
}

async function createThread(event) {
    event.preventDefault();
    const user = getCurrentUser();
    const message = document.getElementById('thread-form-message');

    if (!user?.token) {
        message.textContent = 'Sign in to post a question.';
        return;
    }

    const formData = new FormData(event.target);
    const payload = Object.fromEntries(formData.entries());

    try {
        message.textContent = 'Posting question...';
        const response = await fetch(`${API_BASE_URL}/api/forum/threads`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok) {
            const validationErrors = Array.isArray(result.errors) ? result.errors.map((item) => item.msg).join(' ') : '';
            throw new Error(validationErrors || result.message || 'Failed to post question');
        }

        event.target.reset();
        message.textContent = 'Question posted successfully.';
        forumState.threads.unshift(result.data);
        renderThreads();
    } catch (error) {
        message.textContent = error.message;
    }
}

async function submitAnswer(event) {
    const form = event.target.closest('.answer-form');
    if (!form) return;

    event.preventDefault();
    const user = getCurrentUser();
    const message = form.querySelector('.form-message');
    const textarea = form.querySelector('textarea');

    if (!user?.token) {
        message.textContent = 'Sign in to answer questions.';
        return;
    }

    const body = textarea.value.trim();
    if (!body) {
        message.textContent = 'Answer cannot be empty.';
        return;
    }

    try {
        message.textContent = 'Posting answer...';
        const response = await fetch(`${API_BASE_URL}/api/forum/threads/${form.dataset.threadId}/answers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({ body })
        });

        const result = await response.json();

        if (!response.ok) {
            const validationErrors = Array.isArray(result.errors) ? result.errors.map((item) => item.msg).join(' ') : '';
            throw new Error(validationErrors || result.message || 'Failed to post answer');
        }

        forumState.threads = forumState.threads.map((thread) => thread.id === result.data.id ? result.data : thread);
        renderThreads();
    } catch (error) {
        message.textContent = error.message;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const threadForm = document.getElementById('thread-form');

    if (threadForm) {
        threadForm.addEventListener('submit', createThread);
    }

    document.addEventListener('submit', (event) => {
        if (event.target.matches('.answer-form')) {
            submitAnswer(event);
        }
    });

    loadThreads();
});
