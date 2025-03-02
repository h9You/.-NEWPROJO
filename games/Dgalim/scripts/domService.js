import {countries, search, reset} from './countryService.js';
const cardsContainer = document.getElementById('cards');

document.getElementById('searchInput').addEventListener('input', (event) => {
    console.log(event.target.value);
    reset();
    cardsContainer.innerHTML = '';
    if (!event.target.value || event.target.value === '') {
        reset();
        createCards();
    } else {
        search(event.target.value);
        createCards();
    }
    displayFavorites();
});

const generateCard = (country) => {
    const card = document.createElement('div');
    card.className = "card m-2 col-sm-12 col-md-3";

    const cardImg = document.createElement('img');
    cardImg.src = country.flags.png;
    cardImg.className = "card-img-top img mt-2 border rounded shadow";

    const cardBody = document.createElement('div');
    cardBody.className = "card-body";

    const cardTitle = document.createElement('h5');
    cardTitle.className = "card-title";
    cardTitle.innerText = country.name.common;

    const population = document.createElement('p');
    population.className = "card-text";
    population.innerText = `Population: ${country.population}`;

    const region = document.createElement('p');
    region.className = "card-text";
    region.innerText = `Region: ${country.region}`;

    const cardFooter = document.createElement('div');
    cardFooter.className = "card-footer d-flex justify-content-center mb-2";

    let heartIcon = document.createElement('i');
heartIcon.className = "fa fa-heart text-secondary";

let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
if (favorites.some(fav => fav.name.common === country.name.common)) {
    heartIcon.classList.replace('text-secondary', 'text-danger');
}

heartIcon.addEventListener('click', () => {
    heartIcon.classList.toggle('text-secondary');
    heartIcon.classList.toggle('text-danger');
    toggleFavorite(country);
});


    cardFooter.appendChild(heartIcon);

    cardBody.appendChild(cardTitle);
    cardBody.appendChild(population);
    cardBody.appendChild(region);

    card.appendChild(cardImg);
    card.appendChild(cardBody);
    card.appendChild(cardFooter);

    cardsContainer.appendChild(card);
};

const createCards = () => {
    for (const country of countries) {
        generateCard(country);
    }
};

const toggleFavorite = (country) => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

    if (favorites.some(fav => fav.name.common === country.name.common)) {
        favorites = favorites.filter(fav => fav.name.common !== country.name.common);
    } else {
        favorites.push(country);
    }

    localStorage.setItem('favorites', JSON.stringify(favorites));
};


const displayFavorites = () => {
    let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
    for (const country of favorites) {
        generateCard(country);
    }
};

const updateCards = () => {
    reset();
    cardsContainer.innerHTML = '';
    createCards();
    displayFavorites();
};

window.addEventListener('load', () => {
    updateCards();
});

export { createCards };