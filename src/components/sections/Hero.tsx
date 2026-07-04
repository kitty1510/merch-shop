"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./Hero.module.css";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/store/useCartStore";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "40%"]);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "25%"]);
  const yBg2 = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const setCartOpen = useCartStore((s) => s.setCartOpen);

  return (
    <section ref={containerRef} className={styles.hero}>
      {/* Parallax background layers */}
      <motion.div
        className={styles.bgLayer1}
        style={{ y: yBg }}
        suppressHydrationWarning
      />
      <motion.div
        className={styles.bgLayer2}
        style={{ y: yBg2 }}
        suppressHydrationWarning
      />

      <div className={`container ${styles.container}`}>
        {/* Text content */}
        <motion.div
          className={styles.content}
          style={{ y: yText, opacity }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          suppressHydrationWarning
        >
          <motion.div
            className={styles.badge}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            ✦ New Generation
          </motion.div>

          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Your Health,<br />
            <span className="gradient-text">On Your Finger</span>
          </motion.h1>

          <motion.p
            className={styles.description}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Experience the future of wellness tracking with the Helicorp Smart Ring.
            Sleek, titanium design packed with medical-grade sensors. From{" "}
            <strong>$279</strong>.
          </motion.p>

          <motion.div
            className={styles.actions}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
          >
            <button
              className={`btn btn-primary ${styles.primaryBtn}`}
              onClick={() => setCartOpen(true)}
              id="hero-shop-btn"
            >
              <ShoppingBag size={18} />
              Shop Now
            </button>
            <a href="#features" className={`btn btn-secondary ${styles.secondaryBtn}`} id="hero-explore-btn">
              Explore Features <ArrowRight size={18} />
            </a>
          </motion.div>

          <motion.div
            className={styles.stats}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            {[
              { value: "7 Days", label: "Battery Life" },
              { value: "100m", label: "Water Resistant" },
              { value: "99%", label: "Accuracy" },
            ].map((s) => (
              <div key={s.label} className={styles.stat}>
                <span className={styles.statValue}>{s.value}</span>
                <span className={styles.statLabel}>{s.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Ring image with multi-layer parallax */}
        <motion.div
          className={styles.imageContainer}
          style={{ y, opacity }}
          suppressHydrationWarning
        >
          <div className={styles.glow} />
          <motion.div
            className={styles.imageWrapper}
            initial={{ scale: 0.85, opacity: 0, rotate: -5 }}
            animate={{ scale: 1, opacity: 1, rotate: 0 }}
            transition={{ duration: 1.4, delay: 0.2, ease: "easeOut" }}
            whileHover={{ scale: 1.03, rotate: 2 }}
          >
            <div className={styles.ringPlaceholder}>
              <div className={styles.ringOuter}>
                <div className={styles.ringInner}>
                  <div className={styles.ringCore} />
                </div>
              </div>
              <div className={styles.ringLabel}>Smart Ring</div>
            </div>
          </motion.div>
          <div className={styles.orbitRing} />
          <div className={styles.floatDot1} />
          <div className={styles.floatDot2} />
          <div className={styles.floatDot3} />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className={styles.scrollIndicator}
        style={{ opacity }}
        animate={{ y: [0, 8, 0] }}
        transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        suppressHydrationWarning
      >
        <div className={styles.scrollLine} />
        <span>Scroll</span>
      </motion.div>
    </section>
  );
}
