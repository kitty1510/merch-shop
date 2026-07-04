"use client";

import { motion } from "framer-motion";
import { Activity, Moon, BatteryCharging } from "lucide-react";
import styles from "./Features.module.css";
import { useCartStore } from "@/store/useCartStore";
import { useToast } from "@/components/ui/Toast";

const features = [
  {
    id: "f1",
    title: "Advanced Sleep Analysis",
    description: "Understand your night like never before. The ring tracks deep sleep, REM, and light sleep stages with 99% accuracy.",
    icon: <Moon size={48} />,
    color: "#8b5cf6",
    stats: [
      { label: "Accuracy", value: "99%" },
      { label: "Data Points", value: "10k+" },
    ],
  },
  {
    id: "f2",
    title: "24/7 Heart Rate & HRV",
    description: "Continuous monitoring of your heart's activity. Detect stress levels and recovery status instantly.",
    icon: <Activity size={48} />,
    color: "#f43f5e",
    stats: [
      { label: "Sampling", value: "Real-time" },
      { label: "Sensors", value: "3 LEDs" },
    ],
  },
  {
    id: "f3",
    title: "7-Day Battery Life",
    description: "Forget the daily charger. With ultra-low power consumption, wear it for a full week without taking it off.",
    icon: <BatteryCharging size={48} />,
    color: "#10b981",
    stats: [
      { label: "Battery Life", value: "7 Days" },
      { label: "Charge Time", value: "60 mins" },
    ],
  },
];

export function Features() {
  const { addToCart, setCartOpen } = useCartStore();
  const { toast } = useToast();

  const handleBuy = () => {
    addToCart({
      id: "ring-obsidian",
      name: "Helicorp Smart Ring – Obsidian",
      price: 299,
      image: "/hero-ring.png",
    });
    toast("Helicorp Smart Ring added to cart! 🛍️", "success");
    setCartOpen(true);
  };

  return (
    <section id="features" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <motion.p
            className={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            What's Inside
          </motion.p>
          <motion.h2
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Engineering meets Biology
          </motion.h2>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Every millimeter is packed with cutting-edge sensors to bring you unparalleled health insights.
          </motion.p>
        </div>

        <div className={styles.featuresGrid}>
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className={`${styles.featureRow} ${index % 2 !== 0 ? styles.reverse : ""}`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.content}>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>

                <div className={styles.statsGrid}>
                  {feature.stats.map((stat, i) => (
                    <div key={i} className={styles.statItem}>
                      <div className={styles.statValue} style={{ color: feature.color }}>
                        {stat.value}
                      </div>
                      <div className={styles.statLabel}>{stat.label}</div>
                    </div>
                  ))}
                </div>

                <button
                  className="btn btn-primary"
                  style={{ marginTop: "2rem" }}
                  onClick={handleBuy}
                  id={`feature-buy-${feature.id}`}
                >
                  Add to Cart — $299
                </button>
              </div>

              <div className={styles.visual}>
                <motion.div
                  className={styles.iconWrapper}
                  style={{ borderColor: `${feature.color}33`, background: `${feature.color}11` }}
                  whileHover={{ scale: 1.08, rotate: 4 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div style={{ color: feature.color }}>{feature.icon}</div>
                </motion.div>
                <div
                  className={styles.iconGlow}
                  style={{ background: `radial-gradient(circle, ${feature.color}22 0%, transparent 70%)` }}
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
