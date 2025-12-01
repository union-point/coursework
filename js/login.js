//import { login } from "./api/auth-api.js";    ---!!!- for testing without  server


const PasswordInput = document.getElementById('password');
const emailInput = document.getElementById('email');
// Toggle password visibility
document.getElementById('toggle-new').addEventListener('click', function () {
    const type = PasswordInput.type === 'password' ? 'text' : 'password';
    PasswordInput.type = type;
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const password = PasswordInput.value;
    const email = emailInput.value;

    try {
        await login(email, password);
        window.location.href = "profile.html";
    } catch (error) {
        console.error(error);

        window.location.href = "profile.html"; //  ---!!!- for testing purposes
        // TODO: show error to user
        //error.response?.data?.message || "Login failed"
    }
});
