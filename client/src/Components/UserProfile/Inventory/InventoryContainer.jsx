import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import getAllCards from '../../../redux/actions/cards/getAllCards';
import { getUserCards } from '../../../redux/actions/cards/userCards';
import Card from '../../Card/Card';
import css from "./Inventory.module.css";

export default function InventoryContainer() {
  const dispatch = useDispatch();
  const userCards = useSelector(state => state.album.userCards)
  const cards = useSelector((state) => state.album.filteredCards);
  const user = useSelector(state => state.userReducer.user)
  const cardsPerPage = 4;
  const [limit, setLimit] = useState({ min: 0, max: cardsPerPage - 1 });

  useEffect(() => {
    // console.log(user.UserCards);
    dispatch(getAllCards());
    dispatch(getUserCards(user.UserCards, cards))
  }, []);

  useEffect(() => {
    setLimit({ min: 0, max: cardsPerPage - 1 });
  }, [userCards]);

  function pag(e) {
    e.preventDefault();
    const valuePag = Number(e.target.innerText);
    let min = (valuePag - 1) * cardsPerPage;
    let max = valuePag * cardsPerPage - 1;
    if (valuePag === 1) {
      min = 0;
      max = cardsPerPage - 1;
    }
    setLimit({ min, max });
  }

  function pagBack(e) {
    e.preventDefault();
    let min = limit.min - cardsPerPage;
    let max = limit.max - cardsPerPage;
    if (min < 0) {
      min = 0;
      max = cardsPerPage - 1;
    }
    setLimit({ min, max });
  }

  function pagNext(e) {
    e.preventDefault();

    let last = Math.ceil(userCards.length / cardsPerPage) * cardsPerPage - 1;

    let min = limit.min + cardsPerPage;
    let max = limit.max + cardsPerPage;

    if (limit.max >= last && limit.min >= last - cardsPerPage) {
      min = limit.min;
      max = limit.max;
    }
    setLimit({ min, max });
  }

  function paginated() {
    const TotalPag = userCards?.length / cardsPerPage;
    const button = [];
    button.push(
      <button className={css.pag} key="back" onClick={pagBack}>
        {"<"}
      </button>
    );
    for (let i = 0; i < TotalPag; i++) {
      button.push(
        <button className={css.pag} key={i} onClick={pag}>
          {i + 1}
        </button>
      );
    }
    button.push(
      <button className={css.pag} key="next" onClick={pagNext}>
        {">"}
      </button>
    );
    return button;
  }
  return (<div>
    <div className={css.cartas}>
      {userCards?.map((card, index) => {
        if (index <= limit.max && index >= limit.min) {
          return (
            <Card
              key={index}
              id={card?.id}
              name={card?.name}
              image={card?.image}
              cost={card?.cost}
              Gdmg={card?.Gdmg}
              Admg={card?.Admg}
              life={card?.life}
              ability={card?.ability}
              abilities={card?.abilities}
              race={card?.race}
              movement={card?.movement}
            />
          );
        }
      })}
    </div>
    <div className={css.paginated}>{paginated()}</div>
  </div>);
}