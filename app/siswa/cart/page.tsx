"use client";

import { FormEvent, useEffect, useState } from "react";
import { ICart, IOrderRequest } from "@/app/types";
import { getCookie, removeCookie } from "@/lib/client-cookie";
import { toast } from "react-toastify";
import { BASE_API_URL } from "@/global";
import { post } from "@/lib/api-bridge";
import { useRouter } from "next/navigation";

const CartPage = () => {
  const [cart, setCart] = useState<ICart | null>(null);

  const router = useRouter();

  useEffect(() => {
    const cartCookie = getCookie("cart");
    if (!cartCookie) {
      setCart(null);
      return;
    }

    const parsed: ICart = JSON.parse(cartCookie);
    setCart(parsed);
  }, []);

  const updateCatatan = (id_menu: number, catatan: string) => {
    if (!cart) return;

    const updatedCart: ICart = {
      ...cart,
      items: cart.items.map((item) =>
        item.id_menu === id_menu ? { ...item, catatan } : item
      ),
    };

    setCart(updatedCart);
    document.cookie = `cart=${encodeURIComponent(
      JSON.stringify(updatedCart)
    )}; path=/`;
  };

  const syncCart = (updatedCart: ICart | null) => {
    if (!updatedCart || updatedCart.items.length === 0) {
      removeCookie("cart");
      setCart(null);
      return;
    }

    setCart(updatedCart);
    document.cookie = `cart=${encodeURIComponent(
      JSON.stringify(updatedCart)
    )}; path=/`;
  };

  const updateQuantity = (id_menu: number, newQty: number) => {
    if (!cart) return;

    const updatedItems = cart.items
      .map((item) =>
        item.id_menu === id_menu ? { ...item, quantity: newQty } : item
      )
      .filter((item) => item.quantity > 0); // auto hapus kalau 0

    syncCart({ ...cart, items: updatedItems });
  };

  const removeItem = (id_menu: number) => {
    if (!cart) return;

    const updatedItems = cart.items.filter((item) => item.id_menu !== id_menu);

    syncCart({ ...cart, items: updatedItems });
  };

  const clearCart = () => {
    syncCart(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const TOKEN = getCookie("token");
      if (!TOKEN) {
        toast.error("Token tidak ditemukan");
        return;
      }

      const cartCookie = getCookie("cart");
      if (!cartCookie) {
        toast.error("Keranjang kosong");
        return;
      }

      const cart: ICart = JSON.parse(cartCookie);

      const payload: IOrderRequest = {
        id_stan: cart.id_stan,
        items: cart.items.map((item) => ({
          id_menu: item.id_menu,
          jumlah: item.quantity,
          catatan: item.catatan ?? "",
        })),
      };

      const url = `${BASE_API_URL}/order/create`;

      const { data } = await post(url, payload, TOKEN);

      if (data?.status) {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastCart",
          type: "success",
        });
        setTimeout(() => router.refresh(), 1000);
        setCart(null);
        removeCookie("cart");
      } else {
        toast(data?.message, {
          hideProgressBar: false,
          containerId: "toastCart",
          type: "warning",
        });
      }
    } catch (error) {
      console.error(error);
      toast("Terjadi kesalahan", {
        hideProgressBar: false,
        containerId: "toastCart",
        type: "error",
      });
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="text-5xl mb-4">🛒</div>
        <h1 className="text-xl font-semibold">Keranjang kosong</h1>
        <p className="text-gray-500">Silakan pilih menu terlebih dahulu</p>
      </div>
    );
  }

  const totalHarga = cart.items.reduce(
    (total, item) => total + item.harga * item.quantity,
    0
  );

  return (
    <div className="max-w-3xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold">Keranjang</h1>

      <div className="space-y-3">
        {cart.items.map((item) => (
          <div
            key={item.id_menu}
            className="space-y-2 rounded-xl border bg-white p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold">{item.nama_menu}</h2>
                <p className="text-sm text-gray-500">
                  Rp {item.harga.toLocaleString()}
                </p>
              </div>

              <div className="text-right space-y-1">
                <p className="text-sm text-gray-600">
                  Rp {(item.harga * item.quantity).toLocaleString()}
                </p>

                {/* QUANTITY CONTROL */}
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.id_menu, item.quantity - 1)
                    }
                    className="h-7 w-7 rounded-lg bg-red-100 text-red-600 font-bold"
                  >
                    −
                  </button>

                  <span className="min-w-5 text-center font-semibold">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() =>
                      updateQuantity(item.id_menu, item.quantity + 1)
                    }
                    className="h-7 w-7 rounded-lg bg-orange-500 text-white font-bold"
                  >
                    +
                  </button>

                  {/* REMOVE ITEM */}
                  <button
                    onClick={() => removeItem(item.id_menu)}
                    className="ml-2 text-xs text-red-500 hover:underline"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
            <textarea
              placeholder="Catatan untuk menu ini (opsional)"
              value={item.catatan ?? ""}
              onChange={(e) => updateCatatan(item.id_menu, e.target.value)}
              className="w-full resize-none rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-orange-400"
              rows={2}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t pt-4">
        <span className="font-semibold text-lg">Total</span>
        <span className="font-bold text-lg text-orange-600">
          Rp {totalHarga.toLocaleString()}
        </span>
      </div>

      <div className="flex gap-3">
        <button
          onClick={clearCart}
          className="w-1/2 rounded-xl border border-red-400 py-3 font-semibold text-red-500 hover:bg-red-50"
        >
          Hapus Semua
        </button>

        <button
          onClick={handleSubmit}
          className="w-1/2 rounded-xl bg-orange-500 py-3 font-semibold text-white hover:bg-orange-600"
        >
          Pesan Sekarang
        </button>
      </div>
    </div>
  );
};

export default CartPage;
