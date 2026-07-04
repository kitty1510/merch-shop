"use client";

import { useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, Heart } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import styles from "./CartDrawer.module.css";

export function CartDrawer() {
  const { cart, favorites, recentlyViewed, isCartOpen, setCartOpen, removeFromCart, updateQuantity, cartTotal } =
    useCartStore();

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCartOpen(false);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [setCartOpen]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isCartOpen]);

  const total = cartTotal();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className={styles.backdrop}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCartOpen(false)}
          />

          {/* Drawer */}
          <motion.div
            className={styles.drawer}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerTitle}>
                <ShoppingBag size={20} />
                <span>Your Cart</span>
                {cart.length > 0 && (
                  <span className={styles.count}>{cart.reduce((t, i) => t + i.quantity, 0)}</span>
                )}
              </div>
              <button
                className={styles.closeBtn}
                onClick={() => setCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={22} />
              </button>
            </div>

            <div className={styles.body}>
              {/* Cart Items */}
              {cart.length === 0 ? (
                <div className={styles.empty}>
                  <ShoppingBag size={48} strokeWidth={1} />
                  <p>Your cart is empty</p>
                  <button className="btn btn-primary" onClick={() => setCartOpen(false)}>
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <div className={styles.items}>
                  <AnimatePresence mode="popLayout">
                    {cart.map((item) => (
                      <motion.div
                        key={item.id}
                        layout
                        className={styles.item}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 80, scale: 0.9 }}
                        transition={{ duration: 0.25 }}
                      >
                        <div className={styles.itemImage}>
                          <Image src={item.image} alt={item.name} fill style={{ objectFit: "contain" }} />
                        </div>
                        <div className={styles.itemInfo}>
                          <p className={styles.itemName}>{item.name}</p>
                          <p className={styles.itemPrice}>${item.price}</p>
                          <div className={styles.qtyControls}>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease"
                            >
                              <Minus size={14} />
                            </button>
                            <span>{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                        <button
                          className={styles.removeBtn}
                          onClick={() => removeFromCart(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 size={16} />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}

              {/* Favorites */}
              {favorites.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>
                    <Heart size={16} fill="currentColor" style={{ color: "#f43f5e" }} />
                    Favorites ({favorites.length})
                  </h4>
                  <div className={styles.miniList}>
                    {favorites.map((fav) => (
                      <div key={fav.id} className={styles.miniItem}>
                        <div className={styles.miniImage}>
                          <Image src={fav.image} alt={fav.name} fill style={{ objectFit: "contain" }} />
                        </div>
                        <span>{fav.name}</span>
                        <span className={styles.miniPrice}>${fav.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Recently Viewed */}
              {recentlyViewed.length > 0 && (
                <div className={styles.section}>
                  <h4 className={styles.sectionTitle}>Recently Viewed</h4>
                  <div className={styles.miniList}>
                    {recentlyViewed.slice(0, 3).map((p) => (
                      <div key={p.id} className={styles.miniItem}>
                        <div className={styles.miniImage}>
                          <Image src={p.image} alt={p.name} fill style={{ objectFit: "contain" }} />
                        </div>
                        <span>{p.name}</span>
                        <span className={styles.miniPrice}>${p.price}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.totalRow}>
                  <span>Subtotal</span>
                  <span className={styles.totalAmount}>${total.toFixed(2)}</span>
                </div>
                <p className={styles.shipping}>Free shipping on orders over $100</p>
                <button className={`btn btn-primary ${styles.checkoutBtn}`}>
                  Checkout → ${total.toFixed(2)}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
