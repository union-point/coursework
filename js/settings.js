// Theme Selector
// Theme handling with applyTheme function
function applyTheme(theme) {
    const root = document.documentElement;
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-auto');
    // Add the selected theme class
    if (theme === 'light') {
        root.classList.add('theme-light');
    } else if (theme === 'dark') {
        root.classList.add('theme-dark');
    } else {
        // Auto: follow system preference
        root.classList.add('theme-auto');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('theme-dark');
        }
    }
    // Persist selection
    localStorage.setItem('theme', theme);
}

document.addEventListener('DOMContentLoaded', () => {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Update active button UI
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const theme = button.dataset.theme;
            applyTheme(theme);
            if (savedTheme === 'auto') {
                window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
                    if (localStorage.getItem('theme') === 'auto') {
                        applyTheme('auto');
                    }
                });
            }
            console.log(`Թեման փոխվել է ${getThemeName(theme)}-ի`);
        });
    });
    // Load saved theme or default to light
    const savedTheme = localStorage.getItem('theme') || 'light';
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    applyTheme(savedTheme);

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


            // Show notification
            console.log(`${settingName} ${isEnabled ? 'միացված է' : 'անջատված է'}`);
        });
    });

    // 2FA Toggle Handler
    const twoFaToggle = document.getElementById('2fa-toggle');
    if (twoFaToggle) {
        // Load saved state
        const is2FAEnabled = localStorage.getItem('is2FAEnabled') === 'true';
        twoFaToggle.checked = is2FAEnabled;

        twoFaToggle.addEventListener('change', (e) => {
            const isEnabled = e.target.checked;
            localStorage.setItem('is2FAEnabled', isEnabled);
        });
    }
    // Select dropdowns
    const selects = document.querySelectorAll('.settings-select');

    selects.forEach(select => {
        select.addEventListener('change', (e) => {
            const settingName = e.target.closest('.settings-item').querySelector('h3').textContent;
            const selectedValue = e.target.options[e.target.selectedIndex].text;


            // Show notification
            console.log(`${settingName} փոխվել է ${selectedValue}-ի`);
        });
    });

    // Secondary buttons (Edit buttons) - excluding email and password
    const secondaryButtons = document.querySelectorAll('.btn-secondary');

    secondaryButtons.forEach(button => {
        // Skip email and password edit buttons as they have their own handlers
        if (button.id === 'edit-email-btn' || button.id === 'edit-password-btn') {
            return;
        }

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

    // =========================================
    // CHANGE EMAIL & PASSWORD SECTION
    // =========================================
    // --- Utility helpers ---
    function show(el) { el.style.display = 'block'; }
    function showFlex(el) { el.style.display = 'flex'; }
    function hide(el) { el.style.display = 'none'; }

    function clearInputs(inputs) {
        inputs.forEach(i => {
            i.value = '';
            i.classList.remove('error');
        });
    }

    function addLiveValidation(inputs) {
        inputs.forEach(i => {
            i.addEventListener('input', () => i.classList.remove('error'));
        });
    }

    // EMAIL SECTION

    const emailSetting = document.getElementById('email-setting');
    const emailEditForm = document.getElementById('email-edit-form');

    const editEmailBtn = document.getElementById('edit-email-btn');
    const cancelEmailBtn = document.getElementById('cancel-email-btn');
    const saveEmailBtn = document.getElementById('save-email-btn');

    const newEmail = document.getElementById('new-email');
    const oldEmailPassword = document.getElementById('email-old-password');

    addLiveValidation([newEmail, oldEmailPassword]);

    editEmailBtn?.addEventListener('click', () => {
        hide(emailSetting);
        show(emailEditForm);
    });

    cancelEmailBtn?.addEventListener('click', () => {
        hide(emailEditForm);
        showFlex(emailSetting);
        clearInputs([newEmail, oldEmailPassword]);
    });

    saveEmailBtn?.addEventListener('click', () => {
        const emailValue = newEmail.value.trim();
        const passValue = oldEmailPassword.value.trim();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValue || !emailRegex.test(emailValue)) {
            newEmail.classList.add('error');
            return;
        }
        if (!passValue) {
            oldEmailPassword.classList.add('error');
            return;
        }

        console.log('Email updated');
        document.getElementById('current-email').textContent = emailValue;

        hide(emailEditForm);
        showFlex(emailSetting);
        clearInputs([newEmail, oldEmailPassword]);
    });



    // PASSWORD SECTION
    const passwordSetting = document.getElementById('password-setting');
    const passwordEditForm = document.getElementById('password-edit-form');

    const editPasswordBtn = document.getElementById('edit-password-btn');
    const cancelPasswordBtn = document.getElementById('cancel-password-btn');
    const savePasswordBtn = document.getElementById('save-password-btn');

    const oldPass = document.getElementById('old-password');
    const newPass = document.getElementById('new-password');
    const confirmPass = document.getElementById('confirm-password');

    addLiveValidation([oldPass, newPass, confirmPass]);

    editPasswordBtn?.addEventListener('click', () => {
        hide(passwordSetting);
        show(passwordEditForm);
    });

    cancelPasswordBtn?.addEventListener('click', () => {
        hide(passwordEditForm);
        showFlex(passwordSetting);
        clearInputs([oldPass, newPass, confirmPass]);
    });

    savePasswordBtn?.addEventListener('click', () => {
        const oldV = oldPass.value.trim();
        const newV = newPass.value.trim();
        const confV = confirmPass.value.trim();

        if (!oldV) return oldPass.classList.add('error');
        if (!newV) return newPass.classList.add('error');
        if (!confV) return confirmPass.classList.add('error');

        if (newV.length < 8) {
            newPass.classList.add('error');
            // return;
        }
        if (newV !== confV) {
            newPass.classList.add('error');
            confirmPass.classList.add('error');
            //return;
        }

        console.log('Password updated');

        hide(passwordEditForm);
        showFlex(passwordSetting);
        clearInputs([oldPass, newPass, confirmPass]);
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
        console.log(`${settingName} հաջողությամբ թարմացվել է`);

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
    console.log('Տվյալների ներբեռնումը սկսվել է...');

    // Simulate download
    setTimeout(() => {
        console.log('Տվյալները հաջողությամբ ներբեռնվել են');
    }, 2000);
}

function handleClearCache() {
    if (confirm('Վստա՞հ եք, որ ցանկանում եք մաքրել քեշը:')) {
        console.log('Քեշը մաքրվում է...');

        // Simulate cache clearing
        setTimeout(() => {
            console.log('Քեշը հաջողությամբ մաքրվել է');
        }, 1500);
    }
}

function handleDeactivateAccount() {
    const confirmation = confirm(
        'Վստա՞հ եք, որ ցանկանում եք ապաակտիվացնել ձեր հաշիվը:\n\n' +
        'Դուք կկարողանաք վերականգնել այն ցանկացած ժամանակ:'
    );

    if (confirmation) {
        console.log('Հաշիվը ապաակտիվացվում է...');

        // Simulate deactivation
        setTimeout(() => {
            console.log('Հաշիվը հաջողությամբ ապաակտիվացվել է');
            // Redirect to login page after 2 seconds
            setTimeout(() => {
                window.location.href = 'login.html';
            }, 2000);
        }, 1500);
    }
}

function handleDeleteAccount() {
    console.log("CONFIRM CALLED");
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
            console.log('Հաշիվը ջնջվում է...');

            // Simulate deletion
            setTimeout(() => {
                console.log('Հաշիվը հաջողությամբ ջնջվել է');
                // Redirect to login page after 2 seconds
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            }, 1500);
        } else if (finalConfirmation !== null) {
            console.log('Սխալ հաստատում: Հաշիվը չի ջնջվել');
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
