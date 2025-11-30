document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('postModal');
    const btn = document.querySelector('.create-post-btn');
    const span = document.querySelector('.close-btn');

    if (btn) {
        btn.onclick = function () {
            modal.style.display = "block";
        }
    }

    if (span) {
        span.onclick = function () {
            modal.style.display = "none";
        }
    }

    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
});