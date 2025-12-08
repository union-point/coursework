# Profile Page JavaScript

## Overview



### File Organization

```
/js/profile/
├── profile-main.js         # Main initialization
├── profile-sections.js     # Section management (education, licenses, announcements)
├── profile-editor.js       # InlineEditor class for content editing
├── profile-modal.js        # Modal creation (modal class)
├── profile-theme.js        # Theme switching (light/dark/auto)
├── profile-utils.js        # Utility functions (date formatting, notifications)
├── profile-validation.js   # Form validation with visual feedback
└── profile-keyboard.js     # Keyboard navigation and shortcuts
```

### Module Descriptions

#### 1. `profile-utils.js`
**Purpose**: Common utility functions used across the application
**Exports**:
- `formatDate(dateString)` - Format dates to Armenian format
- `formatDateRange(start, end)` - Format date ranges
- `showNotification(message)` - Display toast notifications
- `customConfirm(message)` - Show custom confirmation dialogs

#### 2. `profile-editor.js`
**Purpose**: Handle inline content editing functionality
**Exports**:
- `InlineEditor` class - Manages editable content with save/cancel
- `makeEntryEditable(entry)` - Make DOM entries editable on double-click

#### 3. `profile-modal.js`
**Purpose**: Create and manage modal dialogs
**Exports**:
- `Modal` class - Create customizable modal dialogs
- `createFormattingToolbar()` - Create text formatting toolbar
- `setupFormattingHandlers()` - Setup formatting button handlers

#### 4. `profile-sections.js`
**Purpose**: Manage different profile sections (education, licenses, announcements)
**Exports**:
- `showAddEducationModal()` - Add education entries
- `showAddLicenseModal()` - Add license/certificate entries
- `showAddAnnouncementModal()` - Add announcements
- `editAnnouncement()` - Edit existing announcements
- `deleteAnnouncement()` - Delete announcements
- `toggleComments()` - Show/hide comments
- `attachAnnouncementHandlers()` - Attach event handlers
- `handleBannerUpload()` - Upload banner photo
- `handleProfilePhotoUpload()` - Upload profile photo

#### 5. `profile-theme.js`
**Purpose**: Handle theme switching (light/dark/auto)
**Exports**:
- `applyTheme(theme)` - Apply a theme to the document
- `initializeTheme()` - Initialize theme from localStorage

#### 6. `profile-main.js`
**Purpose**: Main entry point and initialization
**Exports**: None (initialization only)


### Module Dependencies
```
profile-main.js
  ├── profile-editor.js
  │   └── profile-utils.js
  ├── profile-sections.js
  │   ├── profile-modal.js
  │   ├── profile-utils.js
  │   └── profile-editor.js
  ├── profile-utils.js
  └── profile-theme.js
```


## Validation Rules
- **Text inputs**: Min/max length, allowed characters (Armenian/English)
- **Email inputs**: Proper email format validation
- **URL inputs**: Valid URL format checking
- **Month inputs**: Date format validation
- **Contenteditable**: Custom min/max length validation

#### Visual Feedback
- **Red borders** (2px, #e74c3c color) on invalid inputs

#### Real-time Validation
- Validates on blur (when user leaves field)
- Clears errors on focus
- Debounced validation on input (500ms delay)
- Form-level validation before submission


### Usage Example
```javascript
// In modal creation
modal.create('Title', form, async (data) => {
  if (!validateForm(form)) {
    showNotification('Please fill all required fields');
    return;
  }
  // Process form data...
});

// Initialize validation
setTimeout(() => {
  initializeValidation(form);
}, 100);
```

### Required Field Indicators
- Red asterisk (*) added to required field labels
- `required` and `data-required` attributes on inputs
- Visual consistency across all forms

---

## Keyboard Navigation (`profile-keyboard.js`)

### Keyboard Shortcuts

#### Global Shortcuts
- **Ctrl/Cmd + S** - Save changes
- **Ctrl/Cmd + E** - Edit profile
- **Ctrl/Cmd + N** - Add new item (opens first add icon)
- **Escape** - Cancel edit mode / Close modal
- **Enter** - Save in modal (when not in textarea)
- **Tab** - Navigate forward
- **Shift + Tab** - Navigate backward

#### Arrow Key Navigation
- **Arrow Up/Down** - Navigate through section items
- **Arrow Left/Right** - Navigate through buttons

#### Tips

- **In Modals**: Focus is trapped within the modal. Use `Tab` to navigate, `Esc` to close.
- **In Edit Mode**: Press `Ctrl+S` to save or `Esc` to cancel without using mouse.
- **Section Navigation**: Use arrow keys to quickly move between education, license, or announcement items.
- **Quick Add**: Press `Ctrl+N` to quickly open the first "add" dialog without clicking.


### Accessibility Features

#### ARIA Attributes
- `role="button"` on clickable icons
- `aria-label` for descriptive labels
- `aria-invalid` on validation errors
- `tabindex` for custom focus order



---

### Usage Example

```javascript
// 1. Add to shortcuts object in profile-keyboard.js
const shortcuts = {
  'x': handleNewShortcut
};

// 2. Implement handler function
function handleNewShortcut(e) {
  // Your logic here
}
```
