// import { registerUser, login } from "./api/auth-api.js"; ---!!!- for testing without  server

const PasswordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirm');
const submitBtn = document.getElementById('submit-btn');
const strengthBar = document.getElementById('strength-bar');
const strengthText = document.getElementById('strength-text');

// Toggle password visibility
document.getElementById('toggle-new').addEventListener('click', function () {
    const type = PasswordInput.type === 'password' ? 'text' : 'password';
    PasswordInput.type = type;
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
    const Password = PasswordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    const allRequirementsMet = checkPasswordStrength(Password);
    const passwordsMatch = Password === confirmPassword && Password.length > 0;

    // ---!!!--- disabled ony for testing  ---!!!---

    //  if (!passwordsMatch) {
    //      alert("Գաղտնաբառերը չեն համընկնում"); // TODO: better error display
    //  }
    //  submitBtn.disabled = !(allRequirementsMet && passwordsMatch);
}

PasswordInput.addEventListener('input', validateForm);
confirmPasswordInput.addEventListener('input', validateForm);



document.getElementById('register-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = PasswordInput.value;
    const email = document.getElementById('email').value;
    const fullname = document.getElementById('fullname').value;

    try {
        await registerUser({ email, password, fullname });
        await login(email, password);
        window.location.href = "profile_info.html";

    } catch (error) {
        window.location.href = "profile_info.html"; //  ---!!!- for testing purposes
        console.error(error);
        //alert(error.response?.data?.message || "Registration failed");  TODO: better error display
    }
});
