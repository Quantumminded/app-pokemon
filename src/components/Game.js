import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Game.css";

const Game = () => {
  const [pokemon1, setPokemon1] = useState(null);
  const [pokemon2, setPokemon2] = useState(null);
  const [winner, setWinner] = useState(null);

  const fetchRandomPokemon = async () => {
    const id1 = Math.floor(Math.random() * 150) + 1; // Random ID between 1 and 150
    const id2 = Math.floor(Math.random() * 150) + 1;

    const [poke1, poke2] = await Promise.all([
      axios.get(`https://pokeapi.co/api/v2/pokemon/${id1}`),
      axios.get(`https://pokeapi.co/api/v2/pokemon/${id2}`)
    ]);

    setPokemon1(poke1.data);
    setPokemon2(poke2.data);
    setWinner(null); // Reset winner
  };

  const determineWinner = () => {
    if (!pokemon1 || !pokemon2) return;

    const stats1 = pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0);
    const stats2 = pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0);

    if (stats1 > stats2) {
      setWinner(pokemon1);
    } else if (stats2 > stats1) {
      setWinner(pokemon2);
    } else {
      setWinner("Draw");
    }
  };

  useEffect(() => {
    fetchRandomPokemon();
  }, []);

  return (
    <div className="game">
      <h1>Pokémon Battle</h1>
      <div className="battle-container">
        {pokemon1 && (
          <div className="pokemon-card">
            <h2>{pokemon1.name}</h2>
            <img
              src={pokemon1.sprites.other["dream_world"].front_default || pokemon1.sprites.front_default}
              alt={pokemon1.name}
            />
            <p>Total Stats: {pokemon1.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</p>
          </div>
        )}
        {pokemon2 && (
          <div className="pokemon-card">
            <h2>{pokemon2.name}</h2>
            <img
              src={pokemon2.sprites.other["dream_world"].front_default || pokemon2.sprites.front_default}
              alt={pokemon2.name}
            />
            <p>Total Stats: {pokemon2.stats.reduce((sum, stat) => sum + stat.base_stat, 0)}</p>
          </div>
        )}
      </div>
      <button onClick={determineWinner} className="battle-button">Battle!</button>
      <button onClick={fetchRandomPokemon} className="reset-button">New Battle</button>
      {winner && (
        <div className="winner">
          {winner === "Draw" ? <h2>It's a Draw!</h2> : <h2>Winner: {winner.name}</h2>}
        </div>
      )}
    </div>
  );
};

export default Game;
