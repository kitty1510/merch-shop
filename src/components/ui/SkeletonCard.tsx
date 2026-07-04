import styles from "./SkeletonCard.module.css";

interface SkeletonCardProps {
  count?: number;
}

function SkeletonCardItem() {
  return (
    <div className={styles.card}>
      <div className={`${styles.image} animate-shimmer`} />
      <div className={styles.body}>
        <div className={`${styles.badge} animate-shimmer`} />
        <div className={`${styles.title} animate-shimmer`} />
        <div className={`${styles.titleShort} animate-shimmer`} />
        <div className={styles.row}>
          <div className={`${styles.price} animate-shimmer`} />
          <div className={`${styles.rating} animate-shimmer`} />
        </div>
        <div className={`${styles.btn} animate-shimmer`} />
      </div>
    </div>
  );
}

export function SkeletonCard({ count = 3 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCardItem key={i} />
      ))}
    </>
  );
}
