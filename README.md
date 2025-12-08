# PolyLink 

A modern, feature-rich  platform built with vanilla JavaScript, HTML, and CSS. This platform provides a comprehensive suite of tools for students and educators including user profiles, forums, messaging,  and more.

## 📖 Documentation

For detailed JavaScript code documentation, architecture explanations see **[JS_DOCS.md](./JS_DOCS.md)**.

## 🌟 Features

### Authentication & Security
- **User Registration & Login** - Secure authentication system with JWT tokens
- **Two-Factor Authentication (2FA)** - Enhanced security with 2FA verification
- **Password Recovery** - Complete password reset flow with email verification
- **Profile Information Setup** - Guided onboarding for new users
- **Auto Token Refresh** - Seamless session management with automatic token renewal

### Core Features
- **User Profiles** - Comprehensive profile pages with customizable sections
  - Education history management
  - Professional licenses and certifications
  - Announcements
  - Modal-based editing system
  - Dark mode support
- **Forum System** - Interactive discussion boards
  - Topic creation and management
  - Threaded discussions
- **Events** - Event posting and management system
  - Rich text formatting (bold, italic, links)
  - Dynamic post rendering from backend
- **Messaging** - Real-time communication platform
- **Search** - Comprehensive search functionality across the platform
- **Settings** - User preferences and customization
  - Theme selection (Light/Dark mode)
  - Account settings
  - Privacy controls
- **Help Center** - User support and resources

## 🏗️ Project Structure

```
coursework/
├── css/                    # Stylesheets
│   ├── style.css          # Global styles and theme variables
│   ├── auth.css           # Authentication pages styling
│   ├── profile.css        # Profile page styling
│   ├── forum.css          # Forum styling
│   ├── events.css         # Events page styling
│   ├── message.css        # Messaging interface styling
│   ├── tutorials.css      # Tutorials page styling
│   ├── search.css         # Search page styling
│   ├── settings.css       # Settings page styling
│   ├── help.css           # Help center styling
│   ├── topic.css          # Forum topic styling
│   ├── privacy.css        # Privacy policy styling
│   └── terms.css          # Terms of service styling
│
├── js/                     # JavaScript modules
│   ├── api/               # API integration layer
│   │   ├── axios.js       # Axios instance with interceptors
│   │   ├── auth-api.js    # Authentication API calls
│   │   ├── profile-api.js # Profile management API
│   │   ├── posts-api.js   # Posts/Events API
│   │   ├── forum-api.js   # Forum API
│   │   ├── search-api.js  # Search API
│   │   └── user-api.js    # User management API
│   │
│   ├── core/              # Core utilities
│   │   ├── auth.js        # Authentication utilities
│   │   ├── guard.js       # Route protection
│   │   └── storage.js     # Local storage management
│   │
│   ├── profile/           # Profile module (modular architecture)
│   │   ├── profile-main.js       # Main profile initialization
│   │   ├── profile-sections.js   # Section management (education, licenses, announcements)
│   │   ├── profile-editor.js     # Inline editing functionality
│   │   ├── profile-modal.js      # Modal management
│   │   ├── profile-theme.js      # Theme switching
│   │   ├── profile-utils.js      # Utility functions
│   │   ├── profile-validation.js # Form validation
│   │   └── profile-keyboard.js   # Keyboard shortcuts
│   │
│   ├── login.js           # Login page logic
│   ├── register.js        # Registration page logic
│   ├── profile-info.js    # Profile setup logic
│   ├── forgot.js          # Password recovery initiation
│   ├── verify-code.js     # Email verification code
│   ├── password-reset.js  # Password reset logic
│   ├── 2fa-verify.js      # 2FA verification
│   ├── posts.js           # Events/Posts management
│   ├── forum.js           # Forum functionality
│   ├── search.js          # Search functionality
│   ├── settings.js        # Settings management
│   ├── tutorials.js       # Tutorials page logic
│   ├── help.js            # Help center logic
│   └── chat.js            # Messaging functionality
│
├── image/                  # Image assets
│
├── *.html                  # HTML pages
│   ├── login.html
│   ├── register.html
│   ├── profile_info.html
│   ├── forgot.html
│   ├── verify-code.html
│   ├── reset-password.html
│   ├── 2fa-verify.html
│   ├── profile.html
│   ├── events.html
│   ├── forum.html
│   ├── topic.html
│   ├── new-topic.html
│   ├── message.html
│   ├── search.html
│   ├── tutorials.html
│   ├── settings.html
│   ├── help.html
│   ├── privacy.html
│   └── terms.html
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- Backend API server running on `http://localhost:3004` (not implemented)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd coursework
   ```

4. **Access the application**
   - Open your browser and navigate to `login.html`

## 🔧 Configuration

### API Configuration

The API base URL is configured in `/js/api/axios.js`:

```javascript
const API_URL = 'http://localhost:3004';
```

To change the backend URL, modify this constant.

### Authentication

The application uses JWT-based authentication with:
- **Access Tokens** - Stored in localStorage
- **Refresh Tokens** - Sent via HTTP-only cookies
- **Auto-refresh** - Automatic token renewal on 401 responses

## 🎨 Theming

The application supports light and dark themes:

- Theme preferences are stored in localStorage
- Themes can be switched from the Settings page
- CSS variables in `css/style.css` define the color scheme
- Dark mode is implemented using the `.theme-dark` class

### Theme Variables

```css
:root {
  /* Light theme variables */
}

.theme-dark {
  /* Dark theme variables */
}
```


## 📝 Development Guidelines

### Code Organization

- **Modular Architecture** - Related functionality is grouped into modules (e.g., profile module)
- **API Layer** - All backend communication goes through the `/js/api/` layer
- **Separation of Concerns** - HTML structure, CSS styling, and JS logic are kept separate
- **Reusable Components** - Common UI patterns are abstracted into reusable functions

### Adding New Features

1. Create HTML page in the root directory
2. Add corresponding CSS file in `/css/`
3. Create JavaScript module in `/js/`
4. Add API integration in `/js/api/` if needed
5. Update navigation links in existing pages

### Styling Conventions

- Use CSS variables for theming
- Follow BEM-like naming conventions
- Ensure dark mode compatibility



## 👥 Authors

[ author information ]

