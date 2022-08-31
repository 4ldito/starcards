import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserCards } from "../../../redux/actions/cards/userCards";
import { addDeckCard, getUserDecks, removeDeckCard } from "../../../redux/actions/user";
import { CardContainer } from "../../Card/CardContainer";
import DeckList from "./Decks/DeckList";


import css from "./Inventory.module.css";

export default function InventoryContainer() {
  const dispatch = useDispatch();
  const filteredUserCards = useSelector((state) => state.album.filteredUserCards);
  const cards = useSelector((state) => state.album.cards);
  const userCards = useSelector(state => state.album.userCards);
  const user = useSelector(state => state.userReducer.user);
  const selectedDeck = useSelector(state => state.userReducer.selectedDeck);
  const [bothStacks, setBothStacks] = useState(false);
  const [creatingDeck, setCreatingDeck] = useState(false);
  const [newDeckCards, setNewDeckCards] = useState([]);
  const [actualStackToShow, setActualStackToShow] = useState([]);

  const addCardToDeck = (card, remove, deck) => {
    const newCardI = userCards.findIndex(e => e.id === card.id);
    const cardAlredyInDeck = newDeckCards.find(e => e.id === card.id);
    if (cardAlredyInDeck) {
      cardAlredyInDeck.repeat++;
      setNewDeckCards([...newDeckCards]);
      dispatch(addDeckCard(card.id));
    } else {
      const newCard = { ...userCards[newCardI] };
      newCard.repeat = 1;
      setNewDeckCards([...newDeckCards, newCard]);
      dispatch(addDeckCard(card.id));
    }
  }

  const removeCardFromDeck = (id) => {
    const cardBack = newDeckCards.filter(e => e.id !== id);
    setNewDeckCards(cardBack);
    dispatch(removeDeckCard(id))
  }

  function renderNotRepeat() {
    let cartas = [];
    filteredUserCards?.forEach(e => {
      cartas.push(<CardContainer key={e.id} tamanho='.5' addCardToDeck={addCardToDeck} addButton={bothStacks ? true : false} card={e} repeat={e.repeat} />)
    })
    if (filteredUserCards.length) return cartas
    return <label>Not cards found</label>
  }

  useEffect(() => {
    actualStackToShow.length === 2 ? setBothStacks(true) : setBothStacks(false);
  }, [actualStackToShow]);


  useEffect(() => {
    dispatch(getUserCards(user.UserCards, cards));
  }, [cards]);

  const setVisibleStack = (name) => {
    if (actualStackToShow.includes(name)) {
      setActualStackToShow(actualStackToShow.filter(e => e !== name));
      setBothStacks(false);
    } else {
      setActualStackToShow([...actualStackToShow, name])
    }
  }

  return (<div className={css.InventoryContainer}>
    <button name='cartas' onClick={(e) => { setVisibleStack(e.target.name) }}>Cartas</button>
    <button name='mazos' onClick={(e) => { setVisibleStack(e.target.name) }}>Mazos</button>
    <div className={css.cartasYMazosContainer}>
      {actualStackToShow.includes('cartas') ? <div className={bothStacks ? css.cartasYMazo : css.cartas}>{renderNotRepeat()}</div> : <></>}
      {actualStackToShow.includes('mazos') ? <DeckList selectedDeck={selectedDeck} removeCardFromDeck={removeCardFromDeck} setNewDeckCards={setNewDeckCards} creatingDeck={creatingDeck} setCreatingDeck={setCreatingDeck}
        newDeckCards={newDeckCards} showCards={setVisibleStack} bothStacks={bothStacks}
        enableAddButton={setBothStacks} userId={user.id}></DeckList> : <></>}
    </div>
  </div >);
}
