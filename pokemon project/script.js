document.addEventListener("DOMContentLoaded", () => {
    const pokemonListElement = document.getElementById("pokemon-list");
    const detailsElement = document.getElementById("details");
    const searchInput = document.getElementById("search");
    const cartItemsElement = document.getElementById("cart-items");

    let allPokemons = [];
    let filteredPokemons = [];

    // Fetch the list of Pokémon
    fetch('https://pokeapi.co/api/v2/pokemon?limit=100')
        .then(response => response.json())
        .then(data => {
            allPokemons = data.results;
            filteredPokemons = allPokemons;
            displayPokemons(filteredPokemons);
        })
        .catch(error => {
            console.error('Error fetching Pokémon list:', error);
            pokemonListElement.innerHTML = '<p>Error fetching Pokémon list. Please try again later.</p>';
        });

    function createPokemonImage(url, altText) {
        const img = document.createElement('img');
        img.src = url;
        img.alt = altText;
        img.onerror = () => {
            img.src = 'path/to/placeholder-image.png'; // Replace with your local or fallback image
            img.alt = 'Pokémon image not available';
        };
        return img;
    }

    function displayPokemons(pokemons) {
        pokemonListElement.innerHTML = '';
        if (pokemons.length === 0) {
            pokemonListElement.innerHTML = '<p>No Pokémon found</p>';
            return;
        }
        pokemons.forEach((pokemon, index) => {
            const pokemonItem = document.createElement('div');
            pokemonItem.className = 'pokemon-item';
            const pokemonId = index + 1; // Pokémon ID starts at 1
            pokemonItem.innerHTML = `
                ${createPokemonImage(`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemonId}.png`, pokemon.name)}
                <div>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</div>
                <button class="btn-add-to-cart">Add to Cart</button>
            `;
            pokemonItem.querySelector('.btn-add-to-cart').addEventListener('click', (event) => {
                event.stopPropagation();
                addToCart(pokemon);
            });
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
            .catch(error => {
                detailsElement.innerHTML = '<p>Error fetching Pokémon details. Please try again later.</p>';
                console.error('Error fetching Pokémon details:', error);
            });
    }

    function addToCart(pokemon) {
        if (!pokemon) return;
        const cartItem = document.createElement('li');
        cartItem.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
        cartItemsElement.appendChild(cartItem);
        animateAddToCart(pokemon);
    }

    function animateAddToCart(pokemon) {
        // Find the Pokémon item element and the cart button
        const pokemonElement = Array.from(document.querySelectorAll('.pokemon-item')).find(item => item.textContent.includes(pokemon.name));
        if (!pokemonElement) return;
        
        const buttonRect = document.querySelector('.btn-add-to-cart').getBoundingClientRect();
        const itemRect = pokemonElement.getBoundingClientRect();
        
        // Clone the Pokémon image for animation
        const img = pokemonElement.querySelector('img');
        const clone = img.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.top = `${itemRect.top}px`;
        clone.style.left = `${itemRect.left}px`;
        clone.style.width = `${itemRect.width}px`;
        clone.style.height = `${itemRect.height}px`;
        clone.style.zIndex = '1000';
        clone.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out';
        document.body.appendChild(clone);

        requestAnimationFrame(() => {
            clone.style.transform = `translate(${buttonRect.left - itemRect.left}px, ${buttonRect.top - itemRect.top}px)`;
            clone.style.width = '0px';
            clone.style.height = '0px';
            clone.style.opacity = '0';
        });

        setTimeout(() => {
            document.body.removeChild(clone);
        }, 500);
    }

    function debounce(func, delay) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    }

    searchInput.addEventListener('input', debounce(() => {
        const query = searchInput.value.toLowerCase();
        filteredPokemons = allPokemons.filter(pokemon => pokemon.name.toLowerCase().includes(query));
        displayPokemons(filteredPokemons);
    }, 300));
});
