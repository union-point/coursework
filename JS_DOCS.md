# JavaScript Documentation

This document provides comprehensive documentation for the JavaScript codebase of the PolyLink platform. It explains the architecture, key modules, design patterns, and how different parts of the application work together.

## 📚 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Module System](#module-system)
3. [API Layer](#api-layer)
4. [Profile Module](#profile-module)
5. [Authentication Flow](#authentication-flow)
6. [Common Patterns](#common-patterns)

---

## Architecture Overview

The JavaScript codebase follows a **modular architecture** with clear separation of concerns:

```
┌─────────────────────────────────────────┐
│         HTML Pages (UI Layer)           │
├─────────────────────────────────────────┤
│      Page-Specific JS Modules           │
│  (login.js, register.js, posts.js, etc) │
├─────────────────────────────────────────┤
│         Feature Modules                  │
│      (profile/, core/, etc)              │
├─────────────────────────────────────────┤
│          API Layer (api/)                │
│  (Axios-based HTTP communication)        │
├─────────────────────────────────────────┤
│         Backend REST API                 │
│      (http://localhost:3004)             │
└─────────────────────────────────────────┘
```

### Key Principles

1. **Separation of Concerns** - Each module has a specific responsibility
2. **DRY (Don't Repeat Yourself)** - Common functionality is abstracted into utilities
3. **API Abstraction** - All backend communication goes through the API layer


---

## Module System

### Global Scripts (Old-School, No ES Modules)

The codebase uses  **does not use ES6 modules** (`import` / `export`).  
Instead, all JavaScript files are included through regular `<script>` tags, and their functions are exposed to the **global scope**.


```javascript
// auth-api.js
async function login(email, password) { ... }
function getUser() { ... }
function logout() { ... }

// Expose functions globally
window.login = login;
window.getUser = getUser;
window.logout = logout;
```

### Module Categories

#### 1. **Page Modules** (`/js/*.js`)
Individual JavaScript files that handle page-specific functionality:
- `login.js` - Login page logic
- `register.js` - Registration form handling
- `posts.js` - Events/posts management
- `forum.js` - Forum functionality
- `settings.js` - Settings page logic

#### 2. **API Modules** (`/js/api/*.js`)
Handle all backend communication:
- `axios.js` - Configured Axios instance
- `auth-api.js` - Authentication endpoints
- `profile-api.js` - Profile management
- `posts-api.js` - Posts/events endpoints
- `forum-api.js` - Forum endpoints
- `search-api.js` - Search functionality
- `user-api.js` - User management

#### 3. **Core Modules** (`/js/core/*.js`)
Shared utilities and core functionality:
- `auth.js` - Authentication state management
- `guard.js` - Route protection
- `storage.js` - LocalStorage abstraction

#### 4. **Feature Modules** (`/js/profile/*.js`)
Complex features broken into sub-modules:
- Profile management (modular architecture)

---

## API Layer

### Axios Configuration (`/js/api/axios.js`)

The API layer is built on **Axios** with custom configuration:

```javascript
const API_URL = 'http://localhost:3004';

const api = axios.create({
    baseURL: API_URL,
    withCredentials: true,  // Send cookies with requests
});
```

#### Request Interceptor

Automatically adds JWT tokens to requests:

```javascript
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});
```

**How it works:**
1. Before each request, check localStorage for `accessToken`
2. If found, add it to the `Authorization` header
3. Backend validates the token

#### Response Interceptor

Handles token refresh automatically:

```javascript
api.interceptors.response.use(
    (res) => res,  // Success - pass through
    async (error) => {
        if (error.response.status === 401) {
            // Token expired, try to refresh
            try {
                const refreshRes = await axios.post(
                    API_URL + "/auth/refresh",
                    {},
                    { withCredentials: true }
                );
                const newToken = refreshRes.data.accessToken;
                localStorage.setItem("accessToken", newToken);
                
                // Retry original request with new token
                error.config.headers.Authorization = `Bearer ${newToken}`;
                return api(error.config);
            } catch {
                // Refresh failed - redirect to login
                localStorage.removeItem("accessToken");
                window.location.href = "/login.html";
            }
        }
        throw error;
    }
);
```

**How it works:**
1. If any request returns 401 (Unauthorized)
2. Attempt to refresh the token using the refresh endpoint
3. If successful, retry the original request
4. If refresh fails, clear tokens and redirect to login


---


## Profile Module

The profile module demonstrates **modular architecture**, breaking a complex feature into manageable sub-modules.

### Module Structure

```
/js/profile/
├── profile-main.js         # Main initialization
├── profile-sections.js     # Section management (education, licenses, announcements)
├── profile-editor.js       # Inline editing functionality
├── profile-modal.js        # Modal creation and management
├── profile-theme.js        # Theme switching
├── profile-utils.js        # Utility functions
├── profile-validation.js   # Form validation
└── profile-keyboard.js     # Keyboard shortcuts
```

### Main Initialization (`profile-main.js`)

Entry point that orchestrates all profile functionality:

```javascript
// Global editor instance
const editor = new InlineEditor();

// Initialize education section
function initializeEducationSection() {
    const educationSection = document.querySelector('.education-section');
    if (!educationSection) return;

    // Add button handler
    const addIcon = educationSection.querySelector('.fa-plus');
    if (addIcon) {
        addIcon.addEventListener('click', showAddEducationModal);
    }

    // Make existing entries editable
    const entries = educationSection.querySelectorAll('.item-entry');
    entries.forEach(entry => {
        const data = extractDataFromEntry(entry);
        attachEducationHandlers(entry, data);
    });
}

// Main initialization
function initializeProfile() {
    initializeTheme();
    initializeKeyboardNavigation();
    initializeEducationSection();
    initializeLicensesSection();
    initializeAnnouncementsSection();
    initializeProfileButtons();
    initializePhotoUploads();
}

// Run on page load
document.addEventListener('DOMContentLoaded', initializeProfile);
```

**Key Concepts:**
- **Initialization Pattern** - Each section has its own init function
- **Event Delegation** - Attach handlers to dynamically created elements
- **Data Extraction** - Parse existing HTML to get data for editing

### Section Management (`profile-sections.js`)

Handles CRUD operations for profile sections:

#### Education Section

```javascript
// Show modal to add education
function showAddEducationModal() {
    const form = createEducationForm();
    
    modal.create('Ավելացնել կրթություն', form, async (data) => {
        if (!validateForm(form)) {
            showNotification('Խնդրում ենք լրացնել բոլոր պարտադիր դաշտերը');
            return;
        }

        try {
            const response = await createEducation(data);
            if (response.data.success) {
                addEducationEntry(data);
                showNotification('Կրթությունը ավելացվել է');
            }
        } catch (error) {
            showNotification('Սխալ՝ կրթությունը չի ավելացվել');
        }
    });
}

// Add education entry to DOM
function addEducationEntry(data) {
    const educationSection = document.querySelector('.education-section');
    const newEntry = document.createElement('div');
    newEntry.className = 'item-entry';
    newEntry.innerHTML = `
        <div class="item-logo">...</div>
        <div class="item-details">
            <p class="item-title">${data.institution}</p>
            <p class="item-subtitle">${data.degree}</p>
            <p class="item-date">${formatDateRange(data.startDate, data.endDate)}</p>
        </div>
        <div class="edit-icons">
            <i class="fas fa-pencil-alt edit-icon"></i>
        </div>
    `;
    educationSection.appendChild(newEntry);
    attachEducationHandlers(newEntry, data);
}

// Edit education entry
function editEducation(entry, currentData) {
    const form = createEducationForm(currentData);
    
    modal.create('Փոփոխել կրթությունը', form, (data) => {
        updateEntryInDOM(entry, data);
        showNotification('Կրթությունը թարմացվել է');
    });
}

// Delete education entry
function deleteEducation(entry) {
    customConfirm("Վստա՞հ եք, որ ցանկանում եք հեռացնել այս կրթությունը։")
        .then(answer => {
            if (answer) {
                entry.remove();
                showNotification('Կրթությունը հեռացվել է');
            }
        });
}

// Attach event handlers
function attachEducationHandlers(entry, data) {
    const editIcon = entry.querySelector('.fa-pencil-alt');
    if (editIcon) {
        editIcon.addEventListener('click', () => editEducation(entry, data));
    }
}
```

**Pattern Explanation:**
1. **Modal-Based Editing** - All add/edit operations use modals
2. **Data Flow** - Form → Validation → API → DOM Update
3. **Event Handlers** - Attached after DOM creation
4. **Confirmation Dialogs** - For destructive operations

#### Announcements with Comments

```javascript
// Toggle comments section
async function toggleComments(announcementCard, btnComments) {
    let commentsContainer = announcementCard.querySelector('.comments-container');

    if (!commentsContainer) {
        commentsContainer = await createCommentsContainer(announcementCard, btnComments);
        announcementCard.appendChild(commentsContainer);
    } else {
        commentsContainer.style.display = 
            commentsContainer.style.display === 'none' ? 'block' : 'none';
    }
}

// Create comments container
async function createCommentsContainer(announcementCard, btnComments) {
    const commentsContainer = document.createElement('div');
    const commentsList = document.createElement('div');

    // Load comments from backend
    try {
        const postId = announcementCard.dataset.postId;
        const response = await getComments(postId);
        
        if (response.data && response.data.length > 0) {
            response.data.forEach(comment => {
                const commentEl = createCommentElement(comment);
                commentsList.appendChild(commentEl);
            });
            btnComments.textContent = `Մեկնաբանություններ (${response.data.length})`;
        } else {
            commentsList.innerHTML = '<p>Մեկնաբանություններ դեռ չկան</p>';
        }
    } catch (error) {
        commentsList.innerHTML = '<p>Սխալ՝ մեկնաբանությունները չհաջողվեց բեռնել</p>';
    }

    const commentForm = createCommentForm(announcementCard, commentsList, btnComments);
    commentsContainer.appendChild(commentsList);
    commentsContainer.appendChild(commentForm);

    return commentsContainer;
}

// Create individual comment element
function createCommentElement(comment) {
    const commentEl = document.createElement('div');
    const timeAgo = formatTimeAgo(comment.createdAt);
    
    commentEl.innerHTML = `
        <div class="comment-header">
            <img src="${comment.author?.avatar}" />
            <span>${comment.author?.name}</span>
            <span>${timeAgo}</span>
        </div>
        <p>${comment.text}</p>
    `;
    
    return commentEl;
}
```

**Key Features:**
- **Lazy Loading** - Comments loaded only when requested
- **Dynamic Creation** - Comments container created on-demand
- **Real-time Updates** - Comment count updates after posting

### Modal System (`profile-modal.js`)

Reusable modal component:

```javascript
class Modal {
    create(title, contentElement, onSave, options = {}) {
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';
        
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-header">
                <h2>${title}</h2>
                <button class="modal-close">&times;</button>
            </div>
            <div class="modal-body"></div>
            <div class="modal-footer">
                <button class="btn-cancel">Չեղարկել</button>
                <button class="btn-save">Պահպանել</button>
            </div>
        `;
        
        modal.querySelector('.modal-body').appendChild(contentElement);
        overlay.appendChild(modal);
        document.body.appendChild(overlay);
        
        // Event handlers
        modal.querySelector('.modal-close').addEventListener('click', () => this.close());
        modal.querySelector('.btn-cancel').addEventListener('click', () => this.close());
        modal.querySelector('.btn-save').addEventListener('click', () => {
            const data = this.extractFormData(contentElement);
            onSave(data);
            this.close();
        });
    }
    
    extractFormData(form) {
        const data = {};
        const inputs = form.querySelectorAll('input, select, textarea, [contenteditable]');
        inputs.forEach(input => {
            const name = input.name || input.id;
            data[name] = input.value || input.textContent;
        });
        return data;
    }
    
    close() {
        const overlay = document.querySelector('.modal-overlay');
        if (overlay) overlay.remove();
    }
}
```

**Usage:**
```javascript
const modal = new Modal();
const form = createMyForm();

modal.create('My Title', form, (data) => {
    console.log('Form data:', data);
    // Handle save
});
```

### Utility Functions (`profile-utils.js`)

Common helper functions:

```javascript
// Format date
export function formatDate(dateString) {
    if (!dateString) return 'Ներկա';
    const date = new Date(dateString);
    return date.toLocaleDateString('hy-AM', { year: 'numeric', month: 'long' });
}

// Format date range
export function formatDateRange(startDate, endDate) {
    const start = formatDate(startDate);
    const end = endDate ? formatDate(endDate) : 'Ներկա';
    return `${start} - ${end}`;
}

// Format time ago
export function formatTimeAgo(timestamp) {
    const now = new Date();
    const past = new Date(timestamp);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'հենց նոր';
    if (diffMins < 60) return `${diffMins} րոպե առաջ`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} ժամ առաջ`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays} օր առաջ`;
}

// Show notification
export function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.remove(), 3000);
}

