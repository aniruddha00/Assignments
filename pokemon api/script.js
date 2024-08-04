document.addEventListener("DOMContentLoaded", () => {
    const pokemonListElement = document.getElementById("pokemon-list");
    const detailsElement = document.getElementById("details");
    const searchInput = document.getElementById("search");

    let allPokemons = [];
    let filteredPokemons = [];

    // Fetch the list of Pokémon
    fetch('https://pokeapi.co/api/v2/pokemon?limit=60') //we can edit limit to any number understood in the session 
        .then(response => response.json())
        .then(data => {
            allPokemons = data.results;
            filteredPokemons = allPokemons;
            displayPokemons(filteredPokemons);
        })
        .catch(error => console.error('Error fetching Pokémon list:', error));

    function displayPokemons(pokemons) {
        pokemonListElement.innerHTML = '';
        pokemons.forEach((pokemon,index) => {
            const pokemonItem = document.createElement('div');
            pokemonItem.className = 'pokemon-item';
            pokemonItem.innerHTML = `
                <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${index+1}.png" alt="${pokemon.name}">
                <div>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
            `;
            pokemonItem.addEventListener('click', () => fetchPokemonDetails(pokemon.url));
            pokemonListElement.appendChild(pokemonItem);
        });
    }

    function fetchPokemonDetails(url) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                detailsElement.innerHTML = `
                    <h3>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h3>
                    <img src="${data.sprites.front_default}" alt="${data.name}">
                    <p><strong>Height:</strong> ${data.height / 10} m</p>
                    <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
                    <p><strong>Type:</strong> ${data.types.map(typeInfo => typeInfo.type.name).join(', ')}</p>
                    <p><strong>Abilities:</strong> ${data.abilities.map(abilityInfo => abilityInfo.ability.name).join(', ')}</p>
                `;
            })
            .catch(error => console.error('Error fetching Pokémon details:', error));
    }

    searchInput.addEventListener('input', () => {
        const query = searchInput.value.toLowerCase();
        filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query));
        displayPokemons(filteredPokemons);
    });
});
