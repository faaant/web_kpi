import styles from "./burger.module.scss";

export default function Burger() {
  return (
    <div className={styles.container}>
      <input type="checkbox" id={styles.checker} />
      <label htmlFor={styles.checker}>
        <div className={styles.burger} tabIndex="0"></div>
      </label>
      <label htmlFor={styles.checker}>
        <div className={styles["close-area"]}></div>
      </label>
      <div className={styles.menu}>
        <div className={`${styles.tab + " " + styles["top-distance"]}`}>
          Menu
        </div>
        <div className={styles.tab}>Start</div>
        <div className={styles.tab}>TODO</div>
      </div>
    </div>
  );
}
