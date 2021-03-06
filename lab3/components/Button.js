import styles from "../styles/Button.module.scss";

export default function Button({ visibility, isDisabled }) {
  if (visibility) {
    return (
      <div className={styles.left}>
        <img src="/loader.gif" alt="Loader" />
      </div>
    );
  }

  if (isDisabled) {
    return (
      <div className={styles.left}>
        <input type="submit" value="Send" disabled />
      </div>
    );
  }

  return (
    <div className={styles.left}>
      <input type="submit" value="Send" />
    </div>
  );
}
