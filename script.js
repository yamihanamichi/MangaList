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