import styles from "../styles/Messager.module.scss";

export default function Messager({ message }) {
  if (message.length) {
    return <div className={styles.messager}>{message}</div>;
  }
  return <></>;
}