// Custom confirm dialog
export function customConfirm(message) {
    return new Promise((resolve) => {
        const overlay = document.createElement('div');
        overlay.className = 'confirm-overlay';
        overlay.innerHTML = `
            <div class="confirm-dialog">
                <p>${message}</p>
                <div class="confirm-buttons">
                    <button class="btn-no">Ոչ</button>
                    <button class="btn-yes">Այո</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        
        overlay.querySelector('.btn-yes').addEventListener('click', () => {
            overlay.remove();
            resolve(true);
        });
        
        overlay.querySelector('.btn-no').addEventListener('click', () => {
            overlay.remove();
            resolve(false);
        });
    });
}
```

### Form Validation (`profile-validation.js`)

Client-side validation:

```javascript
// Validate entire form
export function validateForm(form) {
    const requiredFields = form.querySelectorAll('[required], [data-required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value || field.value.trim() === '') {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    return isValid;
}

// Initialize real-time validation
export function initializeValidation(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            if (input.hasAttribute('required') || input.hasAttribute('data-required')) {
                if (input.value && input.value.trim() !== '') {
                    input.classList.remove('error');
                }
            }
        });
        
        input.addEventListener('blur', () => {
            if (input.hasAttribute('required') || input.hasAttribute('data-required')) {
                if (!input.value || input.value.trim() === '') {
                    input.classList.add('error');
                }
            }
        });
    });
}
```

### Theme Management (`profile-theme.js`)

Dark/light mode switching:

```javascript
export function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);
}

export function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
    } else {
        document.body.classList.remove('theme-dark');
    }
    localStorage.setItem('theme', theme);
}

export function toggleTheme() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
}
```

### Keyboard Shortcuts (`profile-keyboard.js`)

Global keyboard navigation:

```javascript
export function initializeKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        // Ctrl+S - Save
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            const saveBtn = document.querySelector('.btn-save');
            if (saveBtn) saveBtn.click();
        }
        
        // Ctrl+E - Edit
        if (e.ctrlKey && e.key === 'e') {
            e.preventDefault();
            const editBtn = document.querySelector('.secondary-btn');
            if (editBtn) editBtn.click();
        }
        
        // Escape - Cancel/Close
        if (e.key === 'Escape') {
            const modal = document.querySelector('.modal-overlay');
            if (modal) modal.remove();
        }
    });
}
```

---

## Authentication Flow

### Registration Flow

```
User fills form → Validation → API call → Success → Redirect to profile setup
```

**Code (`register.js`):**
```javascript
document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
    };
    
    // Client-side validation
    if (!validateEmail(formData.email)) {
        showError('Invalid email');
        return;
    }
    
    if (formData.password.length < 8) {
        showError('Password must be at least 8 characters');
        return;
    }
    
    try {
        await registerUser(formData);
        window.location.href = 'profile_info.html';
    } catch (error) {
        showError(error.response?.data?.message || 'Registration failed');
    }
});
```

### Login Flow

```
User enters credentials → Validation → API call → Store token → Check 2FA → Redirect
```

**Code (`login.js`):**
```javascript
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    // Validation
    if (!validateEmail(email)) {
        showError('Invalid email');
        return;
    }
    
    try {
        await login(email, password);  // Stores token in localStorage
        
        const is2FAEnabled = localStorage.getItem('is2FAEnabled') === 'true';
        if (is2FAEnabled) {
            window.location.href = "2fa-verify.html";
        } else {
            window.location.href = "profile.html";
        }
    } catch (error) {
        showError('Invalid credentials');
    }
});
```

### Password Reset Flow

```
1. Forgot Password Page → Enter email → API sends code
2. Verify Code Page → Enter code → Validate
3. Reset Password Page → Enter new password → Update
```

**Code (`forgot.js`):**
```javascript
document.getElementById('forgot-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    
    try {
        await forgotPassword(email);
        localStorage.setItem('resetEmail', email);
        window.location.href = 'verify-code.html';
    } catch (error) {
        showError('Failed to send reset code');
    }
});
```

**Code (`verify-code.js`):**
```javascript
document.getElementById('verify-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = localStorage.getItem('resetEmail');
    const code = document.getElementById('code').value;
    
    try {
        await verifyCode(email, code);
        localStorage.setItem('resetCode', code);
        window.location.href = 'reset-password.html';
    } catch (error) {
        showError('Invalid code');
    }
});
```

**Code (`password-reset.js`):**
```javascript
document.getElementById('reset-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = localStorage.getItem('resetEmail');
    const code = localStorage.getItem('resetCode');
    const newPassword = document.getElementById('password').value;
    
    try {
        await resetPassword(email, code, newPassword);
        localStorage.removeItem('resetEmail');
        localStorage.removeItem('resetCode');
        window.location.href = 'login.html';
    } catch (error) {
        showError('Failed to reset password');
    }
});
```

---

## Common Patterns

### 1. Event Listener Pattern

```javascript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize page
    initializePage();
    
    // Attach event listeners
    document.getElementById('myButton').addEventListener('click', handleClick);
});

function handleClick(event) {
    event.preventDefault();
    // Handle click
}
```

### 2. Async/Await Pattern

```javascript
async function loadData() {
    try {
        const response = await api.get('/data');
        displayData(response.data);
    } catch (error) {
        console.error('Error loading data:', error);
        showError('Failed to load data');
    }
}
```

### 3. Form Handling Pattern

```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();  // Prevent default form submission
    
    // Collect form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    
    // Validate
    if (!validate(data)) {
        showError('Validation failed');
        return;
    }
    
    // Submit to API
    try {
        await submitData(data);
        showSuccess('Saved successfully');
    } catch (error) {
        showError('Failed to save');
    }
});
```

### 4. Dynamic DOM Creation Pattern

```javascript
function createCard(data) {
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <button class="btn-action">Action</button>
    `;
    
    // Attach event handlers
    card.querySelector('.btn-action').addEventListener('click', () => {
        handleAction(data.id);
    });
    
    return card;
}

// Usage
const container = document.getElementById('cards-container');
data.forEach(item => {
    const card = createCard(item);
    container.appendChild(card);
});
```

### 5. Toggle Pattern

```javascript
function toggleElement(element) {
    if (element.style.display === 'none') {
        element.style.display = 'block';
    } else {
        element.style.display = 'none';
    }
}

// Or using classList
function toggleClass(element, className) {
    element.classList.toggle(className);
}
```

### 6. Debounce Pattern (for search)

```javascript
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

// Usage
const searchInput = document.getElementById('search');
const debouncedSearch = debounce(performSearch, 300);

searchInput.addEventListener('input', (e) => {
    debouncedSearch(e.target.value);
});
```

---

## Key Functions Reference

### Authentication

| Function | Location | Description |
|----------|----------|-------------|
| `login(email, password)` | `api/auth-api.js` | Authenticate user and store token |
| `registerUser(data)` | `api/auth-api.js` | Register new user |
| `logout()` | `api/auth-api.js` | Clear tokens and logout |
| `forgotPassword(email)` | `api/auth-api.js` | Initiate password reset |
| `verifyCode(email, code)` | `api/auth-api.js` | Verify reset code |
| `resetPassword(email, code, newPassword)` | `api/auth-api.js` | Reset password |
| `loadUser()` | `core/auth.js` | Load current user data |
| `getUser()` | `core/auth.js` | Get cached user data |
| `requireAuth()` | `core/guard.js` | Protect authenticated routes |

### Profile Management

| Function | Location | Description |
|----------|----------|-------------|
| `showAddEducationModal()` | `profile/profile-sections.js` | Show education add modal |
| `addEducationEntry(data)` | `profile/profile-sections.js` | Add education to DOM |
| `editEducation(entry, data)` | `profile/profile-sections.js` | Edit education entry |
| `deleteEducation(entry)` | `profile/profile-sections.js` | Delete education entry |
| `showAddLicenseModal()` | `profile/profile-sections.js` | Show license add modal |
| `showAddAnnouncementModal()` | `profile/profile-sections.js` | Show announcement add modal |
| `toggleComments(card, btn)` | `profile/profile-sections.js` | Toggle comments section |
| `createCommentElement(comment)` | `profile/profile-sections.js` | Create comment DOM element |

### Utilities

| Function | Location | Description |
|----------|----------|-------------|
| `formatDate(dateString)` | `profile/profile-utils.js` | Format date for display |
| `formatDateRange(start, end)` | `profile/profile-utils.js` | Format date range |
| `formatTimeAgo(timestamp)` | `profile/profile-utils.js` | Format relative time |
| `showNotification(message, type)` | `profile/profile-utils.js` | Show toast notification |
| `customConfirm(message)` | `profile/profile-utils.js` | Show confirmation dialog |
| `validateForm(form)` | `profile/profile-validation.js` | Validate form inputs |
| `initializeValidation(form)` | `profile/profile-validation.js` | Setup real-time validation |
| `applyTheme(theme)` | `profile/profile-theme.js` | Apply light/dark theme |
| `toggleTheme()` | `profile/profile-theme.js` | Toggle between themes |

### Modal System

| Function | Location | Description |
|----------|----------|-------------|
| `modal.create(title, content, onSave, options)` | `profile/profile-modal.js` | Create and show modal |
| `modal.close()` | `profile/profile-modal.js` | Close active modal |
| `modal.extractFormData(form)` | `profile/profile-modal.js` | Extract data from form |
| `createFormattingToolbar()` | `profile/profile-modal.js` | Create rich text toolbar |
| `setupFormattingHandlers(modal)` | `profile/profile-modal.js` | Setup formatting buttons |

---

## Best Practices

### 1. **Always Use Try-Catch for API Calls**

```javascript
try {
    const response = await api.get('/data');
    handleSuccess(response.data);
} catch (error) {
    console.error('API Error:', error);
    handleError(error);
}
```

### 2. **Validate User Input**

```javascript
// Client-side validation
if (!email || !validateEmail(email)) {
    showError('Invalid email');
    return;
}

// Server will also validate
```

### 3. **Use Event Delegation for Dynamic Content**

```javascript
// Instead of attaching to each button
container.addEventListener('click', (e) => {
    if (e.target.matches('.btn-delete')) {
        handleDelete(e.target.closest('.item'));
    }
});
```

