

// Render a single post
function renderPost(post) {

    return `
       
                    
                  <div class="item-entry">
              <div class="announcement-card" data-post-id="2">
                <div class="announcement-content">
                  <p>
                    <strong>${post.title}</strong>
                    ${post.content}
                  </p>
                </div>

                <div class="comments-section">
                  <button class="btn-comments">
                    Մեկնաբանություններ (0)
                  </button>
                </div>
              </div>
            </div>
    `;
}


/**
 * Create a comment element from comment data
 * @param {Object} comment - Comment data from backend
 * @returns {HTMLElement} Comment element
 */
function createCommentElement(comment) {
    const commentEl = document.createElement('div');
    commentEl.className = 'comment';
    commentEl.style.marginBottom = '12px';

    // Format timestamp
    const timeAgo = formatTimeAgo(comment.createdAt);

    commentEl.innerHTML = `
    <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 4px;">
      <div style="width: 32px; height: 32px; background: var(--border-color); border-radius: 50%; background-image: url('${comment.author?.avatar || ''}'); background-size: cover; background-position: center;"></div>
      <span style="font-weight: 600; font-size: 14px; color: var(--font-color-primary);">${comment.author?.name || 'Անանուն'}</span>
      <span style="font-size: 12px; color: var(--font-color-secondary);">${timeAgo}</span>
    </div>
    <p style="font-size: 14px; margin: 0; padding-left: 32px; color: var(--font-color-primary);">${comment.text}</p>
  `;

    return commentEl;
}

/**
 * Create comments container
 * @param {HTMLElement} announcementCard - Announcement card element
 * @param {HTMLElement} btnComments - Comments button element
 * @returns {HTMLElement} Comments container
 */
async function createCommentsContainer(announcementCard, btnComments) {
    const commentsContainer = document.createElement('div');
    commentsContainer.className = 'comments-container';
    commentsContainer.style.cssText = `
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
    animation: fadeIn 0.3s ease;
  `;

    // Comments list container
    const commentsList = document.createElement('div');
    commentsList.className = 'comments-list';
    //load if there is at least one comment

    // Load comments from backend
    try {
        const postId = announcementCard.dataset.postId;
        const response = await getComments(postId);
        const commentsCount = parseInt(btnComments.textContent.match(/\((\d+)\)/)[1]);
        if (response.data && response.data.length > 0 && commentsCount > 0) {
            // Render each comment
            response.data.forEach(comment => {
                const commentEl = createCommentElement(comment);
                commentsList.appendChild(commentEl);
            });

            // Update comment count
            btnComments.textContent = `Մեկնաբանություններ (${response.data.length})`;
        } else {
            // No comments yet
            commentsList.innerHTML = `
        <p style="font-size: 14px; color: var(--font-color-secondary); text-align: center; padding: 16px;">
          Մեկնաբանություններ դեռ չկան
        </p>
      `;
        }
    } catch (error) {
        console.error('Error loading comments:', error);
        commentsList.innerHTML = `
      <p style="font-size: 14px; color: var(--font-color-secondary); text-align: center; padding: 16px;">
        Սխալ՝ մեկնաբանությունները չհաջողվեց բեռնել
      </p>
    `;
    }


    // Add comment form
    const commentForm = createCommentForm(announcementCard, commentsList, btnComments);

    commentsContainer.appendChild(commentsList);
    commentsContainer.appendChild(commentForm);

    return commentsContainer;
}
/**
 * Create comment form
 * @param {HTMLElement} announcementCard - Announcement card element
 * @param {HTMLElement} commentsList - Comments list element
 * @param {HTMLElement} btnComments - Comments button element
 * @returns {HTMLElement} Comment form
 */
function createCommentForm(announcementCard, commentsList, btnComments) {
    const commentForm = document.createElement('div');
    commentForm.style.cssText = `
    display: flex;
    gap: 8px;
    margin-top: 16px;
  `;
    commentForm.innerHTML = `
    <input type="text" placeholder="Գրել մեկնաբանություն..." 
      style="flex: 1; padding: 8px 12px; border-radius: 12px; font-size: 14px; background: var(--card-background); color: var(--font-color-primary);">
    <button class = "primary-btn" style="  color: white; border: none; padding: 8px 16px; border-radius: 20px; cursor: pointer;">
      <i class="fas fa-paper-plane"></i>
    </button>
  `;

    // Handle new comment
    const input = commentForm.querySelector('input');
    const sendBtn = commentForm.querySelector('button');

    const addComment = async () => {
        const text = input.value.trim();
        if (!text) return;

        try {
            const postId = announcementCard.dataset.postId;
            const response = await createComment(postId, { text });
            if (response.data.success) {
                // Clear "no comments yet" message if it exists
                const noCommentsMsg = commentsList.querySelector('p');
                if (noCommentsMsg && noCommentsMsg.textContent.includes('Մեկնաբանություններ դեռ չկան')) {
                    commentsList.innerHTML = '';
                }

                // Use the helper function to create comment element
                const newComment = createCommentElement(response.data.data);
                commentsList.appendChild(newComment);
                input.value = '';

                // Update count
                const currentCount = parseInt(btnComments.textContent.match(/\d+/)[0]);
                btnComments.textContent = `Մեկնաբանություններ (${currentCount + 1})`;
            }
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    sendBtn.addEventListener('click', () => addComment());
    input.onkeypress = (e) => {
        if (e.key === 'Enter') addComment();
    };

    return commentForm;
}