import React from "react";
import caclTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import CartItem from "./CartItem";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import { useUser } from "./User";
import { useCart } from "../lib/cartState";
import CloseButton from "./styles/CloseButton";
import Checkout from "./Checkout";

export default function Cart() {
  const { cartOpen, closeCart } = useCart();
  const me = useUser();
  if (!me) return null;
  return (
    <CartStyles open={cartOpen}>
      <header>
        <Supreme>{me.name}'s cart</Supreme>
        <CloseButton onClick={closeCart}>&times;</CloseButton>
      </header>
      <ul>
        {me.cart.map((cartItem) => (
          <CartItem key={cartItem.id} cartItem={cartItem} />
        ))}
      </ul>
      <footer>
        <p>{formatMoney(caclTotalPrice(me.cart))}</p>
        <Checkout />
      </footer>
    </CartStyles>
  );
}
