import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MemoryGame.css";

const MemoryGame = () => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [preview, setPreview] = useState(true); // State to control preview mode

  useEffect(() => {
    const fetchPokemon = async () => {
      const response = await axios.get("https://pokeapi.co/api/v2/pokemon?limit=10");
      const pokemonData = response.data.results.map((pokemon, index) => ({
        id: index + 1,
        name: pokemon.name,
        image: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`,
      }));
      const shuffledCards = [...pokemonData, ...pokemonData]
        .sort(() => Math.random() - 0.5)
        .map((card, index) => ({ ...card, uniqueId: index }));
      setCards(shuffledCards);

      // Enable preview mode for 5 seconds
      setPreview(true);
      setTimeout(() => setPreview(false), 5000);
    };

    fetchPokemon();
  }, []);

  const handleCardClick = (card) => {
    if (preview || flippedCards.length === 2 || matchedCards.includes(card.uniqueId)) return;

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      if (firstCard.id === secondCard.id) {
        setMatchedCards([...matchedCards, firstCard.uniqueId, secondCard.uniqueId]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  return (
    <div className="memory-game">
      <h1>Pokémon Memory Game</h1>
      <p>{preview ? "Memorize the cards!" : "Start matching the cards!"}</p>
      <div className="card-grid">
        {cards.map((card) => (
          <div
            key={card.uniqueId}
            className={`card ${preview || flippedCards.includes(card) || matchedCards.includes(card.uniqueId) ? "flipped" : ""}`}
            onClick={() => handleCardClick(card)}
          >
            <div className="card-front">
              <img src={card.image} alt={card.name} />
            </div>
            <div className="card-back">?</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MemoryGame;
