"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, ShoppingBag, Star, Package } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/components/ui/Toast";
import { SkeletonCard } from "@/components/ui/SkeletonCard";
import styles from "./ProductGrid.module.css";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  category: string;
  badge?: string;
  rating: number;
  reviewCount: number;
  description: string;
  inStock: boolean;
}

const CATEGORIES = ["All", "Smart Devices", "Accessories", "Apparel"];

export function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const { addToCart, toggleFavorite, isFavorite, addToRecentlyViewed, setCartOpen } = useCartStore();
  const { toast } = useToast();

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((data) => {
        setProducts(data.products ?? []);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        toast("Failed to load products", "error");
      });
  }, [toast]);

  const filtered =
    activeCategory === "All"
      ? products
      : products.filter((p) => p.category === activeCategory);

  const handleAddToCart = (product: Product) => {
    if (!product.inStock) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      category: product.category,
    });
    addToRecentlyViewed({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast(`Added "${product.name}" to cart! 🛍️`, "success");
    setCartOpen(true);
  };

  const handleFavorite = (product: Product) => {
    const wasLiked = isFavorite(product.id);
    toggleFavorite({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
    });
    toast(
      wasLiked
        ? `Removed from favorites`
        : `Added "${product.name}" to favorites ❤️`,
      wasLiked ? "info" : "success"
    );
  };

  return (
    <section id="products" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className={styles.eyebrow}>Official Store</p>
            <h2 className={styles.title}>Shop the Collection</h2>
            <p className={styles.subtitle}>
              Premium products crafted for those who demand the best in health, performance, and style.
            </p>
          </motion.div>

          {/* Category filter */}
          <div className={styles.filters}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`${styles.filterBtn} ${activeCategory === cat ? styles.active : ""}`}
                onClick={() => setActiveCategory(cat)}
                id={`filter-${cat.toLowerCase().replace(/\s/g, "-")}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.grid}>
          {loading ? (
            <SkeletonCard count={6} />
          ) : (
            filtered.map((product, index) => {
              const liked = isFavorite(product.id);
              return (
                <motion.div
                  key={product.id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.07, duration: 0.5 }}
                  onHoverStart={() => setHoveredId(product.id)}
                  onHoverEnd={() => setHoveredId(null)}
                  whileHover={{ y: -6 }}
                >
                  {/* Image area */}
                  <div className={styles.imageWrap}>
                    <div className={styles.imagePlaceholder}>
                      <Package size={56} strokeWidth={1} style={{ color: "var(--primary-color)", opacity: 0.5 }} />
                    </div>

                    {/* Badge */}
                    {product.badge && (
                      <span className={`${styles.badge} ${styles[`badge${product.badge.replace(/\s/g,"")}`]}`}>
                        {product.badge}
                      </span>
                    )}

                    {/* Out of stock overlay */}
                    {!product.inStock && (
                      <div className={styles.outOfStock}>Out of Stock</div>
                    )}

                    {/* Favorite button */}
                    <motion.button
                      className={`${styles.favoriteBtn} ${liked ? styles.favoriteLiked : ""}`}
                      onClick={() => handleFavorite(product)}
                      aria-label="Toggle favorite"
                      whileTap={{ scale: 1.3 }}
                      animate={liked ? { scale: [1, 1.3, 1] } : {}}
                      transition={{ duration: 0.3 }}
                    >
                      <Heart
                        size={18}
                        fill={liked ? "currentColor" : "none"}
                      />
                    </motion.button>
                  </div>

                  {/* Info */}
                  <div className={styles.info}>
                    <p className={styles.category}>{product.category}</p>
                    <h3 className={styles.name}>{product.name}</h3>
                    <p className={styles.description}>{product.description}</p>

                    {/* Rating */}
                    <div className={styles.rating}>
                      <span className={styles.stars}>
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            size={13}
                            fill={i < Math.floor(product.rating) ? "currentColor" : "none"}
                            style={{ color: "#f59e0b" }}
                          />
                        ))}
                      </span>
                      <span>{product.rating}</span>
                      <span className={styles.reviewCount}>({product.reviewCount.toLocaleString()})</span>
                    </div>

                    {/* Price row */}
                    <div className={styles.priceRow}>
                      <div className={styles.priceGroup}>
                        <span className={styles.price}>${product.price}</span>
                        {product.originalPrice && (
                          <span className={styles.originalPrice}>${product.originalPrice}</span>
                        )}
                      </div>
                      {product.originalPrice && (
                        <span className={styles.discount}>
                          -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    <motion.button
                      className={`btn btn-primary ${styles.addBtn} ${!product.inStock ? styles.addBtnDisabled : ""}`}
                      onClick={() => handleAddToCart(product)}
                      disabled={!product.inStock}
                      whileTap={product.inStock ? { scale: 0.96 } : {}}
                      id={`add-to-cart-${product.id}`}
                    >
                      {hoveredId === product.id && product.inStock ? (
                        <>
                          <ShoppingBag size={16} />
                          Add to Cart
                        </>
                      ) : product.inStock ? (
                        "Add to Cart"
                      ) : (
                        "Sold Out"
                      )}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}
