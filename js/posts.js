//import { getPosts, createPost } from './api/posts-api.js';

// Theme management
function applyTheme(theme) {
    const root = document.documentElement;
    root.classList.remove('theme-light', 'theme-dark', 'theme-auto');

    if (theme === 'dark') {
        root.classList.add('theme-dark');
    } else if (theme === 'light') {
        root.classList.add('theme-light');
    } else {
        root.classList.add('theme-auto');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('theme-dark');
        }
    }
}

// Format date to Armenian format
function formatDate(dateString) {
    const date = new Date(dateString);
    const months = [
        'Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս',
        'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'
    ];

    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    return `${day} ${month} ${year}, ${hours}:${minutes}`;
}

// Get category label in Armenian
function getCategoryLabel(category) {
    const labels = {
        'job': 'Աշխատանք',
        'internship': 'Պրակտիկա',
        'training': 'Դասընթաց'
    };
    return labels[category] || category;
}

// Render a single post
function renderPost(post) {
    const categoryLabel = getCategoryLabel(post.category);

    return `
        <div class="announcement-card" data-category="${post.category}" data-post-id="${post.id}">
            <div class="announcement-header">
                <img
                    src="${post.author?.avatar || 'https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=100&h=100'}"
                    alt="Օգտատեր" class="user-icon">
                <div class="announcement-info">
                    <h3 class="user-name">${post.author?.name || 'Անանուն'}</h3>
                    <p class="announcement-date">${formatDate(post.createdAt || new Date())}</p>
                </div>
                <span class="category-badge ${post.category}">${categoryLabel}</span>
            </div>
            <div class="announcement-content">
                <p><strong>${post.title}</strong><br>
                ${post.content}
                </p>
            </div>
            <div class="comments-section">
                <h4>Մեկնաբանություններ</h4>
                <div class="comments">
                ${renderComments(post.comments || [])}
                </div>
                <div class="comment-field">
                    <input  class="comment-input" type="text" placeholder="Գրեք մեկնաբանություն...">
                    <button class="comment-btn">Ուղարկել</button>
                </div>
            </div>
        </div>
    `;
}

// Render comments for a post
function renderComments(comments) {
    if (!comments || comments.length === 0) {
        return '';
    }

    return comments.map(comment => renderComment(comment)).join('');
}
function renderComment(comment) {
    return `
        <div class="comment">
            <img
                src="${comment.author?.avatar || 'https://images.pexels.com/photos/3777943/pexels-photo-3777943.jpeg?auto=compress&cs=tinysrgb&w=50&h=50'}"
                alt="Օգտատեր" class="comment-icon">
            <div class="comment-content">
                <p class="comment-author">${comment.author?.name || 'Անանուն'}</p>
                <p class="comment-text">${comment.text}</p>
                <p class="comment-time">${formatDate(comment.createdAt || new Date())}</p>
            </div>
        </div>
    `;
}
// Load and display posts
async function loadPosts() {
    try {
        const response = await getPosts();
        const posts = response.data;

        const announcementsList = document.querySelector('.announcements-list');
        if (!announcementsList) return;

        // Clear existing posts
        announcementsList.innerHTML = '';

        // Render all posts
        if (posts && posts.length > 0) {
            posts.forEach(post => {
                announcementsList.innerHTML += renderPost(post);
            });
        } else {
            announcementsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--text-secondary);">Հայտարարություններ չկան</p>';
        }

        // Apply current filters
        applyFilters();
    } catch (error) {
        console.error('Error loading posts:', error);
        const announcementsList = document.querySelector('.announcements-list');
        if (announcementsList) {
            announcementsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--error-color);">Սխալ՝ հայտարարությունները բեռնելիս</p>';
        }
    }
}

