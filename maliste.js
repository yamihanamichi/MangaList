const myMangaContainer = document.getElementById('myMangaContainer');
const currentPageSpan = document.getElementById('currentPage');
const prevPageBtn = document.getElementById('prevPageBtn');
const nextPageBtn = document.getElementById('nextPageBtn');

let currentPage = 1;
const mangasPerPage = 20;

function createMangaCard(manga) {
    return `
        <div class="col-6 col-md-3 mb-4">
            <div class="card h-100 manga-card" data-mal-id="${manga.mal_id}">
                <img src="${manga.image}" class="card-img-top" alt="${manga.title}">
                <div class="card-body">
                    <h5 class="card-title">${manga.title}</h5>
                    <button class="btn btn-danger remove-manga w-100">Retirer</button>
                </div>
            </div>
        </div>
    `;
}

function displayMyMangas(page) {
    const myMangas = JSON.parse(localStorage.getItem('myMangaList') || '[]');
    const start = (page - 1) * mangasPerPage;
    const end = start + mangasPerPage;
    const paginatedMangas = myMangas.slice(start, end);

    myMangaContainer.innerHTML = '';
    for (let i = 0; i < paginatedMangas.length; i += 4) {
        const row = document.createElement('div');
        row.className = 'row mb-4';
        
        const rowMangas = paginatedMangas.slice(i, i + 4);
        row.innerHTML = rowMangas.map(createMangaCard).join('');
        
        myMangaContainer.appendChild(row);
    }

    // Ajouter des écouteurs pour le bouton "Retirer"
    document.querySelectorAll('.remove-manga').forEach((button, index) => {
        button.addEventListener('click', () => {
            const manga = paginatedMangas[index];
            removeMangaFromList(manga.mal_id);
        });
    });

    currentPageSpan.textContent = `Page ${page}`;
    prevPageBtn.disabled = page === 1;
    nextPageBtn.disabled = end >= myMangas.length;
}

function removeMangaFromList(malId) {
    let myMangas = JSON.parse(localStorage.getItem('myMangaList') || '[]');
    myMangas = myMangas.filter(manga => manga.mal_id !== malId);
    localStorage.setItem('myMangaList', JSON.stringify(myMangas));
    displayMyMangas(currentPage);
}

prevPageBtn.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        displayMyMangas(currentPage);
    }
});

nextPageBtn.addEventListener('click', () => {
    const myMangas = JSON.parse(localStorage.getItem('myMangaList') || '[]');
    const totalPages = Math.ceil(myMangas.length / mangasPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayMyMangas(currentPage);
    }
});

// Ajouter une fonction pour ajouter un manga à la liste depuis la page de classement
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

// Initialiser l'affichage
displayMyMangas(currentPage);

