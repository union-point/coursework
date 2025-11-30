// This file is included on every page (except login/register):

// <script type="module" src="/js/core/guard.js"></script>

// It:
// Checks the token
// Loads the user
// If not, redirects to loginimport { loadUser } from "./auth.js";

document.addEventListener("DOMContentLoaded", async () => {
    const user = await loadUser();
    if (!user) {
        window.location.href = "/pages/login.html";
    }
});
