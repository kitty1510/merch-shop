"use client";

import { motion } from "framer-motion";
import { Cpu, Droplets, ShieldCheck, Wifi } from "lucide-react";
import styles from "./TechSpecs.module.css";

const specs = [
  {
    category: "Sensors & Tech",
    icon: <Cpu className={styles.icon} size={24} />,
    items: [
      { label: "Heart Rate", value: "Optical PPG" },
      { label: "Temperature", value: "Skin & Ambient" },
      { label: "Motion", value: "3D Accelerometer" },
      { label: "Processor", value: "Dual Core ARM" }
    ]
  },
  {
    category: "Connectivity",
    icon: <Wifi className={styles.icon} size={24} />,
    items: [
      { label: "Bluetooth", value: "Low Energy 5.2" },
      { label: "Sync", value: "Automatic background" },
      { label: "Compatibility", value: "iOS 14+ / Android 10+" },
      { label: "Storage", value: "Up to 3 weeks offline" }
    ]
  },
  {
    category: "Durability",
    icon: <ShieldCheck className={styles.icon} size={24} />,
    items: [
      { label: "Material", value: "Grade 5 Titanium" },
      { label: "Coating", value: "PVD Scratch-resistant" },
      { label: "Inner", value: "Non-allergenic resin" },
      { label: "Weight", value: "3.5 - 4.5 grams" }
    ]
  },
  {
    category: "Water & Battery",
    icon: <Droplets className={styles.icon} size={24} />,
    items: [
      { label: "Water Resistance", value: "100m (10 ATM)" },
      { label: "Battery Life", value: "Up to 7 days" },
      { label: "Charging", value: "Wireless dock" },
      { label: "Charge Time", value: "20% to 100% in 60m" }
    ]
  }
];

export function TechSpecs() {
  return (
    <section id="specs" className={styles.section}>
      <div className="container">
        <div className={styles.header}>
          <h2 className={styles.title}>Technical Specifications</h2>
        </div>
        
        <div className={styles.grid}>
          {specs.map((spec, index) => (
            <motion.div 
              key={spec.category}
              className={styles.card}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
            >
              <h3 className={styles.cardTitle}>
                {spec.icon}
                {spec.category}
              </h3>
              <div className={styles.list}>
                {spec.items.map((item, i) => (
                  <div key={i} className={styles.listItem}>
                    <span>{item.label}</span>
                    <span>{item.value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
