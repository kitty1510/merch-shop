import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.grid}>
          <div className={styles.col}>
            <h3 className={styles.brand}>Merch <span>Shop</span></h3>
            <p>Premium merchandise and smart devices from Healthy Living Corporation. Crafted for those who live with purpose.</p>
          </div>
          <div className={styles.col}>
            <h3>Shop</h3>
            <div className={styles.links}>
              <Link href="#products">All Products</Link>
              <Link href="#features">Smart Ring</Link>
              <Link href="#specs">Tech Specs</Link>
            </div>
          </div>
          <div className={styles.col}>
            <h3>Company</h3>
            <div className={styles.links}>
              <Link href="https://helicorp.vn" target="_blank" rel="noopener">helicorp.vn</Link>
              <Link href="#">About Us</Link>
              <Link href="#">Careers</Link>
              <Link href="#">Contact</Link>
            </div>
          </div>
          <div className={styles.col}>
            <h3>Legal</h3>
            <div className={styles.links}>
              <Link href="#">Privacy Policy</Link>
              <Link href="#">Terms of Service</Link>
              <Link href="#">Shipping Policy</Link>
              <Link href="#">Return Policy</Link>
            </div>
          </div>
        </div>
        <div className={styles.bottom}>
          <p>&copy; {new Date().getFullYear()} Healthy Living Corporation. All rights reserved.</p>
          <p className={styles.tagline}>Made with ❤️ in Vietnam</p>
        </div>
      </div>
    </footer>
  );
}
