// fetchPokemon();

let currentPokemonId = 1;

function createPokemonCard(pokemon) {
    const screenDisplay = document.getElementById("screen-display");
    screenDisplay.innerHTML = "";

    const primaryType = pokemon.elements[0];
    const theme = typeColors[primaryType];
    screenDisplay.style.setProperty('--theme-main', theme.main);
    screenDisplay.style.setProperty('--theme-text', theme.text);
    screenDisplay.style.setProperty('--theme-dark', theme.dark);
    screenDisplay.style.setProperty('--theme-bg', theme.bg);
    
    const headerRow = document.createElement("div");
    const pkImage = document.createElement("img");
    const typeRow = document.createElement("div");
    const moveRow = document.createElement("div");
    const statsRow = document.createElement("div");
    const weaknessRow = document.createElement("div");
    
    headerRow.classList.add("card-header");
    pkImage.classList.add("sprite-img");
    typeRow.classList.add("specs-bar");
    moveRow.classList.add("combat-grid");
    statsRow.classList.add("stats-panel");
    weaknessRow.classList.add("weakness-box");
    
    const pkID = document.createElement("span");
    const pkName = document.createElement("span");
    const pkBST = document.createElement("span");
    
    pkID.classList.add("card-id");
    pkID.textContent = `#${pokemon.id.toString().padStart(4, '0')}`;
    pkName.textContent = pokemon.name.toUpperCase();
    pkBST.textContent = `BST:${pokemon.bst}`;
    
    headerRow.append(pkID, pkName, pkBST);
    
    pkImage.src = pokemon.image;
    
    pokemon.elements.forEach(element => {
        const elementNode = document.createElement("span");
        elementNode.textContent = element.toUpperCase();
        elementNode.classList.add("element-spec");
        typeRow.append(elementNode);
    });

    const pkWeight = document.createElement("span");
    const pkHeight = document.createElement("span");

    pkWeight.textContent = pokemon.weight + " kg";
    pkHeight.textContent = pokemon.height + " m"; 

    typeRow.append(pkWeight, pkHeight);

    const leftCol = document.createElement("div");
    const rightCol = document.createElement("div");
    
    const leftColHeading = document.createElement("div");
    leftColHeading.textContent = "Abilities";
    leftCol.append(leftColHeading);
    
    const rightColHeading = document.createElement("div");
    rightColHeading.textContent = "Moves";
    rightCol.append(rightColHeading);
    
    pokemon.abilities.forEach(abilityName => {
        const abilityNode = document.createElement("div");
        abilityNode.textContent = `» ${abilityName.toUpperCase()}`;
        leftCol.append(abilityNode);
    });
    
    pokemon.moves.forEach(moveName => {
        const moveNode = document.createElement("div");
        moveNode.textContent = `» ${moveName.toUpperCase()}`;
        rightCol.append(moveNode);
    });
    
    moveRow.append(leftCol, rightCol);

    const hpNode = document.createElement("p");
    const atkNode = document.createElement("p");
    const defNode = document.createElement("p");
    const spdNode = document.createElement("p");
    
    hpNode.textContent = `HP: ${pokemon.hp}`;
    atkNode.textContent = `ATK: ${pokemon.attack}`;
    defNode.textContent = `DEF: ${pokemon.defense}`;
    spdNode.textContent = `SPD: ${pokemon.speed}`;
    
    statsRow.append(hpNode, atkNode, defNode, spdNode);
    
    const weaknesses = typeWeaknesses[primaryType];
    
    const weaknessLabel = document.createElement("span");
    const weaknessValues = document.createElement("span");
    
    weaknessLabel.textContent = "⚠️ WEAKNESS: ";
    weaknessValues.textContent = weaknesses.join(", ").toUpperCase();
    
    weaknessRow.append(weaknessLabel, weaknessValues);

    screenDisplay.append(headerRow, pkImage, typeRow, moveRow, statsRow, weaknessRow);
}

