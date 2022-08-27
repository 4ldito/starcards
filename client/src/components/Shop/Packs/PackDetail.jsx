import { useFetchCardsPack } from "../../../hooks/useFetchCardsPack";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToShopCart } from "../../../redux/actions/shopCart";
import { favUserPacks } from "../../../redux/actions/cardsPack";
import Swal from "sweetalert2";
import { buyCardPack } from "../../../redux/actions/cardsPack";

import style from "../styles/PackDetail.module.css";


export default function Pack({handleDetail}) {
    
    const pack = useSelector(state => state.cardsPacksReducer.detailPack)
    const dispatch = useDispatch();
    const [quantity, setQuantity] = useState(1);
    const [fav, setFav] = useState({action: 'delete', packId:0})
  
    const user = useSelector((state) => state.userReducer.user);
    const favPacks = useSelector((state) => state.cardsPacksReducer.favUserPacks);
    let searchFaved = favPacks.find(p => p.id === pack.id)
  
  
    const decreaseQuantity = (e) => {
      e.preventDefault();
      if (quantity - 1 <= 0) return;
      setQuantity((state) => state - 1);
    };
  
    const increaseQuantity = (e) => {
      e.preventDefault();
      if (quantity + 1 > pack.stock) return;
      setQuantity((state) => state + 1);
    };
  
    const handleBuyNow = (e) => {
      e.preventDefault();
      pack.quantity = quantity;
      const info = { data: [{ ...pack }] };
  
      if (!user.id) {
        return Swal.fire({
          title: "Error!",
          text: "Inicia sesion primero.",
          icon: "error",
        });
      }
  
      if (checkStock(quantity)) {
        return Swal.fire({
          title: "Error!",
          text: "No hay stock disponible =(",
          icon: "error",
        });
      }
  
      Swal.fire({
        title: `Confrimar`,
        text: `¿Estás seguro que queres comprar ${pack.name} por ${pack.price} stars?`,
        showCancelButton: true,
        confirmButtonText: "Comprar",
      }).then(({ isConfirmed }) => {
        if (isConfirmed) {
          dispatch(buyCardPack(info, user.id));
        }
      });
    };
  
    const checkStock = (totalQuantity) => {
      if (pack.stock && totalQuantity > pack.stock) {
        return true;
      }
      return false;
    };
  
    const handleAddItem = (e) => {
      e.preventDefault();
  
      if (!pack.quantity) pack.quantity = 0;
      const totalQuantity = pack.quantity + quantity;
  
      if (checkStock(totalQuantity)) {
        return Swal.fire({
          title: "Error!",
          text: "No hay stock disponible =(",
          icon: "error",
        });
      }
  
      Swal.fire({
        title: `Carrito`,
        text: `Añadiste ${quantity} de ${pack.name} correctamente al carrito`,
        icon: "success",
      });
      dispatch(addToShopCart(pack, quantity, type, user.id));
    };
  
    const handleFav = (e) => {
      e.preventDefault();
      const userId = user.id
      if (fav.action === 'add') {
        setFav({action:'delete', packId:e.target.id})
        console.log(e.target.id)
        dispatch(favUserPacks({action:'delete', userId:userId, packId:e.target.id}))
      } else {
        setFav({action:'add', packId:e.target.id})
        dispatch(favUserPacks({action:'add', userId:userId, packId:e.target.id}))
      }    
    }
    console.log('pack.cards', pack.cards)
    return (
    
      <div className={style.background} onClick={handleDetail} >
        <div >
        {pack.stock > 0 && <div  name={pack.name} id={pack.id} onSubmit={handleAddItem} key={pack.id} onClick={e => e.stopPropagation()}>
            <p>{pack.name}</p>
            <p>{pack.amount}</p>
            <p>{pack.race}</p>
    
            {pack.cards.map((card) => {
              return <p key={card[0]}> name : {card[0]} probability:{card[1]} </p>;
            })}
            <img src={pack.image} alt={pack.image} className={style.image}/>
          <div className={style.pack}>
       
            
          </div>
          <p>Precio: <span className={style.starsText}>{pack.price} Stars</span></p>
          <p>Stock: <span className={style.stock}>{pack.stock}</span></p>
          <div >
            <button onClick={decreaseQuantity}>-</button>
            <span>{quantity}</span>
            <button onClick={increaseQuantity}>+</button>
          </div>
          <div >
            <button className={`${style.btn} ${style.btnBuyNow}`} onClick={handleBuyNow}>
              Comprar YA
            </button>
            <button className={`${style.btn} ${style.btnAddToCart}`}>Añadir al carrito</button>
            {
              searchFaved === undefined ?
              <button className={`${style.btn} ${style.btnAddToCart}`} id={pack.id} onClick={handleFav}>Fav</button>
              :
              <button className={`${style.btn} ${style.btnAddToCart}`} id={pack.id} onClick={handleFav}>Unfav</button>
            }
          </div>
        </div>}
        </div>
      </div>
  
    );
  }