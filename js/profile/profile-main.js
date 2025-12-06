// ============================================
// PROFILE PAGE MAIN INITIALIZATION
// ============================================
/*uncomment
import { InlineEditor, makeEntryEditable } from './profile-editor.js';
import {
    showAddEducationModal,
    showAddLicenseModal,
    showAddAnnouncementModal,
    attachAnnouncementHandlers,
    handleBannerUpload,
    handleProfilePhotoUpload
} from './profile-sections.js';
import { showNotification } from './profile-utils.js';
import { initializeTheme } from './profile-theme.js';
import { initializeKeyboardNavigation } from './profile-keyboard.js';
*/
// Global editor instance
const editor = new InlineEditor();

/**
 * Initialize education section handlers
 */
function initializeEducationSection() {
    const educationSection = document.querySelector('.education-section');
    if (!educationSection) return;

    const addIcon = educationSection.querySelector('.fa-plus');
    const editIcon = educationSection.querySelector('.fa-pencil-alt');

    if (addIcon) {
        addIcon.addEventListener('click', showAddEducationModal);
    }

    if (editIcon) {
        editIcon.addEventListener('click', () => {
            showNotification('Կրկնակի սեղմեք տարրի վրա՝ խմբագրելու համար');
        });
    }

    // Make existing entries editable
    const entries = educationSection.querySelectorAll('.item-entry');
    entries.forEach(entry => makeEntryEditable(entry));
}

/**
 * Initialize licenses section handlers
 */
function initializeLicensesSection() {
    const licensesSection = document.querySelector('.licenses-section');
    if (!licensesSection) return;

    const addIcon = licensesSection.querySelector('.fa-plus');
    const editIcon = licensesSection.querySelector('.fa-pencil-alt');

    if (addIcon) {
        addIcon.style.cursor = 'pointer';
        addIcon.addEventListener('click', showAddLicenseModal);
    }

    if (editIcon) {
        editIcon.style.cursor = 'pointer';
        editIcon.addEventListener('click', () => {
            showNotification('Կրկնակի սեղմեք տարրի վրա՝ խմբագրելու համար');
        });
    }

    // Make existing entries editable
    const entries = licensesSection.querySelectorAll('.item-entry');
    entries.forEach(entry => makeEntryEditable(entry));
}

/**
 * Initialize announcements section handlers
 */
function initializeAnnouncementsSection() {
    const announcementsSection = document.querySelector('.announcements-section');
    if (!announcementsSection) return;

    const addIcon = announcementsSection.querySelector('.fa-plus');

    if (addIcon) {
        addIcon.style.cursor = 'pointer';
        addIcon.addEventListener('click', showAddAnnouncementModal);
    }

    // Attach handlers to existing announcements
    const entries = announcementsSection.querySelectorAll('.item-entry');
    entries.forEach(entry => attachAnnouncementHandlers(entry));
}

/**
 * Initialize profile editing buttons
 */
function initializeProfileButtons() {
    // "Ավելացնել բաժին" button
    const addSectionBtn = document.querySelector('.primary-btn');
    if (addSectionBtn && addSectionBtn.textContent.includes('Ավելացնել')) {
        addSectionBtn._addHandler = () => showNotification('Ավելացնել բաժին ֆունկցիոնալությունը դեռ մշակման փուլում է։');
        addSectionBtn.addEventListener('click', addSectionBtn._addHandler);
    }

    // "Փոփոխել" button in intro card
    const editProfileBtn = document.querySelector('.secondary-btn');
    if (editProfileBtn && editProfileBtn.textContent.includes('Փոփոխել')) {
        editProfileBtn._editHandler = () => editor.startEditing();
        editProfileBtn.addEventListener('click', editProfileBtn._editHandler);
    }
}

/**
 * Initialize photo upload handlers
 */
function initializePhotoUploads() {
    // Banner edit icon
    const bannerEditIcon = document.querySelector('.banner-edit-icon');
    if (bannerEditIcon) {
        bannerEditIcon.addEventListener('click', handleBannerUpload);
    }

    // Profile photo click
    const profilePhoto = document.querySelector('.profile-photo');
    if (profilePhoto) {
        profilePhoto.style.cursor = 'pointer';
        profilePhoto.addEventListener('click', handleProfilePhotoUpload);
    }
}

/**
 * Main initialization function
 */
function initializeProfile() {
    // Initialize theme
    initializeTheme();

    // Initialize keyboard navigation
    initializeKeyboardNavigation();

    // Initialize all sections
    initializeEducationSection();
    initializeLicensesSection();
    initializeAnnouncementsSection();

    // Initialize buttons
    initializeProfileButtons();

    // Initialize photo uploads
    initializePhotoUploads();

    console.log('Profile interactive editing initialized');
    console.log('Keyboard shortcuts: Ctrl+S (Save), Ctrl+E (Edit), Ctrl+N (New), Esc (Cancel)');
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeProfile);
