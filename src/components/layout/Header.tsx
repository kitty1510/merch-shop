"use client";

import Link from "next/link";
import { Moon, Sun, ShoppingBag, Heart, Menu, X } from "lucide-react";
import { useTheme } from "@/providers/ThemeProvider";
import { useCartStore } from "@/store/useCartStore";
import styles from "./Header.module.css";
import { useEffect, useState, useCallback } from "react";

interface HeaderProps {
  onCartOpen?: () => void;
}

export function Header({ onCartOpen }: HeaderProps) {
  const { theme, toggleTheme } = useTheme();
  const cart = useCartStore((state) => state.cart);
  const favorites = useCartStore((state) => state.favorites);
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0);
  const favCount = favorites.length;

  return (
    <header className={`${styles.header} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <Link href="/" className={styles.logo}>
          Merch <span>Shop</span>
        </Link>

        <nav className={`${styles.nav} ${mobileOpen ? styles.navOpen : ""}`}>
          <Link href="#products" className={styles.navLink} onClick={() => setMobileOpen(false)}>Shop</Link>
          <Link href="#features" className={styles.navLink} onClick={() => setMobileOpen(false)}>Features</Link>
          <Link href="#specs" className={styles.navLink} onClick={() => setMobileOpen(false)}>Tech Specs</Link>
          <Link href="#newsletter" className={styles.navLink} onClick={() => setMobileOpen(false)}>Subscribe</Link>
        </nav>

        <div className={styles.actions}>
          <button
            className={styles.iconButton}
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            id="theme-toggle-btn"
          >
            {mounted && theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {mounted && favCount > 0 && (
            <button className={styles.iconButton} aria-label="Favorites" id="favorites-btn">
              <Heart size={20} fill="currentColor" style={{ color: "#f43f5e" }} />
              <span className={styles.badge}>{favCount}</span>
            </button>
          )}

          <button
            className={styles.iconButton}
            aria-label="Cart"
            id="cart-btn"
            onClick={onCartOpen}
          >
            <ShoppingBag size={20} />
            {mounted && cartItemsCount > 0 && (
              <span className={styles.badge}>{cartItemsCount}</span>
            )}
          </button>

          <button
            className={`${styles.iconButton} ${styles.mobileMenuBtn}`}
            aria-label="Menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            id="mobile-menu-btn"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  );
}
