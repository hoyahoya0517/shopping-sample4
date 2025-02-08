import styles from "./page.module.css";

export default function Shop() {
  return (
    <div className={styles.shop}>
      <div className={styles.main}>
        <div className={styles.top}>
          <span>Shop</span>
        </div>
        <div className={styles.center}>현재는 온라인샵만 운영중입니다.</div>
      </div>
    </div>
  );
}