async function fetchPokemon() {
    try {

        document.getElementById("screen-display").innerHTML =
        `<div class="welcome-msg">
            <p>Scanning...</p>
            </div>`;
        const inputPokemon = document.getElementById("pokemonInput").value;
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${inputPokemon}`);

        if (!response.ok) {
            throw new Error("Could not find pokemon");
        }
                
        const data = await response.json();

        const pokemon = {
            id: data.id,
            name: data.name,
            image: data.sprites.other["official-artwork"].front_default,
            elements: data.types.map(item => item.type.name),
            height: data.height / 10,
            weight: data.weight / 10,
            hp: data.stats[0].base_stat,
            attack: data.stats[1].base_stat,
            defense: data.stats[2].base_stat,
            speed: data.stats[5].base_stat,
            bst: data.stats.reduce((total, s) => total + s.base_stat, 0),
            abilities: data.abilities.map(item => item.ability.name),
            moves: data.moves.sort(() => 0.5 - Math.random()).slice(0, 2).map(item => item.move.name)
        };

        currentPokemonId = pokemon.id;

        createPokemonCard(pokemon);
    }

    catch(error){
        document.getElementById("screen-display").innerHTML = `
            <div class="error-msg">
                Pokémon not found!
            </div>`;
    }
}

document.getElementById("pokemonInput").addEventListener("keydown", (event) => {
    if (event.key === 'Enter') {
        event.preventDefault();
        fetchPokemon();
    }
});

function changePokemon(direction) {
    if (direction === 'next') {
        currentPokemonId++;
    }
    else {
        currentPokemonId--;
    }
    if (currentPokemonId < 1) currentPokemonId = 1;
    
    document.getElementById("pokemonInput").value = currentPokemonId;
    fetchPokemon();
}

const typeWeaknesses = {
    fire: ['water', 'ground', 'rock'],
    water: ['grass', 'electric'],
    grass: ['fire', 'ice', 'poison', 'flying', 'bug'],
    electric: ['ground'],
    normal: ['fighting'],
    ice: ['fire', 'fighting', 'rock', 'steel'],
    fighting: ['flying', 'psychic', 'fairy'],
    poison: ['ground', 'psychic'],
    ground: ['water', 'grass', 'ice'],
    flying: ['electric', 'ice', 'rock'],
    psychic: ['bug', 'ghost', 'dark'],
    bug: ['fire', 'flying', 'rock'],
    rock: ['water', 'grass', 'fighting', 'ground', 'steel'],
    ghost: ['ghost', 'dark'],
    dragon: ['ice', 'dragon', 'fairy'],
    dark: ['fighting', 'bug', 'fairy'],
    steel: ['fire', 'fighting', 'ground'],
    fairy: ['poison', 'steel']
};

const typeColors = {
    electric: { main: '#fef08a', text: '#854d0e', dark: '#ca8a04', bg: '#fefce8' },
    fire: { main: '#fee2e2', text: '#991b1b', dark: '#dc2626', bg: '#fef2f2' },
    water: { main: '#dbeafe', text: '#1e40af', dark: '#2563eb', bg: '#f0f9ff' },
    grass: { main: '#d1fae5', text: '#065f46', dark: '#16a34a', bg: '#f0fdf4' },
    psychic: { main: '#fce7f3', text: '#9d174d', dark: '#db2777', bg: '#fdf2f8' },
    ice: { main: '#cffafe', text: '#155e75', dark: '#0891b2', bg: '#ecfeff' },
    dragon: { main: '#e0e7ff', text: '#3730a3', dark: '#4f46e5', bg: '#f5f3ff' },
    dark: { main: '#f1f5f9', text: '#0f172a', dark: '#1e293b', bg: '#fafafa' },
    normal: { main: '#f1f5f9', text: '#475569', dark: '#64748b', bg: '#f8fafc' },
    flying: { main: '#e0e7ff', text: '#283593', dark: '#3f51b5', bg: '#f0f3ff' },
    bug: { main: '#f7fee7', text: '#3f6212', dark: '#65a30d', bg: '#fdfde8' },
    poison: { main: '#f3e8ff', text: '#6b21a8', dark: '#9333ea', bg: '#faf5ff' },
    ground: { main: '#fef9c3', text: '#713f12', dark: '#a16207', bg: '#fefdf0' },
    rock: { main: '#ffedd5', text: '#7c2d12', dark: '#ea580c', bg: '#fff7ed' },
    fighting: { main: '#fee2e2', text: '#7f1d1d', dark: '#b91c1c', bg: '#fff5f5' },
    steel: { main: '#f1f5f9', text: '#334155', dark: '#475569', bg: '#f4f6f8' },
    fairy: { main: '#fce7f3', text: '#9d174d', dark: '#e879f9', bg: '#fff5fb' },
    ghost: { main: '#f3e8ff', text: '#4c1d95', dark: '#6d28d9', bg: '#f5f3ff' }
};