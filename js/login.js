//import { login } from "./api/auth-api.js";    ---!!!- for testing without  server

document.addEventListener('DOMContentLoaded', () => {
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const errorMessage = document.querySelector('.error-message');


    // Toggle password visibility
    document.getElementById('toggle-new').addEventListener('click', function () {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        this.textContent = type === 'password' ? '👁️' : '🙈';
    });


    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const password = passwordInput.value;
        const email = emailInput.value;


        let isValid = true;

        // check is emial valid 
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // regexp for email checking
        if (!email || !emailRegex.test(email)) {
            emailInput.classList.add('error');
            isValid = false;
        } else {
            emailInput.classList.remove('error');
        }

        // check password not empty
        if (!password) {
            passwordInput.classList.add('error');
            isValid = false;
        } else {
            passwordInput.classList.remove('error');
        }

        // Еnsure both fields are valid before proceeding
        if (1) {//if (isValid) {     --!!!--for testing
            try {
                await login(email, password);
                window.location.href = "profile.html";
            } catch (error) {
                errorMessage.style.display = 'block';
                passwordInput.classList.add('error');
                emailInput.classList.add('error');

                console.error(error);
                window.location.href = "profile.html";


            }
        }
    });

    //red borders if invalid
    emailInput.addEventListener('input', () => {
        if (emailInput.value) {
            emailInput.classList.remove('error');
        }
    });

    passwordInput.addEventListener('input', () => {
        if (passwordInput.value) {
            passwordInput.classList.remove('error');
        }
    });
});

