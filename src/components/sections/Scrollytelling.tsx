"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Scrollytelling.module.css";

const scenes = [
  {
    id: "s1",
    eyebrow: "Chapter 01",
    title: "Born from Obsession",
    body: "Years of research, hundreds of prototypes, one goal: a ring that disappears on your finger while silently safeguarding your health 24/7.",
    accent: "#6366f1",
    emoji: "🔬",
  },
  {
    id: "s2",
    eyebrow: "Chapter 02",
    title: "Titanium. Medical-Grade.",
    body: "Grade 5 Titanium — the same alloy used in aerospace and surgical implants. Feather-light at 3.5g, built to survive anything your life throws at it.",
    accent: "#10b981",
    emoji: "⚙️",
  },
  {
    id: "s3",
    eyebrow: "Chapter 03",
    title: "Your Body, Decoded",
    body: "Heart rate, HRV, SpO2, skin temperature, sleep architecture — read in real-time by three embedded optical sensors, processed by an on-ring dual-core ARM chip.",
    accent: "#f59e0b",
    emoji: "📡",
  },
  {
    id: "s4",
    eyebrow: "Chapter 04",
    title: "Seven Days. Always On.",
    body: "Forget daily charging rituals. Wear it for a full week through workouts, showers, swims, and sleep. When it does need power, 60 minutes tops it off wirelessly.",
    accent: "#8b5cf6",
    emoji: "⚡",
  },
];

function Scene({
  scene,
  index,
}: {
  scene: (typeof scenes)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0.1, 0.3, 0.7, 0.9], [0, 1, 1, 0]);
  const x = useTransform(
    scrollYProgress,
    [0.1, 0.35],
    [index % 2 === 0 ? -50 : 50, 0]
  );
  const scale = useTransform(scrollYProgress, [0.1, 0.35], [0.9, 1]);

  return (
    <div ref={ref} className={styles.scene}>
      <motion.div
        className={`${styles.sceneContent} ${index % 2 !== 0 ? styles.sceneReverse : ""}`}
        style={{ opacity, x, scale }}
      >
        <div className={styles.sceneVisual}>
          <div
            className={styles.sceneOrb}
            style={{ background: `radial-gradient(circle, ${scene.accent}44 0%, transparent 70%)` }}
          />
          <div className={styles.sceneEmoji} style={{ borderColor: `${scene.accent}44` }}>
            {scene.emoji}
          </div>
        </div>
        <div className={styles.sceneText}>
          <span className={styles.eyebrow} style={{ color: scene.accent }}>
            {scene.eyebrow}
          </span>
          <h2 className={styles.sceneTitle}>{scene.title}</h2>
          <p className={styles.sceneBody}>{scene.body}</p>
          <div className={styles.sceneLine} style={{ background: scene.accent }} />
        </div>
      </motion.div>
    </div>
  );
}

export function Scrollytelling() {
  return (
    <section className={styles.section}>
      <div className={styles.stickyLabel}>
        <span>The Story</span>
      </div>
      {scenes.map((scene, i) => (
        <Scene key={scene.id} scene={scene} index={i} />
      ))}
    </section>
  );
}
