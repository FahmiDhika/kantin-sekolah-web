"use client";

import { useState, useEffect } from "react";
import { IMenu, ICart } from "@/app/types";
import { storeCookie, getCookie, removeCookie } from "@/lib/client-cookie";

interface Props {
  menu: IMenu;
}

const AddToCart = ({ menu }: Props) => {
  const [quantity, setQuantity] = useState<number>(0);

  useEffect(() => {
    const cartCookie = getCookie("cart");
    if (!cartCookie) return;

    const parsed: ICart = JSON.parse(cartCookie);

    if (parsed.id_stan !== menu.stan?.id) return;

    const item = parsed.items.find((i) => i.id_menu === menu.id);

    if (item) {
      setQuantity(item.quantity);
    }
  }, [menu.id, menu.stan?.id]);

  const updateCart = (newQuantity: number) => {
    let cart: ICart;

    const cartCookie = getCookie("cart");

    if (!cartCookie) {
      if (newQuantity <= 0) return;

      cart = {
        id_stan: menu.stan!.id,
        items: [
          {
            id_menu: menu.id,
            nama_menu: menu.nama_menu,
            harga: menu.is_diskon ? menu.harga_diskon : menu.harga_asli,
            quantity: newQuantity,
          },
        ],
      };

      storeCookie("cart", JSON.stringify(cart));
      setQuantity(newQuantity);
      return;
    }

    cart = JSON.parse(cartCookie) as ICart;

    if (cart.id_stan !== menu.stan?.id) {
      cart = {
        id_stan: menu.stan!.id,
        items: [],
      };
    }

    const index = cart.items.findIndex((i) => i.id_menu === menu.id);

    if (newQuantity <= 0) {
      if (index !== -1) cart.items.splice(index, 1);
    } else {
      if (index !== -1) {
        cart.items[index].quantity = newQuantity;
      } else {
        cart.items.push({
          id_menu: menu.id,
          nama_menu: menu.nama_menu,
          harga: menu.is_diskon ? menu.harga_diskon : menu.harga_asli,
          quantity: newQuantity,
        });
      }
    }

    if (cart.items.length === 0) {
      removeCookie("cart");
      setQuantity(0);
      return;
    }

    storeCookie("cart", JSON.stringify(cart));
    setQuantity(newQuantity);
  };

  return (
    <div className="mt-3 flex items-center justify-end gap-5">
      <button
        onClick={() => updateCart(quantity - 1)}
        disabled={quantity === 0}
        className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-red-100 text-red-600 text-lg font-bold"
      >
        −
      </button>

      <span className="font-semibold text-sm lg:text-base">{quantity}</span>

      <button
        onClick={() => updateCart(quantity + 1)}
        className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-orange-500 text-white text-lg font-bold"
      >
        +
      </button>
    </div>
  );
};

export default AddToCart;
