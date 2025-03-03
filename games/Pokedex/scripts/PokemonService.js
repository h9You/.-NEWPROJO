const getPokemon = async () => {
    try {
        const res = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const data = await res.json();
        
        const pokemonDetails = await Promise.all(
            data.results.map(async (pokemon) => {
                const response = await fetch(pokemon.url);
                return await response.json();
            })
        );
        
        return pokemonDetails;
    } catch (error) {
        console.error('Failed to fetch Pokemon', error);
    }
};

const pokemonFull = await getPokemon();
let pokemon = [...pokemonFull];

const reset = () => {
    pokemon = [...pokemonFull];
};

const search = (word) => {
    pokemon = pokemonFull.filter((poke) => {
        const name = poke.name.toLowerCase();
        const formatedWord = word.toLowerCase();
        return name.includes(formatedWord);
    });
};

export { pokemon, search, reset };