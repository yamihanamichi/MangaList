document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('accountForm');
    const usernameInput = document.getElementById('username');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Charger les informations de compte existantes
    function loadAccountInfo() {
        const userInfo = JSON.parse(localStorage.getItem('userAccountInfo') || '{}');
        usernameInput.value = userInfo.username || '';
        emailInput.value = userInfo.email || '';
    }

    // Sauvegarder les informations de compte
    function saveAccountInfo(e) {
        e.preventDefault();

        const userInfo = {
            username: usernameInput.value,
            email: emailInput.value
        };

        // Mettre à jour le mot de passe si un nouveau mot de passe est fourni
        if (passwordInput.value) {
            userInfo.password = passwordInput.value;
        }

        localStorage.setItem('userAccountInfo', JSON.stringify(userInfo));
        alert('Informations mises à jour avec succès !');
    }

    loadAccountInfo();
    accountForm.addEventListener('submit', saveAccountInfo);
});