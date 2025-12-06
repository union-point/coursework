// ============================================
// KEYBOARD NAVIGATION MODULE
// ============================================

/**
 * Keyboard shortcuts configuration
 */
const shortcuts = {
    'Escape': handleEscape,
    'Enter': handleEnter,
    'Tab': handleTab,
    's': handleSave,
    'e': handleEdit,
    'n': handleNew
};

let isEditMode = false;
let currentModal = null;

/**
 * Initialize keyboard navigation
 */
function initializeKeyboardNavigation() {
    document.addEventListener('keydown', handleKeyDown);

    // Make interactive elements focusable
    setupFocusableElements();

    // Setup skip links for accessibility
    setupSkipLinks();

    console.log('Keyboard navigation initialized');
}

/**
 * Handle keydown events
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
    const key = e.key;
    const ctrl = e.ctrlKey || e.metaKey;
    const shift = e.shiftKey;

    // Handle Ctrl/Cmd + key shortcuts
    if (ctrl && !shift) {
        const handler = shortcuts[key.toLowerCase()];
        if (handler) {
            e.preventDefault();
            handler(e);
        }
    }

    // Handle standalone keys
    if (!ctrl && !shift) {
        if (key === 'Escape') {
            handleEscape(e);
        } else if (key === 'Tab') {
            handleTab(e);
        }
    }

    // Handle arrow key navigation in lists
    if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(key)) {
        handleArrowKeys(e);
    }
}

/**
 * Handle Escape key
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEscape(e) {
    // Close modal if open
    const modal = document.querySelector('.modal-overlay');
    if (modal) {
        modal.click();
        return;
    }

    // Cancel edit mode if active
    if (isEditMode) {
        const cancelBtn = document.querySelector('.secondary-btn');
        if (cancelBtn && cancelBtn.textContent.includes('Չեղարկել')) {
            cancelBtn.click();
        }
    }
}

/**
 * Handle Enter key
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEnter(e) {
    const target = e.target;

    // If in a modal, trigger save button
    if (target.closest('.modal-container')) {
        const saveBtn = target.closest('.modal-container').querySelector('.primary-btn');
        if (saveBtn && !target.matches('textarea, [contenteditable="true"]')) {
            e.preventDefault();
            saveBtn.click();
        }
    }
}

/**
 * Handle Tab key for better focus management
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleTab(e) {
    const modal = document.querySelector('.modal-container');
    if (modal) {
        trapFocusInModal(e, modal);
    }
}

/**
 * Handle Ctrl+S to save
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleSave(e) {
    const saveBtn = document.querySelector('.primary-btn');
    if (saveBtn && (saveBtn.textContent.includes('Պահպանել') || saveBtn.textContent.includes('Ավելացնել'))) {
        saveBtn.click();
    }
}

/**
 * Handle Ctrl+E to edit
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleEdit(e) {
    const editBtn = document.querySelector('.secondary-btn');
    if (editBtn && editBtn.textContent.includes('Փոփոխել')) {
        editBtn.click();
        isEditMode = true;
    }
}

/**
 * Handle Ctrl+N to add new
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleNew(e) {
    // Focus on the first "add" icon
    const addIcon = document.querySelector('.fa-plus');
    if (addIcon) {
        addIcon.click();
    }
}

/**
 * Handle arrow key navigation
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleArrowKeys(e) {
    const target = e.target;

    // Navigate through section items
    if (target.closest('.item-entry')) {
        navigateSectionItems(e, target);
    }

    // Navigate through buttons
    if (target.matches('button')) {
        navigateButtons(e, target);
    }
}

/**
 * Navigate through section items with arrow keys
 * @param {KeyboardEvent} e - Keyboard event
 * @param {HTMLElement} target - Current target
 */
function navigateSectionItems(e, target) {
    const currentEntry = target.closest('.item-entry');
    const section = currentEntry.closest('.profile-section');
    const entries = Array.from(section.querySelectorAll('.item-entry'));
    const currentIndex = entries.indexOf(currentEntry);

    let nextEntry;
    if (e.key === 'ArrowDown') {
        nextEntry = entries[currentIndex + 1];
    } else if (e.key === 'ArrowUp') {
        nextEntry = entries[currentIndex - 1];
    }

    if (nextEntry) {
        e.preventDefault();
        const focusable = nextEntry.querySelector('button, a, [tabindex="0"]');
        if (focusable) {
            focusable.focus();
        }
    }
}

