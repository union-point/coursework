function applyTheme(theme) {
    const root = document.documentElement;
    // Remove existing theme classes
    root.classList.remove('theme-light', 'theme-dark', 'theme-auto');

    if (theme === 'dark') {
        root.classList.add('theme-dark');
    } else if (theme === 'light') {
        root.classList.add('theme-light');
    } else {
        // Auto: follow system preference
        root.classList.add('theme-auto');
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            root.classList.add('theme-dark');
        }
    }
}
document.addEventListener('DOMContentLoaded', function () {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    // Listen for system theme changes if auto
    if (savedTheme === 'auto') {
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (localStorage.getItem('theme') === 'auto') {
                applyTheme('auto');
            }
        });
    }


    const modal = document.getElementById('postModal');
    const btn = document.querySelector('.create-post-btn');
    const span = document.querySelector('.btn-cancel');
    const closeBtn = modal.querySelector('.close-btn');

    if (btn) {
        btn.onclick = function () {
            modal.style.display = "block";
        }
    }

    if (span) {
        span.onclick = function () {
            modal.querySelector('.editor').innerHTML = '';
            modal.querySelectorAll('.format-btn').forEach(btn => {
                btn.classList.remove('active');
            })
            document.getElementById('announcement-title').value = '';
            modal.style.display = "none";
        }
    }

    if (closeBtn) {
        closeBtn.onclick = function () {

            modal.style.display = "none";
        }
    }

    // // format buttons functionality
    modal.querySelectorAll('.format-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            this.classList.toggle('active');
        });
    })

    const editor = document.getElementById("announcement-content");
    const buttons = document.querySelectorAll(".format-btn");

    function applyCommand(cmd) {
        editor.focus();
        document.execCommand(cmd, false, null);
        updateActiveButtons();
    }

    function updateActiveButtons() {
        buttons.forEach(btn => {
            const cmd = btn.dataset.command;
            btn.classList.toggle("active", document.queryCommandState(cmd));
        });
    }

    // --- listeners ---
    buttons.forEach(btn => {
        btn.addEventListener("click", () => {
            applyCommand(btn.dataset.command);
        });
    });

    // --- update state ---
    editor.addEventListener("keyup", updateActiveButtons);
    editor.addEventListener("mouseup", updateActiveButtons);



});