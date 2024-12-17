document.addEventListener('DOMContentLoaded', () => {
    const accountForm = document.getElementById('accountForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const emailInput = document.getElementById('email');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitBtn = document.getElementById('submitBtn');
    const formTitle = document.getElementById('formTitle');
    const toggleFormLink = document.getElementById('toggleForm');
    const emailGroup = document.getElementById('emailGroup');
    const confirmPasswordGroup = document.getElementById('confirmPasswordGroup');
    
    let isLoginForm = true;

    // Basculer entre connexion et inscription
    toggleFormLink.addEventListener('click', (e) => {
        e.preventDefault();
        isLoginForm = !isLoginForm;

        if (isLoginForm) {
            formTitle.textContent = 'Connexion';
            submitBtn.textContent = 'Se connecter';
            emailGroup.style.display = 'none';
            confirmPasswordGroup.style.display = 'none';
            toggleFormLink.textContent = 'Créer un compte';
        } else {
            formTitle.textContent = 'Créer un compte';
            submitBtn.textContent = 'S\'inscrire';
            emailGroup.style.display = 'block';
            confirmPasswordGroup.style.display = 'block';
            toggleFormLink.textContent = 'J\'ai déjà un compte';
        }
    });

    // Soumettre le formulaire
    accountForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validation de base
        if (!usernameInput.value || !passwordInput.value) {
            alert('Veuillez remplir tous les champs obligatoires.');
            return;
        }

        if (!isLoginForm) {
            // Vérification d'inscription
            if (!emailInput.value) {
                alert('Veuillez saisir votre email.');
                return;
            }

            if (passwordInput.value !== confirmPasswordInput.value) {
                alert('Les mots de passe ne correspondent pas.');
                return;
            }

            // Vérifier si le pseudo existe déjà
            const existingUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const usernameExists = existingUsers.some(user => user.username === usernameInput.value);
            
            if (usernameExists) {
                alert('Ce pseudo est déjà utilisé. Veuillez en choisir un autre.');
                return;
            }

            // Inscription
            const newUser = {
                username: usernameInput.value,
                email: emailInput.value,
                password: passwordInput.value
            };

            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
            
            alert('Compte créé avec succès !');
            
            // Basculer vers le formulaire de connexion
            isLoginForm = true;
            formTitle.textContent = 'Connexion';
            submitBtn.textContent = 'Se connecter';
            emailGroup.style.display = 'none';
            confirmPasswordGroup.style.display = 'none';
            toggleFormLink.textContent = 'Créer un compte';
            
            // Réinitialiser le formulaire
            accountForm.reset();
        } else {
            // Connexion
            const registeredUsers = JSON.parse(localStorage.getItem('registeredUsers') || '[]');
            const user = registeredUsers.find(u => 
                u.username === usernameInput.value && 
                u.password === passwordInput.value
            );

            if (user) {
                // Connexion réussie
                localStorage.setItem('currentUser', JSON.stringify(user));
                alert('Connexion réussie !');
                window.location.href = 'classement.html';
            } else {
                alert('Pseudo ou mot de passe incorrect.');
            }
        }
    });
});