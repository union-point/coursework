document.addEventListener('DOMContentLoaded', () => {

    // Auto-focus and auto-advance logic for code inputs
    const inputs = document.querySelectorAll('.code-input');

    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            const value = e.target.value;
            // Only allow numbers
            if (!/^\d*$/.test(value)) {
                e.target.value = '';
                return;
            }
            // Move to next input if value is entered
            if (value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
            input.classList.remove('error');
        });

        input.addEventListener('keydown', (e) => {
            // Move to previous input on backspace if current is empty
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        // Handle paste
        input.addEventListener('paste', (e) => {
            e.preventDefault();
            const pastedData = e.clipboardData.getData('text').replace(/\D/g, '');

            for (let i = 0; i < pastedData.length && index + i < inputs.length; i++) {
                inputs[index + i].value = pastedData[i];
            }

            // Focus the next empty input or the last one
            const nextIndex = Math.min(index + pastedData.length, inputs.length - 1);
            inputs[nextIndex].focus();
        });
    });

    // Auto-focus first input on page load
    inputs[0].focus();

    // Resend timer logic (simulated)
    let timeLeft = 60;
    const timerElement = document.getElementById('timer');
    const resendBtn = document.getElementById('resend-btn');

    function startTimer() {
        timeLeft = 60;
        resendBtn.style.pointerEvents = 'none';
        resendBtn.style.opacity = '0.5';

        const interval = setInterval(() => {
            timeLeft--;
            timerElement.textContent = `(${timeLeft}վ)`;

            if (timeLeft <= 0) {
                clearInterval(interval);
                timerElement.textContent = '';
                resendBtn.style.pointerEvents = 'auto';
                resendBtn.style.opacity = '1';
            }
        }, 1000);
    }
    // Start timer on page load
    startTimer();

    // Resend code
    resendBtn.addEventListener('click', async () => {
        console.log('Code resent');
        startTimer();
    });

    // Form submission
    document.getElementById('verify-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        const code = Array.from(inputs).map(input => input.value).join('');

        if (code.length === 6) {
            // Simulate verification success
            console.log('2FA Code:', code);
            // Redirect to profile page
            window.location.href = 'profile.html';
        } else {
            inputs.forEach(input => {
                input.classList.add('error');
                input.value = ''
            });
            inputs[0].focus();
        }
    });
});
