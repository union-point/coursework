/**
 * Initialize profile buttons
 */
function initializeProfileButtons() {
    const profileButton = document.querySelector('.primary-btn');
    if (profileButton) {
        profileButton.addEventListener('click', () => {
            localStorage.setItem('name', name); // ! remove after testing
            console.log(name);
            window.location.href = 'message.html';
        });
    }
}
// Load and display posts
async function loadPosts() {
    try {
        const response = await getUserPosts();
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

    } catch (error) {
        console.error('Error loading posts:', error);
        const announcementsList = document.querySelector('.announcements-list');
        if (announcementsList) {
            announcementsList.innerHTML = '<p style="text-align: center; padding: 2rem; color: var(--error-color);">Սխալ՝ հայտարարությունները բեռնելիս</p>';
        }
    }
}

/**
 * Initialize announcements section handlers
 */
async function initializeAnnouncementsSection() {
    // Load posts

    await loadPosts()
    const announcementsSection = document.querySelector('.announcements-list');
    // Attach handlers to existing announcements
    const entries = announcementsSection.querySelectorAll('.item-entry');
    entries.forEach(entry => attachAnnouncementHandlers(entry));
}


/**
 * Attach event handlers to announcement buttons
 * @param {HTMLElement} entry - Announcement entry element
 */
function attachAnnouncementHandlers(entry) {

    const commentsBtn = entry.querySelector('.btn-comments');
    const announcementCard = entry.querySelector('.announcement-card');

    if (commentsBtn) {
        commentsBtn.addEventListener('click', () => toggleComments(announcementCard, commentsBtn));
    }
}
/**
 * Toggle comments section for an announcement
 * @param {HTMLElement} announcementCard - Announcement card element
 * @param {HTMLElement} btnComments - Comments button element
 */
async function toggleComments(announcementCard, btnComments) {
    let commentsContainer = announcementCard.querySelector('.comments-container');
    if (!commentsContainer) {
        commentsContainer = await createCommentsContainer(announcementCard, btnComments);
        announcementCard.appendChild(commentsContainer);
    } else {
        if (commentsContainer.style.display === 'none') {
            commentsContainer.style.display = 'block';
        } else {
            commentsContainer.style.display = 'none';
        }
    }
}

/**
 * Initialize profile
 */
async function initializeUserProfile() {
    try {
        // Load user profile
        const response = await getUserProfile();
        const profile = response;
        const profileSection = document.querySelector('.main-content');
        const fullname = profileSection.querySelector('.fullname');
        name = profile.name;
        fullname.textContent = profile.name;
        const jobTitle = profileSection.querySelector('.job-title');
        jobTitle.textContent = profile.jobTitle;
        const description = profileSection.querySelector('.desc');
        description.textContent = profile.description;
        const banner = document.querySelector('.banner-photo');
        banner.style.backgroundPosition = "center -150px";
        banner.style.backgroundImage = `url('${profile.cover}')`;

        const avatar = document.querySelector('.profile-photo');
        avatar.innerHTML = `<img class="profile-photo" src="${profile.avatar}"
            alt="Profile">
`

        const educationList = profileSection.querySelector('.education-list');
        if (profile.education && profile.education.length > 0) {
            profile.education.forEach(education => {
                educationList.innerHTML += `
            <div class="item-entry" >
                <div class="item-logo">
                <img src="${education.logo}" class="entry-logo">
                </div>
                <div class="item-details">
                <p class="item-title">${education.institution}</p>
                <p class="item-subtitle">${education.degree}</p>
                <p class="item-date">${formatDateRange(education.startDate, education.endDate)}</p>
                </div>
                </div >
            `;
            });
        }


        const licensesList = profileSection.querySelector('.licenses-list');
        if (profile.licenses && profile.licenses.length > 0) {
            profile.licenses.forEach(license => {
                licensesList.innerHTML += `
            <div class="item-entry" >
                <div class="item-logo cert-logo-bg">
                ${license.logo ? `<img src="${license.logo}" class="entry-logo">` : `<i class="fas fa-laptop-code cert-icon"></i>`}
                </div>
                <div class="item-details">
                <p class="item-title">${license.title}</p>
                <p class="item-subtitle">${license.issuer}</p>
                <p class="item-date">Տրման ամսաթիվ՝ ${formatDate(license.date)}</p>
                ${license.credential ? `                <button class="show-cred-btn">
                  Ցուցադրել հավաստագիրը <i class="fas fa-external-link-alt"></i>
                </button>` : ''}
                </div>
                </div >
            `;
            });
        }
    } catch (error) {
        console.error('Error loading profile:', error);
    }
}
/**
 * Main initialization function
 */
function initializeProfile() {
    // Initialize theme
    initializeTheme();
    // Initialize profile
    initializeUserProfile();
    // Initialize buttons
    const name = null;
    initializeProfileButtons(name);
    // Initialize announcements section
    initializeAnnouncementsSection();
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeProfile);