// Apply filters to posts
function applyFilters() {
    const categoryFilter = document.querySelector('.category-selector');
    const selectedCategory = categoryFilter ? categoryFilter.value : '';

    const cards = document.querySelectorAll('.announcement-card');
    cards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');

        if (selectedCategory === '' || cardCategory === selectedCategory) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Handle post creation
async function handleCreatePost(postData) {
    try {
        const response = await createPost(postData);
        const newPost = response.data;

        // Add the new post to the top of the list
        const announcementsList = document.querySelector('.announcements-list');
        if (announcementsList) {
            const newPostHTML = renderPost(newPost);
            announcementsList.insertAdjacentHTML('afterbegin', newPostHTML);
        }

        return true;
    } catch (error) {
        console.error('Error creating post:', error);
        return false;
    }
}
async function addComment(postId, commentData) {
    try {
        const response = await createComment(postId, commentData);
        const newComment = response.data;

        // Add the new comment to the post
        const postElement = document.querySelector(`.announcement-card[data-post-id="${postId}"]`);
        if (postElement) {
            const commentsSection = postElement.querySelector('.comments');
            if (commentsSection) {
                const newCommentHTML = renderComment(newComment);
                commentsSection.insertAdjacentHTML('afterbegin', newCommentHTML);
            }
        }

        return true;
    } catch (error) {
        console.error('Error adding comment:', error);
        return false;
    }
}
// Initialize the page
document.addEventListener('DOMContentLoaded', function () {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Listen for system theme changes if auto
    if (savedTheme === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('theme') === 'auto') {
                applyTheme('auto');
            }
        });
    }

    // Load posts from backend
    loadPosts();

    // Modal elements
    const modal = document.getElementById('postModal');
    const btn = document.querySelector('.create-post-btn');
    const cancelBtn = document.querySelector('.btn-cancel');
    const closeBtn = modal?.querySelector('.close-btn');
    const publishBtn = document.querySelector('.publish-btn');
    const title = document.getElementById('announcement-title');

    // Open modal
    if (btn) {
        btn.onclick = function () {
            modal.style.display = "block";
        }
    }
    function resetModal() {
        modal.querySelector('.editor').innerHTML = '';
        modal.querySelectorAll('.format-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        title.value = '';
        const categorySelector = modal.querySelector('#category-selector');
        if (categorySelector) {
            categorySelector.value = 'job';
        }
        modal.querySelectorAll('.error').forEach(el => el.classList.remove('error'));
    }
    // Close modal function
    function closeModal() {
        resetModal();
        modal.style.display = "none";
    }

    // Cancel/close buttons
    [cancelBtn, closeBtn].forEach(b => b?.addEventListener('click', closeModal));


    // Publish button - create new post
    if (publishBtn) {
        const content = document.getElementById('announcement-content');
        publishBtn.onclick = async function () {

            const titleValue = title.value.trim();
            const contentValue = content.innerHTML.trim();
            const categorySelector = modal.querySelector('#category-selector');
            const category = categorySelector ? categorySelector.value : 'job';

            // Validation
            if (!titleValue) {
                //add red border
                title.classList.add('error');
                return;
            }

            if (!contentValue || contentValue === '<br>') {
                //add red border
                content.classList.add('error');
                return;
            }

            // Create post data
            const postData = {
                title: titleValue,
                content: contentValue,
                category: category
            };

            // Submit to backend
            const success = await handleCreatePost(postData);

            if (success) {
                closeModal();
            }
        };
        // Remove error when user types

        modal.addEventListener('input', (event) => {
            const el = event.target;
            if (el.classList.contains('error')) {
                el.classList.remove('error');
            }
        });

        // For contenteditable (because it doesn't fire input reliably everywhere)
        modal.addEventListener('keyup', (event) => {
            const el = event.target;

            if (el.getAttribute('contenteditable') === "true" &&
                el.classList.contains('error') &&
                el.innerText.trim() !== ""
            ) {
                el.classList.remove('error');
            }
        });

    }
    // Comment button - create new comment
    document.querySelector('.announcements-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('.comment-btn');
        if (!btn) return;

        const post = btn.closest('.announcement-card');
        const postId = post.dataset.postId;
        const commentText = post.querySelector('.comment-input').value.trim();
        // Validation
        if (!commentText) {
            return;
        }

        // Create comment data
        const commentData = {
            text: commentText
        };

        // Submit to backend
        const success = await addComment(postId, commentData);

        if (success) {
            post.querySelector('.comment-input').value = '';
        }

    });



    // Format buttons functionality
    const editor = document.getElementById("announcement-content");
    const buttons = document.querySelectorAll(".format-btn");

    function applyCommand(cmd) {
        editor.focus();
        document.execCommand(cmd, false, null);
        updateActiveButtons();
    }

    function updateActiveButtons() {
        buttons.forEach(btn => {
            const cmd = btn.dataset.command;
            btn.classList.toggle("active", document.queryCommandState(cmd));
        });
    }

    // Format button listeners
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            applyCommand(btn.dataset.command);
        });
    });

    // Update state on editor interaction
    if (editor) {
        editor.addEventListener("keyup", updateActiveButtons);
        editor.addEventListener("mouseup", updateActiveButtons);
    }

    // Filter functionality
    const categoryFilter = document.querySelector('.category-selector');
    if (categoryFilter) {

        categoryFilter.addEventListener('change', applyFilters);
    }
});