import styles from "../styles/components.module.scss";

export default function Button({ visibility, isDisabled }) {
  if (visibility === true) {
    return (
      <div className={styles.left}>
        <img src="/Loader.gif" alt="Loader" />
      </div>
    );
  }

  if (isDisabled === true) {
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