/**
 * Navigate through buttons with arrow keys
 * @param {KeyboardEvent} e - Keyboard event
 * @param {HTMLElement} target - Current button
 */
function navigateButtons(e, target) {
    const container = target.closest('.action-buttons, .edit-icons, .modal-footer');
    if (!container) return;

    const buttons = Array.from(container.querySelectorAll('button'));
    const currentIndex = buttons.indexOf(target);

    let nextButton;
    if (e.key === 'ArrowRight') {
        nextButton = buttons[currentIndex + 1];
    } else if (e.key === 'ArrowLeft') {
        nextButton = buttons[currentIndex - 1];
    }

    if (nextButton) {
        e.preventDefault();
        nextButton.focus();
    }
}

/**
 * Trap focus within modal
 * @param {KeyboardEvent} e - Keyboard event
 * @param {HTMLElement} modal - Modal element
 */
function trapFocusInModal(e, modal) {
    const focusableElements = modal.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];

    if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
            e.preventDefault();
            lastFocusable.focus();
        }
    } else {
        if (document.activeElement === lastFocusable) {
            e.preventDefault();
            firstFocusable.focus();
        }
    }
}

/**
 * Setup focusable elements with proper attributes
 */
function setupFocusableElements() {
    // Make edit icons focusable
    const editIcons = document.querySelectorAll('.edit-icon');
    editIcons.forEach(icon => {
        icon.setAttribute('tabindex', '0');
        icon.setAttribute('role', 'button');
        icon.setAttribute('aria-label', icon.classList.contains('fa-plus') ? 'Ավելացնել' : 'Փոփոխել');

        // Allow Enter/Space to activate
        icon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                icon.click();
            }
        });
    });

    // Make profile photo focusable
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.setAttribute('tabindex', '0');
        profilePhoto.setAttribute('role', 'button');
        profilePhoto.setAttribute('aria-label', 'Փոխել պրոֆիլի նկարը');

        profilePhoto.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                profilePhoto.click();
            }
        });
    }

    // Make banner edit icon focusable
    const bannerIcon = document.querySelector('.banner-edit-icon');
    if (bannerIcon) {
        bannerIcon.setAttribute('tabindex', '0');
        bannerIcon.setAttribute('role', 'button');
        bannerIcon.setAttribute('aria-label', 'Փոխել բանների նկարը');

        bannerIcon.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                bannerIcon.click();
            }
        });
    }
}

/**
 * Setup skip links for accessibility
 */
function setupSkipLinks() {
    // Create skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Անցնել հիմնական բովանդակությանը';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--primary-blue);
    color: white;
    padding: 8px;
    text-decoration: none;
    z-index: 100;
  `;

    skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
    });

    skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
    });

    document.body.insertBefore(skipLink, document.body.firstChild);

    // Add ID to main content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        mainContent.id = 'main-content';
    }
}

/**
 * Set edit mode state
 * @param {boolean} state - Edit mode state
 */
function setEditMode(state) {
    isEditMode = state;
}

/**
 * Set current modal reference
 * @param {HTMLElement} modal - Modal element
 */
function setCurrentModal(modal) {
    currentModal = modal;
}

/**
 * Show keyboard shortcuts help
 */
function showKeyboardShortcuts() {
    const shortcuts = `
    Keyboard Shortcuts:
    
    Ctrl/Cmd + S - Save changes
    Ctrl/Cmd + E - Edit profile
    Ctrl/Cmd + N - Add new item
    Escape - Cancel/Close
    Tab - Navigate forward
    Shift + Tab - Navigate backward
    Arrow Keys - Navigate items/buttons
    Enter - Activate/Save
    Space - Activate buttons
  `;

    console.log(shortcuts);
}
//uncomment
//export { initializeKeyboardNavigation, setEditMode, setCurrentModal, showKeyboardShortcuts };
