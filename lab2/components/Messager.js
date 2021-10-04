import styles from "../styles/components.module.scss";

export default function Messager({ message }) {
  if (message.length != 0) {
    return <div className={styles.messager}>{message}</div>;
  }
  return <></>;
}
