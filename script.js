const mangaContainer = document.getElementById('mangaContainer');
const currentPageSpan = document.getElementById('currentPage');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const popupContainer = document.createElement('div');
popupContainer.id = 'mangaPopup';
popupContainer.classList.add('popup-container');
document.body.appendChild(popupContainer);

let currentPage = 1;
const mangasPerPage = 20;
let currentSearchQuery = '';

async function fetchMangas(page, searchQuery = '') {
    try {
        let url = searchQuery 
            ? `https://api.jikan.moe/v4/manga?q=${encodeURIComponent(searchQuery)}&page=${page}&limit=${mangasPerPage}`
            : `https://api.jikan.moe/v4/top/manga?page=${page}&limit=${mangasPerPage}&filter=bypopularity`;
        
        const response = await fetch(url);
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Erreur de récupération des mangas:', error);
        return [];
    }
}

function createMangaCard(manga) {
    return `
        <div class="col-6 col-md-3 mb-4">
            <div class="card h-100 manga-card" data-mal-id="${manga.mal_id}">
                <img src="${manga.images.jpg.image_url}" class="card-img-top" alt="${manga.title}">
                <div class="card-body">
                    <h5 class="card-title">${manga.title}</h5>
                </div>
            </div>
        </div>
    `;
}

async function displayMangas(page, searchQuery = '') {
    mangaContainer.innerHTML = '';
    const mangas = await fetchMangas(page, searchQuery);

    for (let i = 0; i < mangas.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'row mb-4';
        
        const rowMangas = mangas.slice(i, i + 4);
        row.innerHTML = rowMangas.map(createMangaCard).join('');
        
        mangaContainer.appendChild(row);
    }

    document.querySelectorAll('.manga-card').forEach(card => {
        card.addEventListener('click', () => showMangaDetails(card.dataset.malId));
    });

    currentPageSpan.textContent = `Page ${page}`;
    prevPageBtn.disabled = page === 1;
    
    if (searchQuery) {
        currentSearchQuery = searchQuery;
        nextPageBtn.disabled = mangas.length < mangasPerPage;
    } else {
        currentSearchQuery = '';
        nextPageBtn.disabled = false;
    }
}

async function showMangaDetails(malId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${malId}/full`);
        const data = await response.json();
        const manga = data.data;

        popupContainer.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h2>${manga.title}</h2>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${manga.images.jpg.large_image_url}" class="img-fluid" alt="${manga.title}">
                        </div>
                        <div class="col-md-8">
                            <h3>Synopsis</h3>
                            <p>${manga.synopsis || 'Pas de synopsis disponible.'}</p>
                            <div class="manga-details">
                                <p><strong>Type:</strong> ${manga.type || 'N/A'}</p>
                                <p><strong>Genres:</strong> ${manga.genres.map(g => g.name).join(', ') || 'N/A'}</p>
                                <p><strong>Auteur:</strong> ${manga.authors.map(a => a.name).join(', ') || 'N/A'}</p>
                                <p><strong>Status:</strong> ${manga.status || 'N/A'}</p>
                                <p><strong>Score:</strong> ${manga.score || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        popupContainer.classList.add('show');

        popupContainer.querySelector('.close-popup').addEventListener('click', closePopup);
        popupContainer.addEventListener('click', (e) => {
            if (e.target === popupContainer) closePopup();
        });
    } catch (error) {
        console.error('Erreur de récupération des détails du manga:', error);
    }
}

function closePopup() {
    popupContainer.classList.remove('show');
}

searchBtn.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query) {
        currentPage = 1;
        displayMangas(currentPage, query);
    }
});

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayMangas(currentPage, currentSearchQuery);
    }
});

nextPageBtn.addEventListener('click', () => {
    currentPage++;
    displayMangas(currentPage, currentSearchQuery);
});

displayMangas(currentPage);

// reset populaire
function resetToPopularMangas() {
    currentPage = 1;
    currentSearchQuery = '';
    searchInput.value = ''; // Réinitialiser la barre de recherche
    displayMangas(currentPage);
}

// Ajoutez un écouteur d'événement pour le bouton "Populaires"
document.getElementById('popularBtn').addEventListener('click', resetToPopularMangas);


async function showMangaDetails(malId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${malId}/full`);
        const data = await response.json();
        const manga = data.data;

        popupContainer.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h2>${manga.title}</h2>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${manga.images.jpg.large_image_url}" class="img-fluid" alt="${manga.title}">
                            <button id="addToListBtn" class="btn btn-success mt-3 w-100">
                                <i class="fas fa-plus"></i> Ajouter à ma liste
                            </button>
                        </div>
                        <div class="col-md-8">
                            <h3>Synopsis</h3>
                            <p>${manga.synopsis || 'Pas de synopsis disponible.'}</p>
                            <div class="manga-details">
                                <p><strong>Type:</strong> ${manga.type || 'N/A'}</p>
                                <p><strong>Genres:</strong> ${manga.genres.map(g => g.name).join(', ') || 'N/A'}</p>
                                <p><strong>Auteur:</strong> ${manga.authors.map(a => a.name).join(', ') || 'N/A'}</p>
                                <p><strong>Status:</strong> ${manga.status || 'N/A'}</p>
                                <p><strong>Score:</strong> ${manga.score || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        popupContainer.classList.add('show');

        // Ajouter le gestionnaire d'événement pour le bouton "Ajouter à ma liste"
        document.getElementById('addToListBtn').addEventListener('click', () => {
            addMangaToList(manga);
            alert('Manga ajouté à votre liste !');
        });

        popupContainer.querySelector('.close-popup').addEventListener('click', closePopup);
        popupContainer.addEventListener('click', (e) => {
            if (e.target === popupContainer) closePopup();
        });
    } catch (error) {
        console.error('Erreur de récupération des détails du manga:', error);
    }
}

