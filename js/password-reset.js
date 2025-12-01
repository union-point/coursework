//reset-password
const newPasswordInput = document.getElementById('new-password');
const confirmPasswordInput = document.getElementById('confirm-password');
const submitBtn = document.getElementById('submit-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

// Toggle password visibility
document.getElementById('toggle-new').addEventListener('click', function () {
    const type = newPasswordInput.type === 'password' ? 'text' : 'password';
    newPasswordInput.type = type;
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

document.getElementById('toggle-confirm').addEventListener('click', function () {
    const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
    confirmPasswordInput.type = type;
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

// Password validation requirements
const requirements = {
    length: { regex: /.{8,}/, element: document.getElementById('req-length') },
    uppercase: { regex: /[A-Z]/, element: document.getElementById('req-uppercase') },
    lowercase: { regex: /[a-z]/, element: document.getElementById('req-lowercase') },
    number: { regex: /[0-9]/, element: document.getElementById('req-number') },
    special: { regex: /[!@#$%^&*(),.?":{}|<>]/, element: document.getElementById('req-special') }
};

function checkPasswordStrength(password) {
    let strength = 0;
    let metRequirements = 0;

    for (const [key, req] of Object.entries(requirements)) {
        if (req.regex.test(password)) {
            req.element.classList.add('met');
            metRequirements++;
        } else {
            req.element.classList.remove('met');
        }
    }

    // Calculate strength
    if (metRequirements <= 2) {
        strength = 'weak';
        strengthText.textContent = 'Թույլ';
    } else if (metRequirements <= 4) {
        strength = 'medium';
        strengthText.textContent = 'Միջին';
    } else {
        strength = 'strong';
        strengthText.textContent = 'Ուժեղ';
    }

    // Update strength bar
    strengthBar.className = 'password-strength-bar ' + strength;
    strengthText.className = 'strength-text ' + strength;

    return metRequirements === 5;
}

function validateForm() {
    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const allRequirementsMet = checkPasswordStrength(newPassword);
    const passwordsMatch = newPassword === confirmPassword && newPassword.length > 0;

    //  submitBtn.disabled = !(allRequirementsMet && passwordsMatch);
}

newPasswordInput.addEventListener('input', validateForm);
confirmPasswordInput.addEventListener('input', validateForm);

// Form submission
document.getElementById('reset-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const newPassword = newPasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;



    // Here you would send the new password to your backend
    console.log('New password set');

    // Show success message and redirect
    // alert('Գաղտնաբառը հաջողությամբ փոխվել է։ Խնդրում ենք մուտք գործել։');
    window.location.href = 'login.html';
});