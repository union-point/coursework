
//import { forgotPassword } from "./api/auth-api.js";

const emailInput = document.getElementById('email');

document.getElementById('forgot-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = emailInput.value;

    try {
        await forgotPassword(email);
        localStorage.setItem("resetEmail", email);
        window.location.href = 'verify-code.html';
    } catch (error) {
        window.location.href = 'verify-code.html';

        console.error(error);
        //  alert(error.response?.data?.message || "Failed to send reset code");
    }
});
