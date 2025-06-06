import React, { useState, useEffect } from "react";
import axios from "axios";
import "./MemoryGame.css";

const MemoryGame = () => {
  const [cardCount, setCardCount] = useState(null); // Start with no card count selected
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [gameCompleted, setGameCompleted] = useState(false);

  useEffect(() => {
    if (cardCount) {
      fetchPokemonData(cardCount);
    }
  }, [cardCount]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setGameCompleted(true);
    }
  }, [matchedCards, cards]);

  const fetchPokemonData = async (count) => {
    try {
      const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?limit=${count / 2}`);
      const fetchedCards = await Promise.all(
        response.data.results.map(async (pokemon) => {
          const details = await axios.get(pokemon.url);
          return {
            id: details.data.id,
            name: details.data.name,
            image: details.data.sprites.other["dream_world"].front_default || details.data.sprites.front_default,
          };
        })
      );
      const duplicatedCards = [...fetchedCards, ...fetchedCards].map((card, index) => ({
        ...card,
        uniqueId: `${card.id}-${index}`,
      }));
      setCards(duplicatedCards.sort(() => Math.random() - 0.5));
    } catch (error) {
      console.error("Error fetching Pokémon data:", error);
    }
  };

  const handleCardClick = (card) => {
    if (flippedCards.length === 2 || matchedCards.includes(card.id)) return;

    const newFlippedCards = [...flippedCards, card];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstCard, secondCard] = newFlippedCards;
      if (firstCard.id === secondCard.id) {
        setMatchedCards([...matchedCards, firstCard.id, secondCard.id]);
      }
      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const handleCardCountChange = (event) => {
    setCardCount(parseInt(event.target.value, 10));
    setGameCompleted(false);
    setCards([]); // Reset cards when card count changes
  };

  const handleRestart = () => {
    setCardCount(null); // Reset card count to go back to selection
    setGameCompleted(false);
    setCards([]);
    setFlippedCards([]);
    setMatchedCards([]);
  };

  const calculateCardSize = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight - 150; // Account for header and padding
    const columns = Math.ceil(Math.sqrt(cardCount));
    const rows = Math.ceil(cardCount / columns);
    const cardWidth = Math.floor(viewportWidth / columns) - 10; // Subtract gap
    const cardHeight = Math.floor(viewportHeight / rows) - 10; // Subtract gap
    return { width: Math.min(cardWidth, cardHeight), height: Math.min(cardWidth, cardHeight) }; // Ensure square cards
  };

  const cardSize = cardCount ? calculateCardSize() : { width: 100, height: 100 };

  return (
    <div className="memory-game">
      <h1>Pokémon Memory Game</h1>
      {!cardCount ? (
        <div className="card-count-selection">
          <label htmlFor="card-count">Choose number of cards:</label>
          <select id="card-count" onChange={handleCardCountChange}>
            <option value="">Select</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={40}>40</option>
          </select>
        </div>
      ) : gameCompleted ? (
        <div className="game-completed-message">
          <h2>Congratulations! You've matched all the cards!</h2>
          <button className="restart-button" onClick={handleRestart}>Restart Game</button>
        </div>
      ) : (
        <div>
          <button className="restart-button" onClick={handleRestart}>Restart Game</button>
          <div className="card-container-memory">
            {cards.map((card) => (
              <div
                key={card.uniqueId}
                className={`card-memory ${flippedCards.includes(card) || matchedCards.includes(card.id) ? "flipped" : ""}`}
                onClick={() => handleCardClick(card)}
                style={{ width: `${cardSize.width}px`, height: `${cardSize.height}px` }}
              >
                <div className="card-front">
                  <img src={card.image} alt={card.name} style={{ maxWidth: "80%", maxHeight: "80%" }} />
                </div>
                <div className="card-back">?</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MemoryGame;
