function goToNextPage() {
    window.location.href = "profile.html";
}
const newPasswordInput = document.getElementById('password');
// Toggle password visibility
document.getElementById('toggle-new').addEventListener('click', function () {
    const type = newPasswordInput.type === 'password' ? 'text' : 'password';
    newPasswordInput.type = type;
    this.textContent = type === 'password' ? '👁️' : '🙈';
});

