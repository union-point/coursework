// Settings Page JavaScript

// Theme Selector
document.addEventListener('DOMContentLoaded', () => {
    // Theme buttons
    const themeButtons = document.querySelectorAll('.theme-btn');

    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            themeButtons.forEach(btn => btn.classList.remove('active'));

            // Add active class to clicked button
            button.classList.add('active');

            // Get selected theme
            const theme = button.dataset.theme;

            // Save to localStorage
            localStorage.setItem('theme', theme);

            // Apply theme (you can expand this to actually change the theme)
            console.log(`Theme changed to: ${theme}`);

            // Show confirmation
            showNotification(`Թեման փոխվել է ${getThemeName(theme)}-ի`);
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        themeButtons.forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Toggle switches
    const toggleSwitches = document.querySelectorAll('.toggle-switch input');

    toggleSwitches.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const settingName = e.target.closest('.settings-item').querySelector('h3').textContent;
            const isEnabled = e.target.checked;

            console.log(`${settingName}: ${isEnabled ? 'Միացված' : 'Անջատված'}`);

            // Show notification
            showNotification(`${settingName} ${isEnabled ? 'միացված է' : 'անջատված է'}`);
        });
    });

    // Select dropdowns
    const selects = document.querySelectorAll('.settings-select');

    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const settingName = e.target.closest('.settings-item').querySelector('h3').textContent;
            const selectedValue = e.target.options[e.target.selectedIndex].text;

            console.log(`${settingName}: ${selectedValue}`);

            // Show notification
            showNotification(`${settingName} փոխվել է ${selectedValue}-ի`);
        });
    });

    // Secondary buttons (Edit buttons)
    const secondaryButtons = document.querySelectorAll('.btn-secondary');

    secondaryButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const settingName = e.target.closest('.settings-item').querySelector('h3').textContent;

            // Check if it's a download or clear button
            if (settingName.includes('Ներբեռնել')) {
                handleDownloadData();
            } else if (settingName.includes('Մաքրել')) {
                handleClearCache();
            } else {
                handleEditSetting(settingName);
            }
        });
    });

    // Danger buttons
    const deactivateBtn = document.querySelector('.btn-danger-outline');
    const deleteBtn = document.querySelector('.btn-danger');

    if (deactivateBtn) {
        deactivateBtn.addEventListener('click', () => {
            handleDeactivateAccount();
        });
    }

    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            handleDeleteAccount();
        });
    }
});

// Helper Functions

function getThemeName(theme) {
    const themeNames = {
        'light': 'Լուսավոր',
        'dark': 'Մուգ',
        'auto': 'Ավտո'
    };
    return themeNames[theme] || theme;
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, rgb(25, 49, 172), #1e3a8a);
        color: white;
        padding: 15px 25px;
        border-radius: 12px;
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        animation: slideIn 0.3s ease-out;
        font-weight: 500;
    `;

    // Add animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

function handleEditSetting(settingName) {
    console.log(`Editing: ${settingName}`);

    // Create a simple modal or prompt
    const newValue = prompt(`Մուտքագրեք նոր արժեքը ${settingName}-ի համար:`);

    if (newValue !== null && newValue.trim() !== '') {
        showNotification(`${settingName} հաջողությամբ թարմացվել է`);

        // Update the display value
        const settingItem = Array.from(document.querySelectorAll('.settings-item')).find(
            item => item.querySelector('h3').textContent === settingName
        );

        if (settingItem) {
            const description = settingItem.querySelector('.settings-item-description');
            if (description && !description.textContent.includes('առաջ')) {
                description.textContent = newValue;
            }
        }
    }
}

function handleDownloadData() {
    showNotification('Տվյալների ներբեռնումը սկսվել է...');

    // Simulate download
    setTimeout(() => {
        showNotification('Տվյալները հաջողությամբ ներբեռնվել են');
    }, 2000);
}

function handleClearCache() {
    if (confirm('Վստա՞հ եք, որ ցանկանում եք մաքրել քեշը:')) {
        showNotification('Քեշը մաքրվում է...');

        // Simulate cache clearing
        setTimeout(() => {
            showNotification('Քեշը հաջողությամբ մաքրվել է');
        }, 1500);
    }
}

function handleDeactivateAccount() {
    const confirmation = confirm(
        'Վստա՞հ եք, որ ցանկանում եք ապաակտիվացնել ձեր հաշիվը:\n\n' +
        'Դուք կկարողանաք վերականգնել այն ցանկացած ժամանակ:'
    );

    if (confirmation) {
        showNotification('Հաշիվը ապաակտիվացվում է...');

        // Simulate deactivation
        setTimeout(() => {
            showNotification('Հաշիվը հաջողությամբ ապաակտիվացվել է');
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1500);
    }
}

function handleDeleteAccount() {
    const confirmation = confirm(
        '⚠️ ԶԳՈՒՇԱՑՈՒՄ ⚠️\n\n' +
        'Վստա՞հ եք, որ ցանկանում եք մշտապես ջնջել ձեր հաշիվը:\n\n' +
        'Այս գործողությունը ԱՆԴԱՌՆԱԼԻ է և կջնջի բոլոր ձեր տվյալները:\n\n' +
        'Սեղմեք OK՝ շարունակելու համար:'
    );

    if (confirmation) {
        const finalConfirmation = prompt(
            'Մուտքագրեք "ՋՆՋԵԼ"՝ հաստատելու համար:'
        );

        if (finalConfirmation === 'ՋՆՋԵԼ') {
            showNotification('Հաշիվը ջնջվում է...');

            // Simulate deletion
            setTimeout(() => {
                showNotification('Հաշիվը հաջողությամբ ջնջվել է');
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }, 1500);
        } else if (finalConfirmation !== null) {
            showNotification('Սխալ հաստատում: Հաշիվը չի ջնջվել');
        }
    }
}

// Add smooth scroll behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});
