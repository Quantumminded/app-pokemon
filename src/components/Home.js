import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const typeColors = {
  fire: "#F08030",
  water: "#6890F0",
  grass: "#78C850",
  electric: "#F8D030",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
  normal: "#A8A878",
};

const Home = () => {
  const [pokemonList, setPokemonList] = useState([]);
  const [offset, setOffset] = useState(0); // Track the offset for pagination

  const fetchPokemonDetails = async (offset) => {
    const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=20&offset=${offset}`);
    const detailedPokemonList = await Promise.all(
      response.data.results.map(async (pokemon, index) => {
        const details = await axios.get(pokemon.url);
        return {
          id: offset + index + 1,
          name: pokemon.name,
          types: details.data.types.map((type) => type.type.name),
          image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/dream-world/${offset + index + 1}.svg`,
        };
      })
    );
    setPokemonList((prevList) => [...prevList, ...detailedPokemonList]); // Append new Pokémon to the list
  };

  useEffect(() => {
    fetchPokemonDetails(offset);
  }, [offset]);

  const handleSeeMore = () => {
    setOffset((prevOffset) => prevOffset + 20); // Increase offset by 20 to fetch the next batch
  };

  return (
    <div className="home">
      <h1>Pokémon Cards</h1>
      <div className="links-container">
        <Link to="/game">
          <button className="game-button">Go to Game</button>
        </Link>
        <Link to="/memory-game">
          <button className="memory-button">Play Memory Game</button>
        </Link>
      </div>
      <div className="card-container">
        {pokemonList.map((pokemon) => (
          <div
            key={pokemon.id}
            className="card"
            style={{ backgroundColor: typeColors[pokemon.types[0]] || "#f9f9f9" }}
          >
            <div className="pkmn__container">
              <div className="pkmn__picture">
                <div className="pkmn__cp">#{pokemon.id}</div>
                <img
                  className="pkmn__png object-fill h-28"
                  src={pokemon.image}
                  alt={pokemon.name}
                />
              </div>
              <div className="pkmn__info">
                <div className="pkmn__name">
                  {pokemon.name}
                  <p className="size-medium">
                    Type: {pokemon.types.join(", ")}
                  </p>
                </div>
              </div>
              <Link to={`/pokemon/${pokemon.id}`}>
                <button className="details-button">View Details</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
      <button className="see-more-button" onClick={handleSeeMore}>
        See More
      </button>
    </div>
  );
};

export default Home;