// Fonction pour ajouter un manga à la liste
function addMangaToList(manga) {
    const myMangas = JSON.parse(localStorage.getItem('myMangaList') || '[]');
    
    // Vérifier si le manga existe déjà
    const mangaExists = myMangas.some(m => m.mal_id === manga.mal_id);
    
    if (!mangaExists) {
        myMangas.push({
            mal_id: manga.mal_id,
            title: manga.title,
            image: manga.images.jpg.image_url
        });
        
        localStorage.setItem('myMangaList', JSON.stringify(myMangas));
    }
}

// Fonction pour gérer les commentaires
function addCommentSection(manga, popupBody) {
    // Vérifier si l'utilisateur est connecté
    const currentUser = JSON.parse(localStorage.getItem('userAccountInfo') || '{}');
    
    if (!currentUser.username) {
        return `
            <div class="comments-section mt-4">
                <h4>Commentaires</h4>
                <div class="alert alert-warning">
                    Connectez-vous pour laisser un commentaire
                </div>
            </div>
        `;
    }

    // Récupérer les commentaires existants pour ce manga
    const comments = JSON.parse(localStorage.getItem(`manga_comments_${manga.mal_id}`) || '[]');
    
    // Générer le HTML des commentaires existants
    const commentsList = comments.map((comment, index) => `
        <div class="comment mb-3 p-2 border rounded" data-comment-id="${index}">
            <div class="d-flex justify-content-between align-items-center">
                <strong>${comment.username}</strong>
                ${comment.username === currentUser.username ? `
                    <div>
                        <button class="btn btn-sm btn-outline-primary edit-comment-btn">Modifier</button>
                        <button class="btn btn-sm btn-outline-danger delete-comment-btn">Supprimer</button>
                    </div>
                ` : ''}
            </div>
            <p class="comment-text">${comment.text}</p>
            <small class="text-muted">${new Date(comment.date).toLocaleString()}</small>
        </div>
    `).join('');

    return `
        <div class="comments-section mt-4">
            <h4>Commentaires</h4>
            <div id="commentsList">
                ${commentsList}
            </div>
            <form id="addCommentForm" class="mt-3">
                <div class="form-group">
                    <textarea id="commentText" class="form-control" rows="3" placeholder="Votre commentaire..."></textarea>
                </div>
                <button type="submit" class="btn btn-primary mt-2">Publier</button>
            </form>
        </div>
    `;
}

// Ajouter des écouteurs d'événements pour la gestion des commentaires
function setupCommentListeners(manga, popupBody) {
    const currentUser = JSON.parse(localStorage.getItem('userAccountInfo') || '{}');
    const addCommentForm = popupBody.querySelector('#addCommentForm');
    const commentsList = popupBody.querySelector('#commentsList');

    if (!currentUser.username) return;

    // Soumettre un nouveau commentaire
    addCommentForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const commentTextArea = e.target.querySelector('#commentText');
        const commentText = commentTextArea.value.trim();

        if (commentText) {
            const comments = JSON.parse(localStorage.getItem(`manga_comments_${manga.mal_id}`) || '[]');
            
            comments.push({
                username: currentUser.username,
                text: commentText,
                date: new Date().toISOString()
            });

            localStorage.setItem(`manga_comments_${manga.mal_id}`, JSON.stringify(comments));
            
            // Réinitialiser le formulaire
            commentTextArea.value = '';
            
            // Mettre à jour l'affichage des commentaires
            updateCommentsList(manga, commentsList);
        }
    });

    // Délégation d'événements pour modifier/supprimer les commentaires
    commentsList.addEventListener('click', (e) => {
        const commentContainer = e.target.closest('.comment');
        if (!commentContainer) return;

        const commentId = commentContainer.dataset.commentId;
        const comments = JSON.parse(localStorage.getItem(`manga_comments_${manga.mal_id}`) || '[]');

        // Bouton de suppression
        if (e.target.classList.contains('delete-comment-btn')) {
            comments.splice(commentId, 1);
            localStorage.setItem(`manga_comments_${manga.mal_id}`, JSON.stringify(comments));
            updateCommentsList(manga, commentsList);
        }

        // Bouton de modification
        if (e.target.classList.contains('edit-comment-btn')) {
            const commentText = commentContainer.querySelector('.comment-text');
            const currentText = commentText.textContent;
            
            // Remplacer le texte par un formulaire d'édition
            commentText.innerHTML = `
                <form class="edit-comment-form">
                    <textarea class="form-control">${currentText}</textarea>
                    <div class="mt-2">
                        <button type="submit" class="btn btn-sm btn-success">Enregistrer</button>
                        <button type="button" class="btn btn-sm btn-secondary cancel-edit">Annuler</button>
                    </div>
                </form>
            `;

            // Gérer l'enregistrement de l'édition
            const editForm = commentText.querySelector('.edit-comment-form');
            editForm.addEventListener('submit', (submitE) => {
                submitE.preventDefault();
                const newText = editForm.querySelector('textarea').value.trim();
                
                if (newText) {
                    comments[commentId].text = newText;
                    comments[commentId].date = new Date().toISOString(); // Mettre à jour la date
                    localStorage.setItem(`manga_comments_${manga.mal_id}`, JSON.stringify(comments));
                    updateCommentsList(manga, commentsList);
                }
            });

            // Gérer l'annulation de l'édition
            editForm.querySelector('.cancel-edit').addEventListener('click', () => {
                updateCommentsList(manga, commentsList);
            });
        }
    });
}

