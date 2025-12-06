# Profile Page JavaScript Refactoring

## Overview
The profile page JavaScript code has been refactored from a single monolithic file (`profile.js` - 1156 lines) into a modular, maintainable structure with clear separation of concerns.

## New Structure

### File Organization
```
js/
├── api/
│   ├── axios.js              - Axios configuration with interceptors
│   ├── auth-api.js           - Authentication API calls
│   ├── user-api.js           - User-related API calls
│   ├── posts-api.js          - Posts/announcements API calls
│   └── profile-api.js        - Profile CRUD operations (NEW)
└── profile/
    ├── profile-main.js       - Main initialization and orchestration
    ├── profile-editor.js     - InlineEditor class for content editing
    ├── profile-modal.js      - Modal class for dialogs
    ├── profile-sections.js   - Section management (education, licenses, announcements)
    ├── profile-theme.js      - Theme handling (light/dark/auto)
    ├── profile-utils.js      - Utility functions (date formatting, notifications)
    ├── profile-validation.js - Form validation with visual feedback
    └── profile-keyboard.js   - Keyboard navigation and shortcuts
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

**Key Features**:
- Content editability toggle
- Save/Cancel functionality
- Keyboard shortcuts (Enter to save, Escape to cancel)
- Button state management

#### 3. `profile-modal.js`
**Purpose**: Create and manage modal dialogs
**Exports**:
- `Modal` class - Create customizable modal dialogs
- `createFormattingToolbar()` - Create text formatting toolbar
- `setupFormattingHandlers()` - Setup formatting button handlers

**Key Features**:
- Reusable modal component
- Form data extraction
- Custom footer support (for formatting toolbars)
- Animations and transitions

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

**Key Features**:
- Section-specific modal creation
- Comment system with API integration
- Photo upload handling
- Dynamic content creation

#### 5. `profile-theme.js`
**Purpose**: Handle theme switching (light/dark/auto)
**Exports**:
- `applyTheme(theme)` - Apply a theme to the document
- `initializeTheme()` - Initialize theme from localStorage

**Key Features**:
- Light/Dark/Auto theme support
- localStorage persistence
- System preference detection

#### 6. `profile-main.js`
**Purpose**: Main entry point and initialization
**Exports**: None (initialization only)

**Key Features**:
- Orchestrates all modules
- Initializes all sections
- Sets up event listeners
- DOMContentLoaded handler

## Benefits of Refactoring

### 1. **Modularity**
- Each module has a single, well-defined responsibility
- Easy to locate and modify specific functionality
- Reduced code duplication

### 2. **Maintainability**
- Smaller, focused files are easier to understand
- Clear dependencies between modules
- Better code organization

### 3. **Reusability**
- Components like Modal and InlineEditor can be reused
- Utility functions are centralized
- Easy to import only what's needed

### 4. **Testability**
- Individual modules can be tested in isolation
- Clear interfaces make mocking easier
- Reduced coupling between components

### 5. **Scalability**
- Easy to add new features without affecting existing code
- Clear patterns for adding new sections or functionality
- Better separation of concerns

## Usage

The refactored code uses ES6 modules. The HTML file now includes:

```html
<script type="module" src="js/profile/profile-main.js"></script>
```

All dependencies are automatically resolved through the import/export system.

## Migration Notes

### Breaking Changes
- None - The refactored code maintains the same external API
- All existing functionality is preserved

### Compatibility
- Requires a browser that supports ES6 modules
- All modern browsers (Chrome 61+, Firefox 60+, Safari 11+, Edge 16+)

## Future Improvements

1. **API Integration**: Complete integration with backend API for all CRUD operations
2. **State Management**: Consider adding a state management solution for complex data flows
3. **Error Handling**: Add comprehensive error handling and user feedback
4. **Validation**: Add form validation for all input fields
5. **Accessibility**: Enhance keyboard navigation and screen reader support
6. **Testing**: Add unit tests for all modules
7. **TypeScript**: Consider migrating to TypeScript for better type safety

## Development Guidelines

### Adding New Features
1. Determine which module the feature belongs to
2. If it's a new concern, create a new module
3. Export only what's needed
4. Import dependencies explicitly
5. Update this README

### Code Style
- Use ES6+ features (arrow functions, destructuring, etc.)
- Follow consistent naming conventions
- Add JSDoc comments for public functions
- Keep functions small and focused

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

## Original File Stats
- **Original**: 1 file, 1156 lines
- **Refactored**: 6 files, ~800 lines total
- **Reduction**: ~30% code reduction through better organization and reduced duplication
