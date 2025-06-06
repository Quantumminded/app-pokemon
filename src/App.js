import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Routes, Route, Link } from "react-router-dom";
import Home from "./components/Home";
import Card from "./components/Card";
import Game from "./components/Game";
import MemoryGame from "./components/MemoryGame";
import './App.css';

function App() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    axios.get('https://pokeapi.co/api/v2/pokemon?limit=20')
      .then(response => {
        setPokemon(response.data.results);
      })
      .catch(error => console.error('Error fetching Pokémon:', error));
  }, []);

  return (
    <div className="App">
      <nav className="navbar">
        <Link to="/">Home</Link>
        <Link to="/memory-game">Memory Game</Link>
        <Link to="/game">Game</Link>
      </nav>
      <Routes>
        <Route index element={<Home />} />
        <Route path="pokemon/:id" element={<Card />} />
        <Route path="game" element={<Game />} />
        <Route path="memory-game" element={<MemoryGame />} />
      </Routes>
    </div>
  );
}

export default App;