// Mettre à jour la liste des commentaires
function updateCommentsList(manga, commentsList) {
    const currentUser = JSON.parse(localStorage.getItem('userAccountInfo') || '{}');
    const comments = JSON.parse(localStorage.getItem(`manga_comments_${manga.mal_id}`) || '[]');
    
    commentsList.innerHTML = comments.map((comment, index) => `
        <div class="comment mb-3 p-2 border rounded" data-comment-id="${index}">
            <div class="d-flex justify-content-between align-items-center">
                <strong>${comment.username}</strong>
                ${comment.username === currentUser.username ? `
                    <div>
                        <button class="btn btn-sm btn-outline-primary edit-comment-btn">Modifier</button>
                        <button class="btn btn-sm btn-outline-danger delete-comment-btn">Supprimer</button>
                    </div>
                ` : ''}
            </div>
            <p class="comment-text">${comment.text}</p>
            <small class="text-muted">${new Date(comment.date).toLocaleString()}</small>
        </div>
    `).join('');
}

// Modifier la fonction showMangaDetails pour inclure les commentaires
async function showMangaDetails(malId) {
    try {
        const response = await fetch(`https://api.jikan.moe/v4/manga/${malId}/full`);
        const data = await response.json();
        const manga = data.data;

        popupContainer.innerHTML = `
            <div class="popup-content">
                <div class="popup-header">
                    <h2>${manga.title}</h2>
                    <button class="close-popup">&times;</button>
                </div>
                <div class="popup-body">
                    <div class="row">
                        <div class="col-md-4">
                            <img src="${manga.images.jpg.large_image_url}" class="img-fluid" alt="${manga.title}">
                            <button id="addToListBtn" class="btn btn-success mt-3 w-100">
                                <i class="fas fa-plus"></i> Ajouter à ma liste
                            </button>
                        </div>
                        <div class="col-md-8">
                            <h3>Synopsis</h3>
                            <p>${manga.synopsis || 'Pas de synopsis disponible.'}</p>
                            <div class="manga-details">
                                <p><strong>Type:</strong> ${manga.type || 'N/A'}</p>
                                <p><strong>Genres:</strong> ${manga.genres.map(g => g.name).join(', ') || 'N/A'}</p>
                                <p><strong>Auteur:</strong> ${manga.authors.map(a => a.name).join(', ') || 'N/A'}</p>
                                <p><strong>Status:</strong> ${manga.status || 'N/A'}</p>
                                <p><strong>Score:</strong> ${manga.score || 'N/A'}</p>
                            </div>
                            ${addCommentSection(manga)}
                        </div>
                    </div>
                </div>
            </div>
        `;

        popupContainer.classList.add('show');

        // Sélectionner le corps de la popup
        const popupBody = popupContainer.querySelector('.popup-body');

        // Configurer les gestionnaires d'événements pour les commentaires
        setupCommentListeners(manga, popupBody);

        // Bouton "Ajouter à ma liste"
        document.getElementById('addToListBtn').addEventListener('click', () => {
            addMangaToList(manga);
            alert('Manga ajouté à votre liste !');
        });

        popupContainer.querySelector('.close-popup').addEventListener('click', closePopup);
        popupContainer.addEventListener('click', (e) => {
            if (e.target === popupContainer) closePopup();
        });
    } catch (error) {
        console.error('Erreur de récupération des détails du manga:', error);
    }
}