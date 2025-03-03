import { pokemon, search, reset } from './PokemonService.js';

const POKEMON_FAVORITES_KEY = 'pokedex_favorites_v1';
const cardsContainer = document.getElementById('cards');
const searchInput = document.getElementById('searchInput');
let currentDisplayMode = 'all'; 

searchInput.addEventListener('input', (event) => {
    reset();
    cardsContainer.innerHTML = '';
    
    const searchTerm = event.target.value.trim();
    
    if (!searchTerm) {
        currentDisplayMode = 'all';
        reset();
        createCards(true);
    } else {
        currentDisplayMode = 'search';
        search(searchTerm);
        createCards(true);
    }
});

const generateCard = (poke, index, isFavorite = false) => {
    const card = document.createElement('div');
    card.className = "card m-2 col-sm-12 col-md-3";
    card.style.setProperty('--index', index);
    
    if (isFavorite) {
        card.classList.add('favorite-card');
    }

    const cardImg = document.createElement('img');
    cardImg.src = poke.sprites.front_default;
    cardImg.className = "card-img-top pokemon-img mt-2 border rounded shadow";

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const cardTitle = document.createElement('h5');
    cardTitle.className = "card-title text-center";
    cardTitle.innerText = `#${poke.id} ${poke.name}`;

    const typeBadge = document.createElement('span');
    typeBadge.className = `type-badge type-${poke.types[0].type.name}`;
    typeBadge.innerText = poke.types[0].type.name;

    const stats = document.createElement('div');
    stats.className = "pokemon-stats";
    stats.innerHTML = `
        <p class="card-text">Height: ${poke.height / 10}m</p>
        <p class="card-text">Weight: ${poke.weight / 10}kg</p>
        <p class="card-text">Base Experience: ${poke.base_experience}</p>
    `;

    const cardFooter = document.createElement('div');
    cardFooter.className = "card-footer d-flex justify-content-center mb-2";

    const heartIcon = document.createElement('i');
    heartIcon.className = "fa fa-heart text-secondary";

    let favorites = JSON.parse(localStorage.getItem(POKEMON_FAVORITES_KEY)) || [];
    if (favorites.some(fav => fav.id === poke.id)) {
        heartIcon.classList.replace('text-secondary', 'text-danger');
    }

    heartIcon.addEventListener('click', () => {
        toggleFavorite(poke);
        
        heartIcon.classList.toggle('text-secondary');
        heartIcon.classList.toggle('text-danger');
        
        if (currentDisplayMode === 'search') {
            const currentSearchTerm = searchInput.value.trim();
            reset();
            search(currentSearchTerm);
            cardsContainer.innerHTML = '';
            createCards(true);
        } else {
            updateFavoritesDisplay();
        }
    });

    card.appendChild(typeBadge);
    cardBody.appendChild(cardImg);
    cardBody.appendChild(cardTitle);
    cardBody.appendChild(stats);
    cardFooter.appendChild(heartIcon);

    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    return card;
};

const updateFavoritesDisplay = () => {
    const favoriteCards = document.querySelectorAll('.favorite-card');
    favoriteCards.forEach(card => card.remove());

    const favorites = JSON.parse(localStorage.getItem(POKEMON_FAVORITES_KEY)) || [];
    const displayedPokemonIds = new Set(
        Array.from(cardsContainer.children).map(card => 
            parseInt(card.querySelector('.card-title').textContent.split(' ')[0].replace('#', ''))
        )
    );

    let cardIndex = cardsContainer.children.length;
    favorites.forEach(fav => {
        if (!displayedPokemonIds.has(fav.id)) {
            const favoriteCard = generateCard(fav, cardIndex, true);
            cardsContainer.appendChild(favoriteCard);
            cardIndex++;
        }
    });
};

const createCards = (includeFavorites = false) => {
    cardsContainer.innerHTML = '';
    let cardIndex = 0;

    for (const poke of pokemon) {
        const card = generateCard(poke, cardIndex);
        cardsContainer.appendChild(card);
        cardIndex++;
    }

    if (includeFavorites) {
        const favorites = JSON.parse(localStorage.getItem(POKEMON_FAVORITES_KEY)) || [];
        
        favorites.forEach(fav => {
            // Only add if not already displayed
            if (!pokemon.some(p => p.id === fav.id)) {
                const favoriteCard = generateCard(fav, cardIndex, true);
                cardsContainer.appendChild(favoriteCard);
                cardIndex++;
            }
        });
    }
};

const toggleFavorite = (pokemon) => {
    let favorites = JSON.parse(localStorage.getItem(POKEMON_FAVORITES_KEY)) || [];

    if (favorites.some(fav => fav.id === pokemon.id)) {
        favorites = favorites.filter(fav => fav.id !== pokemon.id);
    } else {
        favorites.push(pokemon);
    }

    localStorage.setItem(POKEMON_FAVORITES_KEY, JSON.stringify(favorites));
};

const updateCards = () => {
    reset();
    createCards(true);
};

window.addEventListener('load', () => {
    updateCards();
});

export { createCards };