import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Card = () => {
  const { id } = useParams();
  const [pokemon, setPokemon] = useState(null);

  useEffect(() => {
    axios
      .get(`https://pokeapi.co/api/v2/pokemon/${id}`)
      .then((response) => setPokemon(response.data))
      .catch((error) =>
        console.error("Error fetching Pokémon details:", error)
      );
  }, [id]);

  if (!pokemon) {
    return <div>Loading...</div>;
  }

  return (
    <div className="pokemon-details">
      <h1>{pokemon.name}</h1>
      <img
        src={
          pokemon.sprites.other["dream_world"].front_default ||
          pokemon.sprites.front_default
        }
        alt={pokemon.name}
        className="pokemon-image"
      />
      <p>
        <strong>ID:</strong> {pokemon.id}
      </p>
      <p>
        <strong>Height:</strong> {pokemon.height}
      </p>
      <p>
        <strong>Weight:</strong> {pokemon.weight}
      </p>
      <p>
        <strong>Base Experience:</strong> {pokemon.base_experience}
      </p>
      <p>
        <strong>Abilities:</strong>{" "}
        {pokemon.abilities
          .map((ability) => ability.ability.name)
          .join(", ")}
      </p>
      <p>
        <strong>Stats:</strong>
      </p>
      <ul>
        {pokemon.stats.map((stat) => (
          <li key={stat.stat.name}>
            {stat.stat.name}: {stat.base_stat}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Card;
